#!/usr/bin/env python3
"""
SRP Test Runner
Corre cada fixture contra el prompt actual de Gemini y compara con expected_outputs.
Uso: python test_runner.py
Requiere: GEMINI_API_KEY como variable de entorno
"""

import json
import os
import sys
import time
import unicodedata
import urllib.request
from pathlib import Path

BASE_DIR   = Path(__file__).parent
FIXTURES   = BASE_DIR / "fixtures"
EXPECTED   = BASE_DIR / "expected_outputs"
RESULTS    = BASE_DIR / "test_results"
RESULTS.mkdir(exist_ok=True)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL   = "gemini-2.5-flash"

# Prompt extraído del JS (mobile_ui/index.html, línea 2762)
SRP_GEMINI_PROMPT = """Eres el parser SRP (Sistema de Revisión Pedagógica). Recibes UNA SOLA nota de voz o texto de un profesor de música chileno. Clasifica su contenido en ítems atómicos independientes.

CURSOS VÁLIDOS (usar exactamente estos nombres):
PRIMERO, SEGUNDO, TERCERO, CUARTO, QUINTO, SEXTO, SEPTIMO, OCTAVO, CUERDAS, CASTIGADAS, KIDS CASTIGADAS, RECREO, ENLACE, ORIENTACIÓN

REGLA DE CURSO: Si la nota NO menciona explícitamente un curso, usa "GENERAL". NUNCA inferir ni inventar un curso — la duda siempre va a "GENERAL".
EXCEPCIÓN — Continuidad explícita entre notas: Si la nota indica de forma explícita que es continuación directa de una nota anterior ("siguiendo con lo anterior", "continúo", "complementando lo que dije", "para agregar a lo que grabé", o frases similares), el curso puede heredarse del contexto declarado. Esta excepción aplica SOLO cuando la señal de continuidad está explícita en el texto — no inferir continuidad sin ella.

CATEGORÍAS:
- revision: SOLO para describir lo que realmente ocurrió en una clase ya pasada. Agrupa observaciones relacionadas sobre el mismo aspecto pedagógico en un único ítem sintético (ej: todo lo sobre manejo del material → un ítem; todo lo sobre comportamiento del grupo → un ítem; todo lo sobre una actividad específica → un ítem). NO transcribir cláusula por cláusula — sintetiza. NO colapsar todo en un único ítem. Apunta a 3-8 ítems por clase según la riqueza del audio. Dejar vacío si el audio no describe una clase pasada.
- pendientes_sala: Acciones que ejecutás simplemente llegando a la próxima clase, sin preparación previa (cantar, tocar, reorganizar grupos, avanzar contenido, reforzar rutina).
- pendientes_planificacion: Trabajo que requiere preparación tuya ANTES de la clase (crear material, diseñar actividad, aprender algo para luego enseñarlo, estructurar evaluación).
CRITERIO CLAVE sala vs planificacion: ¿Podés llegar y hacerlo directamente? → sala. ¿Requiere trabajo previo fuera del aula? → planificacion.
- pendientes_materiales: Transporte físico de objetos entre espacios del colegio (llevar instrumentos, imprimir guías). NO incluye casa-colegio.
- pendientes_casa: Tareas operacionales fuera del contexto institucional.
- pendientes_administrativos: Procedimientos formales, documentación oficial.
- pendientes_mensajes: Comunicaciones pendientes con destinatario explícito.
- pendientes_jefatura: Tareas del rol de jefe de curso (actualmente OCTAVO).
- pendientes_apps: Ideas de software o tecnología, incluyendo exploratorias y no inmediatas. Si no menciona curso → curso "GENERAL".
- posible_repertorio: Canciones candidatas a futuro repertorio.

REGLAS CRÍTICAS:
- Si el audio es un saludo, prueba de grabación o no contiene información pedagógica: warnings con "Audio sin contenido pedagógico relevante", todas las categorías vacías [], revision vacío, curso "GENERAL".
- Una idea de app, planificación u otro pendiente sin mención de curso → curso "GENERAL", NO inventar curso.
- Si el contenido va en pendientes_apps / pendientes_planificacion / etc.: NO ponerlo también en revision. Evitar duplicar.
- Describir una dificultad NO crea automáticamente un pendiente_sala.
- Ante ambigüedad de curso, siempre "GENERAL".
- Si el audio menciona varios cursos distintos, crear un objeto por curso.

Devuelve ÚNICAMENTE este JSON (sin texto adicional, sin markdown):
[
  {
    "curso": "NOMBRE_CURSO_o_GENERAL",
    "fecha": "descripción de fecha mencionada o vacío",
    "revision": [{"text": "observación atómica 1"}, {"text": "observación atómica 2"}],
    "categories": {
      "pendientes_sala": [{"text": "..."}],
      "pendientes_planificacion": [{"text": "..."}],
      "pendientes_materiales": [{"text": "..."}],
      "pendientes_casa": [{"text": "..."}],
      "pendientes_administrativos": [{"text": "..."}],
      "pendientes_mensajes": [{"text": "..."}],
      "pendientes_jefatura": [{"text": "..."}],
      "pendientes_apps": [{"text": "..."}],
      "posible_repertorio": [{"text": "..."}]
    },
    "warnings": []
  }
]
Categorías vacías: array vacío []."""

EMOJI_MAP = {
    "revision":                "📝 revision",
    "pendientes_sala":         "🎵 pendientes_sala",
    "pendientes_planificacion":"🧠 pendientes_planificacion",
    "pendientes_materiales":   "📦 pendientes_materiales",
    "pendientes_casa":         "🏠 pendientes_casa",
    "pendientes_administrativos":"📋 pendientes_administrativos",
    "pendientes_mensajes":     "💬 pendientes_mensajes",
    "pendientes_jefatura":     "👥 pendientes_jefatura",
    "pendientes_apps":         "💻 pendientes_apps",
    "posible_repertorio":      "🎼 posible_repertorio",
}


class QuotaAgotadaError(Exception):
    pass


def call_gemini(text, retries=3):
    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )
    payload = {
        "contents": [{"parts": [{"text": SRP_GEMINI_PROMPT + "\n\nTexto de la nota:\n" + text}]}],
        "generationConfig": {"temperature": 0.1},
    }
    data = json.dumps(payload).encode("utf-8")
    req  = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})

    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                result = json.loads(resp.read())
            return result["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 30 * (attempt + 1)
                print(f"  [!] Rate limit (429). Esperando {wait}s...")
                time.sleep(wait)
            elif e.code == 503:
                raise QuotaAgotadaError(f"Servicio no disponible (503)")
            else:
                raise
    raise QuotaAgotadaError("Rate limit persistente — cuota probablemente agotada")


def parse_raw(raw):
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    return json.loads(raw)


def to_schema_v3(gemini_courses, fixture_name):
    courses     = []
    all_warnings = []

    for c in gemini_courses:
        items         = []
        detected_cats = []

        rev_raw = c.get("revision") or ""
        if isinstance(rev_raw, list):
            rev_items = [i.get("text", "").strip() if isinstance(i, dict) else str(i).strip() for i in rev_raw]
        else:
            rev_items = [l.strip() for l in rev_raw.split("\n") if l.strip()]
        for rev_text in rev_items:
            if rev_text:
                items.append({"category": "📝 revision", "text": rev_text})
        if rev_items:
            detected_cats.append("📝 revision")

        for key, emoji in EMOJI_MAP.items():
            if key == "revision":
                continue
            for item in (c.get("categories") or {}).get(key, []):
                t = (item.get("text") or "").strip()
                if t:
                    items.append({"category": emoji, "text": t})
                    if emoji not in detected_cats:
                        detected_cats.append(emoji)

        all_warnings.extend(c.get("warnings") or [])
        courses.append({
            "course":             c.get("curso", "GENERAL"),
            "detected_categories": detected_cats,
            "items":              items,
        })

    return {
        "schema_version":  "SRP_SCHEMA_v3",
        "fixture_name":    fixture_name,
        "courses":         courses,
        "warnings":        all_warnings,
        "parser_confidence": None,
    }


def strip_emoji(cat):
    return cat.split(" ", 1)[-1] if " " in cat else cat


def normalizar_curso(nombre):
    nfkd = unicodedata.normalize("NFKD", nombre.upper())
    return "".join(c for c in nfkd if not unicodedata.combining(c))


def compare(actual, expected):
    issues = []

    act_courses = {normalizar_curso(c["course"]): c for c in actual["courses"]}
    exp_courses = {normalizar_curso(c["course"]): c for c in expected["courses"]}

    missing = set(exp_courses) - set(act_courses)
    extra   = set(act_courses) - set(exp_courses)
    if missing:
        issues.append(f"CURSOS FALTANTES: {sorted(missing)}")
    if extra:
        issues.append(f"CURSOS EXTRA (no esperados): {sorted(extra)}")

    for course_name, exp_c in exp_courses.items():
        act_c = act_courses.get(course_name)
        if not act_c:
            continue

        exp_cats = {strip_emoji(c) for c in exp_c.get("detected_categories", [])}
        act_cats = {strip_emoji(c) for c in act_c.get("detected_categories", [])}

        for cat in exp_cats - act_cats:
            exp_items = [i for i in exp_c["items"] if strip_emoji(i["category"]) == cat]
            issues.append(f"[{course_name}] categoría AUSENTE: {cat} ({len(exp_items)} ítems esperados)")

        for cat in act_cats - exp_cats:
            act_items = [i for i in act_c["items"] if strip_emoji(i["category"]) == cat]
            issues.append(f"[{course_name}] categoría EXTRA: {cat} ({len(act_items)} ítems generados)")

        for cat in exp_cats & act_cats:
            exp_items = [i["text"] for i in exp_c["items"] if strip_emoji(i["category"]) == cat]
            act_items = [i["text"] for i in act_c["items"] if strip_emoji(i["category"]) == cat]
            if len(exp_items) != len(act_items):
                issues.append(
                    f"[{course_name}][{cat}] cantidad: esperado {len(exp_items)}, actual {len(act_items)}"
                )

    return issues


def run():
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY no encontrada. Corré: export GEMINI_API_KEY=tu-key")
        sys.exit(1)

    fixture_files = sorted(FIXTURES.glob("*.txt"))
    summary = []
    errores_consecutivos = 0
    MAX_ERRORES_CONSECUTIVOS = 3

    for fp in fixture_files:
        name         = fp.stem
        expected_path = EXPECTED / f"expected_{name}.json"

        if not expected_path.exists():
            print(f"[!]  Sin expected_output: {name}")
            continue

        print(f"\n{'-'*60}")
        print(f"  {name}")
        print(f"{'-'*60}")

        fixture_text = fp.read_text(encoding="utf-8")
        expected     = json.loads(expected_path.read_text(encoding="utf-8"))

        try:
            raw    = call_gemini(fixture_text)
            parsed = parse_raw(raw)
            actual = to_schema_v3(parsed, name)
            errores_consecutivos = 0
        except QuotaAgotadaError as e:
            print(f"  [X] CUOTA/SERVICIO: {e}")
            summary.append((name, "ERROR"))
            errores_consecutivos += 1
            if errores_consecutivos >= MAX_ERRORES_CONSECUTIVOS:
                print(f"\n{'!'*60}")
                print(f"  ABORTANDO — {MAX_ERRORES_CONSECUTIVOS} errores consecutivos.")
                print(f"  Probable cuota agotada o servicio caído.")
                print(f"{'!'*60}")
                break
            time.sleep(5)
            continue
        except Exception as e:
            print(f"  [X] ERROR Gemini: {e}")
            summary.append((name, "ERROR"))
            errores_consecutivos += 1
            if errores_consecutivos >= MAX_ERRORES_CONSECUTIVOS:
                print(f"\n{'!'*60}")
                print(f"  ABORTANDO — {MAX_ERRORES_CONSECUTIVOS} errores consecutivos.")
                print(f"  Probable cuota agotada o servicio caído.")
                print(f"{'!'*60}")
                break
            time.sleep(5)
            continue

        time.sleep(3)

        # Guardar output real para revisión manual
        out_path = RESULTS / f"actual_{name}.json"
        out_path.write_text(json.dumps(actual, ensure_ascii=False, indent=2), encoding="utf-8")

        issues = compare(actual, expected)

        if not issues:
            print("  [OK] Sin diferencias estructurales")
            summary.append((name, "OK"))
        else:
            for issue in issues:
                print(f"  [!] {issue}")
            summary.append((name, f"DIFF({len(issues)})"))

    print(f"\n{'='*60}")
    print("RESUMEN FINAL")
    print("="*60)
    ok   = sum(1 for _, s in summary if s == "OK")
    err  = sum(1 for _, s in summary if s == "ERROR")
    diff = sum(1 for _, s in summary if s.startswith("DIFF"))
    print(f"Total: {len(summary)}  [OK] OK: {ok}  [!] DIFF: {diff}  [X] ERROR: {err}")
    print(f"\nOutputs reales guardados en: {RESULTS}/")


if __name__ == "__main__":
    run()
