# Verification Checklist — SRP Project

Ejecuta esta verificación después de CADA cambio de código.

## 1. Compatibilidad con Freeze Authority (/freeze/v1/)

### Contract Compliance
- [ ] El output sigue siendo compatible con `PARSER_OUTPUT_CONTRACT_v1_FREEZE.md`
- [ ] Campos requeridos presentes: `schema_version`, `fixture_name`, `courses`, `warnings`, `parser_confidence`
- [ ] `courses` es un array de objetos (no dict, no string)
- [ ] `warnings` es un array de objetos (puede estar vacío)
- [ ] `parser_confidence` es un float entre 0.0 y 1.0
- [ ] Cada curso tiene: `course` (string), `detected_categories` (array), `items` (array)
- [ ] Cada item tiene: `category` (string) y `text` (string)
- [ ] Las categorías usadas están en la lista autorizada del contrato

### Schema Compliance
- [ ] El JSON generado es válido (sin errores de sintaxis)
- [ ] Los campos coinciden con `SRP_SCHEMA_v3.json`
- [ ] `schema_version` tiene el valor exacto "SRP_SCHEMA_v3"
- [ ] No se agregaron campos no autorizados en root
- [ ] No se eliminaron campos requeridos
- [ ] Los tipos de datos coinciden con el schema (string, array, float, object)

### Behavioral Compliance
- [ ] El parser NO normaliza contenido (respeta `PARSER_BEHAVIOR_TESTS_v1_FREEZE.md`)
- [ ] El parser NO inventa información no presente en el input
- [ ] El parser NO mezcla contenido entre cursos diferentes
- [ ] Las categorías detectadas corresponden a items realmente presentes

---

## 2. Expected Outputs Integrity

- [ ] Los expected outputs existentes siguen siendo parseables como JSON válido
- [ ] La estructura de los expected outputs no cambió (mismos campos root)
- [ ] Los fixtures correspondientes aún pueden procesarse
- [ ] No se modificaron expected outputs sin actualizar sus fixtures
- [ ] Si se agregó un nuevo expected output, su fixture correspondiente existe

---

## 3. Runtime Execution — Python Backend

### Syntax & Imports
```bash
# Test 1: Verificar sintaxis Python en executor
python -m py_compile executor/runtime_executor_v2.py
python -m py_compile executor/runtime_client_v1.py

# Test 2: Verificar que los imports son válidos
python -c "import sys; sys.path.insert(0, 'executor'); import runtime_executor_v2"
```

### Structural Integrity
- [ ] No hay IndentationError en ningún archivo .py
- [ ] No hay referencias a variables undefined
- [ ] No hay llamadas a funciones que no existen
- [ ] Los métodos de clase están correctamente indentados
- [ ] El bootstrap del executor está fuera de bloques condicionales

### Contract Validator Logic
- [ ] El ContractValidator valida los campos REALES del contrato (no solo dict structure)
- [ ] Valida que `courses` sea array (no dict)
- [ ] Valida que `warnings` sea array
- [ ] Valida que `parser_confidence` sea float
- [ ] Valida que cada curso tenga los campos requeridos

### Drift Classifier Logic
- [ ] El DriftClassifier detecta al menos `structural_drift`
- [ ] Si detecta otros tipos de drift, la lógica es consistente con el spec
- [ ] El DriftReport tiene todos los campos definidos en el código
- [ ] Todos los campos de drift son booleans

---

## 4. Runtime Execution — Frontend (mobile_ui/)

### Server Startup
```bash
# Test: Verificar que el servidor puede iniciarse
cd mobile_ui
timeout 5 python -m http.server 8080 --directory . 2>/dev/null || true
cd ..
```

### HTML/JS Validity
- [ ] No hay errores de sintaxis en index.html
- [ ] Los archivos JavaScript son válidos (sin syntax errors)
- [ ] Las rutas de fetch/API calls son correctas
- [ ] No hay referencias a archivos que no existen
- [ ] Los event listeners están correctamente asignados

### API Integration
- [ ] Si se usa Gemini API, la key está correctamente configurada
- [ ] Las llamadas a API tienen manejo de errores (try/catch)
- [ ] Los formatos de request coinciden con la documentación de la API
- [ ] Los formatos de response se procesan correctamente

---

## 5. JSON Validation — All Data Files

```bash
# Test: Validar todos los JSON del proyecto
python -c "
import json
import os

files_to_check = [
    'freeze/v1/SRP_SCHEMA_v3.json',
    'schemas/SRP_SCHEMA_v3.json',
]

# Agregar todos los expected outputs
for filename in os.listdir('expected_outputs'):
    if filename.endswith('.json'):
        files_to_check.append(f'expected_outputs/{filename}')

errors = []
for filepath in files_to_check:
    try:
        with open(filepath) as f:
            json.load(f)
    except Exception as e:
        errors.append(f'{filepath}: {e}')

if errors:
    print('❌ ERRORES DE JSON:')
    for err in errors:
        print(f'  - {err}')
    exit(1)
else:
    print('✅ Todos los JSON son válidos')
"
```

---

## 6. Cross-File Consistency

### Schema ↔ Contract ↔ Expected Outputs
- [ ] Si modificaste el contrato, ¿el schema refleja esos cambios?
- [ ] Si modificaste el schema, ¿el contrato está actualizado?
- [ ] Si modificaste el schema/contrato, ¿los expected outputs siguen siendo válidos?
- [ ] Los campos requeridos en el schema coinciden con los del contrato

### Executor ↔ Contract
- [ ] Si modificaste el executor, ¿sigue respetando el contrato?
- [ ] El ContractValidator valida exactamente lo que el contrato exige
- [ ] El DriftClassifier detecta las dimensiones que el spec define

### Frontend ↔ Backend
- [ ] Si modificaste el formato de output del executor, ¿el frontend lo puede leer?
- [ ] Si modificaste la estructura del frontend, ¿sigue compatible con el output actual?
- [ ] Las categorías que el frontend muestra coinciden con las del contrato

---

## 7. No-Regression Check (CRÍTICO)

### Archivos protegidos — NO deben modificarse
- [ ] NINGÚN archivo en `/freeze/v1/` fue modificado
- [ ] Los expected outputs existentes NO fueron alterados (solo se pueden agregar nuevos)
- [ ] El contrato freeze NO fue editado
- [ ] El schema freeze NO fue editado
- [ ] Los behavior tests freeze NO fueron editados

### Backward Compatibility
- [ ] Los fixtures antiguos siguen procesándose correctamente
- [ ] El comportamiento documentado en los tests sigue funcionando
- [ ] Los cambios son aditivos (agregan funcionalidad), no destructivos

---

## 8. Bug Detection — Early Warnings

### Logical Bugs
- [ ] No hay loops infinitos en el código
- [ ] No hay condiciones que siempre evalúan a True o False
- [ ] No hay variables que se sobrescriben sin usar su valor anterior
- [ ] No hay funciones que retornan tipos inconsistentes

### Data Flow Bugs
- [ ] Los datos que entran al parser salen con la estructura correcta
- [ ] No hay pérdida de información entre input → parsing → output
- [ ] Los items no se duplican ni se pierden
- [ ] Los cursos no se mezclan entre sí

### API/Integration Bugs
- [ ] Las llamadas a APIs externas tienen timeout
- [ ] Las llamadas a APIs tienen retry logic si corresponde
- [ ] Los errores de API se capturan y reportan correctamente
- [ ] No hay API keys hardcodeadas en el código

### Frontend Bugs
- [ ] Los botones tienen event listeners asignados
- [ ] Los formularios tienen validación antes de submit
- [ ] Los campos de texto no aceptan valores vacíos si son requeridos
- [ ] Los mensajes de error se muestran al usuario

---

## 9. Execution Tests — Run Real Cases

```bash
# Test: Procesar un fixture real y comparar con expected output
python -c "
import json
import sys

# Cargar fixture y expected output
with open('fixtures/fixture_multicurso_fragmentado_operacional_v1.txt') as f:
    fixture_input = f.read()

with open('expected_outputs/expected_fixture_multicurso_fragmentado_operacional_v1.json') as f:
    expected = json.load(f)

# Verificar estructura del expected output
assert 'schema_version' in expected, 'Falta schema_version'
assert 'courses' in expected, 'Falta courses'
assert isinstance(expected['courses'], list), 'courses debe ser array'
assert 'warnings' in expected, 'Falta warnings'
assert isinstance(expected['warnings'], list), 'warnings debe ser array'

print('✅ Expected output tiene estructura válida')
"
```

---

## 10. Final Checkpoint

Antes de declarar el trabajo como "completado":

- [ ] Todos los checks anteriores pasaron ✅
- [ ] No hay warnings o errores en consola
- [ ] El sistema puede ejecutarse de punta a punta sin fallar
- [ ] La documentación refleja los cambios realizados (si corresponde)
- [ ] El usuario puede usar la funcionalidad implementada sin errores

---

## Formato de Reporte de Verificación

Después de ejecutar esta checklist, reportar así:

```
🔍 VERIFICACIÓN COMPLETADA — [timestamp]

Secciones verificadas: 10/10
Checks pasados: 47/50

❌ FALLOS DETECTADOS:
  1. Schema Validation — campo 'protocol_version' faltante en expected output
  2. Runtime Execution — IndentationError en runtime_executor_v2.py línea 351
  3. Contract Validator — valida estructura dict en lugar de campos reales

✅ CORRECCIONES APLICADAS:
  1. Agregado 'protocol_version' a expected_fixture_multicurso_fragmentado_operacional_v1.json
  2. Corregida indentación en runtime_executor_v2.py
  3. Reescrito ContractValidator para validar campos del contrato real

🔄 RE-VERIFICACIÓN:
Checks pasados: 50/50 ✅

Estado: LISTO PARA CONTINUAR
```

---

**SI CUALQUIER CHECK FALLA, DETENTE Y CORRIGE ANTES DE CONTINUAR.**
