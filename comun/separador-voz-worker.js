// Separador de voz (deuda GZ): un Worker que separa trozos de ~6 s; comun/separador-voz.js abre varios
// en paralelo (uno por núcleo libre) y arma la canción. Modelo UVR-MDX-NET-Inst_HQ_3 (equipo Ultimate
// Vocal Remover), ONNX, con onnxruntime-web en el procesador (WASM). La tarjeta gráfica (WebGPU) se
// descartó: en gráficas Intel integradas Windows la reinicia a la mitad (DXGI_ERROR_DEVICE_HUNG).
// Parámetros de UVR para este modelo: n_fft 6144, hop 1024, dim_f 3072, dim_t 256 (2^8). Salida = instrumental.
// Mensajes:  { tipo: 'iniciar' } → { tipo: 'avance', fase: 'descarga', p } … { tipo: 'iniciado' }
//            { tipo: 'trozo', n, izq, der } (Float32Array de N muestras a 44,1 kHz) → { tipo: 'trozo', n, izq, der }
//            { tipo: 'mp3', izq, der, kbps } → { tipo: 'mp3', mp3 (ArrayBuffer) }
//            cualquier error → { tipo: 'error', mensaje }
'use strict';
const ORT_VER = '1.20.1';
const ORT_BASE = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${ORT_VER}/dist/`;
importScripts(ORT_BASE + 'ort.wasm.min.js');

const MODELO_URLS = [
    'https://huggingface.co/seanghay/uvr_models/resolve/main/UVR-MDX-NET-Inst_HQ_3.onnx',
    'https://huggingface.co/lainlives/audio-separator-models/resolve/main/UVR-MDX-NET-Inst_HQ_3.onnx',
];
const MODELO_BYTES = 66759214;
const CACHE = 'profe-separador-v1';

const NFFT = 6144, HOP = 1024, DIMF = 3072, DIMT = 256;
const N = HOP * (DIMT - 1);            // muestras por trozo (261120 ≈ 5,9 s)
const MEDIO = NFFT / 2;

const avisar = (fase, p) => postMessage({ tipo: 'avance', fase, p });

// ── Modelo: se descarga una vez y queda en el equipo ──
async function modeloBytes() {
    let cache = null;
    try { cache = await caches.open(CACHE); } catch (_) {}
    if (cache) for (const url of MODELO_URLS) {
        const r = await cache.match(url);
        if (r) return new Uint8Array(await r.arrayBuffer());
    }
    let ultimoError = null;
    for (const url of MODELO_URLS) {
        try {
            const r = await fetch(url);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            const total = +r.headers.get('content-length') || MODELO_BYTES;
            const lector = r.body.getReader();
            const out = new Uint8Array(total);
            let n = 0;
            for (;;) {
                const { done, value } = await lector.read();
                if (done) break;
                if (n + value.length > out.length) throw new Error('tamaño inesperado');
                out.set(value, n); n += value.length;
                avisar('descarga', n / total);
            }
            const bytes = n === out.length ? out : out.slice(0, n);
            if (cache) try { await cache.put(url, new Response(bytes)); } catch (_) {}
            return bytes;
        } catch (e) { ultimoError = e; }
    }
    throw new Error('No se pudo descargar el separador (' + (ultimoError?.message || '') + ')');
}

let sesion = null;
async function iniciar() {
    const bytes = await modeloBytes();
    ort.env.wasm.wasmPaths = ORT_BASE;
    ort.env.wasm.numThreads = 1;   // el paralelo lo dan varios Workers (sin aislamiento de origen no hay hilos)
    sesion = await ort.InferenceSession.create(bytes, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
}

// ── FFT de 6144 = 3 × 2048 (radix 2 para 2048 y un paso de radix 3) ──
const M = 2048;
const bitrev = new Uint16Array(M);
for (let i = 0, b = Math.log2(M); i < M; i++) {
    let r = 0; for (let k = 0; k < b; k++) r |= ((i >> k) & 1) << (b - 1 - k);
    bitrev[i] = r;
}
const twC = new Float64Array(M / 2), twS = new Float64Array(M / 2);
for (let i = 0; i < M / 2; i++) { twC[i] = Math.cos(-2 * Math.PI * i / M); twS[i] = Math.sin(-2 * Math.PI * i / M); }
function fft2048(re, im) {   // en el lugar
    for (let i = 0; i < M; i++) {
        const j = bitrev[i];
        if (j > i) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let size = 2; size <= M; size <<= 1) {
        const half = size >> 1, step = M / size;
        for (let i = 0; i < M; i += size) {
            for (let j = 0, k = 0; j < half; j++, k += step) {
                const a = i + j, b = a + half;
                const tr = re[b] * twC[k] - im[b] * twS[k];
                const ti = re[b] * twS[k] + im[b] * twC[k];
                re[b] = re[a] - tr; im[b] = im[a] - ti;
                re[a] += tr; im[a] += ti;
            }
        }
    }
}
const W3C = new Float64Array(NFFT), W3S = new Float64Array(NFFT);
for (let k = 0; k < NFFT; k++) { W3C[k] = Math.cos(-2 * Math.PI * k / NFFT); W3S[k] = Math.sin(-2 * Math.PI * k / NFFT); }
const sR = [0, 1, 2].map(() => new Float64Array(M)), sI = [0, 1, 2].map(() => new Float64Array(M));
// X[k] = Σ_r W^(r·k) · F_r[k mod 2048], F_r = FFT de x[3m + r]
function fft6144(xr, xi, Xr, Xi, kMax) {
    for (let r = 0; r < 3; r++) {
        const R = sR[r], I = sI[r];
        for (let m = 0; m < M; m++) { R[m] = xr[3 * m + r]; I[m] = xi ? xi[3 * m + r] : 0; }
        fft2048(R, I);
    }
    for (let k = 0; k < kMax; k++) {
        const q = k & (M - 1);
        let ar = sR[0][q], ai = sI[0][q];
        const k1 = k, k2 = (2 * k) % NFFT;
        ar += sR[1][q] * W3C[k1] - sI[1][q] * W3S[k1];
        ai += sR[1][q] * W3S[k1] + sI[1][q] * W3C[k1];
        ar += sR[2][q] * W3C[k2] - sI[2][q] * W3S[k2];
        ai += sR[2][q] * W3S[k2] + sI[2][q] * W3C[k2];
        Xr[k] = ar; Xi[k] = ai;
    }
}

const VENT = new Float64Array(NFFT);   // Hann periódica (como torch.hann_window)
for (let i = 0; i < NFFT; i++) VENT[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / NFFT);
const LPAD = N + NFFT;
const ENV = new Float64Array(LPAD);    // suma de ventana² del iSTFT
for (let t = 0; t < DIMT; t++) for (let i = 0; i < NFFT; i++) ENV[t * HOP + i] += VENT[i] * VENT[i];

const fr = new Float64Array(NFFT), fi = new Float64Array(NFFT);
const Xr = new Float64Array(NFFT), Xi = new Float64Array(NFFT);
const pad = new Float64Array(LPAD);

// Trozo [2][N] → espectro del modelo [1, 4, DIMF, DIMT] (canal 1 real, imag; canal 2 real, imag)
function stft(canales, entrada) {
    for (let c = 0; c < 2; c++) {
        const x = canales[c];
        for (let i = 0; i < N; i++) pad[MEDIO + i] = x[i];
        for (let i = 1; i <= MEDIO; i++) { pad[MEDIO - i] = x[i]; pad[MEDIO + N - 1 + i] = x[N - 1 - i]; }   // reflejo
        const baseR = (c * 2) * DIMF * DIMT, baseI = (c * 2 + 1) * DIMF * DIMT;
        for (let t = 0; t < DIMT; t++) {
            const o = t * HOP;
            for (let i = 0; i < NFFT; i++) fr[i] = pad[o + i] * VENT[i];
            fft6144(fr, null, Xr, Xi, DIMF);
            for (let k = 0; k < DIMF; k++) {
                const cero = k < 3;   // los 3 bins más graves van en cero (como UVR)
                entrada[baseR + k * DIMT + t] = cero ? 0 : Xr[k];
                entrada[baseI + k * DIMT + t] = cero ? 0 : Xi[k];
            }
        }
    }
}

// Espectro del modelo → trozo [2][N]
function istft(salida, canales) {
    for (let c = 0; c < 2; c++) {
        pad.fill(0);
        const baseR = (c * 2) * DIMF * DIMT, baseI = (c * 2 + 1) * DIMF * DIMT;
        for (let t = 0; t < DIMT; t++) {
            // espectro completo hermítico; ifft(X) = conj(fft(conj(X))) / NFFT (la parte real basta)
            fr.fill(0); fi.fill(0);
            for (let k = 0; k < DIMF; k++) {
                const r = salida[baseR + k * DIMT + t], im = salida[baseI + k * DIMT + t];
                fr[k] = r; fi[k] = -im;
                if (k > 0) { fr[NFFT - k] = r; fi[NFFT - k] = im; }
            }
            fft6144(fr, fi, Xr, Xi, NFFT);
            const o = t * HOP;
            for (let i = 0; i < NFFT; i++) pad[o + i] += (Xr[i] / NFFT) * VENT[i];
        }
        const y = canales[c];
        for (let i = 0; i < N; i++) { const e = ENV[MEDIO + i]; y[i] = e > 1e-8 ? pad[MEDIO + i] / e : 0; }
    }
}

const entrada = new Float32Array(4 * DIMF * DIMT);
async function separarTrozo(izq, der) {
    stft([izq, der], entrada);
    const out = await sesion.run({ [sesion.inputNames[0]]: new ort.Tensor('float32', entrada, [1, 4, DIMF, DIMT]) });
    const y = [new Float32Array(N), new Float32Array(N)];
    istft(out[sesion.outputNames[0]].data, y);
    return y;
}

// MP3 con lamejs (se carga solo para esto)
function aMp3(izq, der, kbps) {
    importScripts('lame.min.js');
    const L = izq.length, enc = new lamejs.Mp3Encoder(2, 44100, kbps || 128);
    const BL = 1152, partes = [];
    const aInt = v => { v = Math.max(-1, Math.min(1, v)); return v < 0 ? v * 32768 : v * 32767; };
    for (let i = 0; i < L; i += BL) {
        const n = Math.min(BL, L - i), a = new Int16Array(n), b = new Int16Array(n);
        for (let j = 0; j < n; j++) { a[j] = aInt(izq[i + j]); b[j] = aInt(der[i + j]); }
        const buf = enc.encodeBuffer(a, b);
        if (buf.length) partes.push(new Uint8Array(buf));
        if ((i / BL) % 400 === 0) avisar('mp3', i / L);
    }
    const fin = enc.flush();
    if (fin.length) partes.push(new Uint8Array(fin));
    const mp3 = new Uint8Array(partes.reduce((s, p) => s + p.length, 0));
    let o = 0; for (const p of partes) { mp3.set(p, o); o += p.length; }
    return mp3.buffer;
}

onmessage = async e => {
    const d = e.data;
    try {
        if (d.tipo === 'iniciar') { await iniciar(); postMessage({ tipo: 'iniciado' }); }
        else if (d.tipo === 'trozo') {
            const [izq, der] = await separarTrozo(d.izq, d.der);
            postMessage({ tipo: 'trozo', n: d.n, izq, der }, [izq.buffer, der.buffer]);
        }
        else if (d.tipo === 'mp3') { const mp3 = aMp3(d.izq, d.der, d.kbps); postMessage({ tipo: 'mp3', mp3 }, [mp3]); }
    } catch (err) {
        postMessage({ tipo: 'error', mensaje: err?.message || String(err) });
    }
};
