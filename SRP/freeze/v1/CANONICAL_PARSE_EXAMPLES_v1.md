# CANONICAL_PARSE_EXAMPLES_v1

STATUS: FROZEN
VERSION: v1
FREEZE_VERSION: v1
COMPATIBILITY:
- PARSER_v1_SPEC_FREEZE
- PARSER_BEHAVIOR_TESTS_v1_FREEZE
- PARSER_OUTPUT_CONTRACT_v1_FREEZE
- SRP_SCHEMA_v3

PURPOSE:
Canonical semantic-operational parsing examples for SRP parser validation.

This document defines:
- canonical input/output expectations
- operational continuity expectations
- multicourse redistribution behavior
- ambiguity preservation behavior
- persistence expectations
- deterministic semantic expectations

This document exists to:
- validate parser runtime behavior
- validate semantic consistency
- validate regression stability
- validate continuity preservation
- validate operational determinism

This document DOES NOT define:
- parser implementation
- runtime architecture
- UI rendering
- frontend formatting
- persistence engine internals

---

# STRUCTURE

Each canonical example MUST contain:

- EXAMPLE_ID
- CATEGORY
- INPUT
- EXPECTED_OUTPUT
- FORBIDDEN_OUTPUT_BEHAVIOR
- NOTES

Canonical examples validate:
- operational parsing
- semantic redistribution
- continuity derivation
- ambiguity handling
- persistence logic
- multicourse separation
- contract-safe structure
- deterministic operational behavior

Canonical examples are:
- implementation-independent
- semantically deterministic
- operationally conservative
- regression-oriented

---

# CANONICAL EXAMPLES

---

## EXAMPLE_ID: CP_001

CATEGORY:
simple operational continuity

INPUT:

“Hay que reforzar la posición del güiro.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "pendientes_sala": [
    {
      "accion": "reforzar posición del güiro"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- inventing exercises
- inventing methodology
- generating abstract reflection
- generating multiple fragmented tasks

NOTES:
Explicit reinforcement language implies operational continuity.

---

## EXAMPLE_ID: CP_002

CATEGORY:
pedagogical planning continuity

INPUT:

“Buscar canciones para Josefa.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "pendientes_planificacion": [
    {
      "accion": "buscar canciones para Josefa"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- converting into classroom task
- speculative repertoire explosion
- artificial task multiplication

NOTES:
Explicit pedagogical intent detected.

---

## EXAMPLE_ID: CP_003

CATEGORY:
exploratory app persistence

INPUT:

“Posible idea de app para mostrar acordes en línea de tiempo.”

EXPECTED_OUTPUT:

```json
{
  "curso": "GLOBAL",
  "pendientes_apps": [
    {
      "accion": "posible app para mostrar acordes en línea de tiempo"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- forcing immediate implementation
- discarding exploratory persistence
- converting into classroom task

NOTES:
Exploratory-development category tolerates speculative persistence.

---

## EXAMPLE_ID: CP_004

CATEGORY:
longitudinal contextual preservation

INPUT:

“Mezclar con clave los motivó más.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "revision": [
    {
      "observacion": "mezclar con clave motivó más"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- generating mandatory continuity
- inventing pedagogy
- forcing operational task generation

NOTES:
Longitudinal contextual memory preserved without operational continuity.

---

## EXAMPLE_ID: CP_005

CATEGORY:
multicourse redistribution

INPUT:

“En segundo practicamos la canción.
En quinto evaluamos metalófonos.”

EXPECTED_OUTPUT:

```json
{
  "Segundo": {
    "pendientes_sala": [
      {
        "accion": "practicar canción"
      }
    ]
  },
  "Quinto": {
    "revision": [
      {
        "observacion": "evaluación de metalófonos realizada"
      }
    ]
  }
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- cross-course contamination
- merged continuity
- shared operational persistence

NOTES:
Course continuity MUST remain structurally independent.

---

## EXAMPLE_ID: CP_006

CATEGORY:
exploratory language without persistence

INPUT:

“Quizás algún día trabajar jazz.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "revision": [
    {
      "observacion": "mención exploratoria sobre trabajar jazz"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- automatic planning generation
- speculative persistence
- invented project continuity

NOTES:
Exploratory language alone does not imply operational persistence.

---

## EXAMPLE_ID: CP_007

CATEGORY:
partial pedagogical progression

INPUT:

“Todavía no logran tocar rápido.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "revision": [
    {
      "observacion": "progresión incompleta en velocidad de ejecución"
    }
  ],
  "pendientes_sala": [
    {
      "accion": "seguir reforzando velocidad de ejecución"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- prescribing exercises
- inventing methodology
- generating abstract pedagogy

NOTES:
“Todavía no” implies unresolved pedagogical continuity.

---

## EXAMPLE_ID: CP_008

CATEGORY:
critical operational continuity

INPUT:

“Mañana hay evaluación y tengo que llevar la hoja.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "pendientes_materiales": [
    {
      "accion": "llevar hoja de evaluación"
    }
  ],
  "pendientes_sala": [
    {
      "accion": "realizar evaluación"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- continuity loss
- reminder collapse
- redistribution destruction

NOTES:
Critical operational continuity MUST survive redistribution.

---

## EXAMPLE_ID: CP_009

CATEGORY:
safe ambiguity preservation

INPUT:

“Después seguimos con eso.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "warnings": [
    {
      "type": "UNRESOLVED_CONTINUITY_REFERENCE"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- invented ownership
- fabricated continuity
- forced contextual resolution

NOTES:
Unsafe continuity inference MUST be avoided.

---

## EXAMPLE_ID: CP_010

CATEGORY:
malformed transcription resilience

INPUT:

“en segundo cantamos despues metalofonos despues prueba”

EXPECTED_OUTPUT:

```json
{
  "Segundo": {
    "revision": [
      {
        "observacion": "clase incluyó canto, metalófonos y prueba"
      }
    ]
  }
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- destructive normalization
- hallucinated reconstruction
- semantic collapse

NOTES:
Malformed narration MUST remain conservatively parseable.

---

## EXAMPLE_ID: CP_011

CATEGORY:
pronoun ambiguity preservation

INPUT:

“Ella ya lo logró.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "warnings": [
    {
      "type": "AMBIGUOUS_REFERENT"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- hallucinated referent attribution
- invented continuity ownership
- unsafe identity resolution

NOTES:
Ambiguous referents MUST remain unresolved safely.

---

## EXAMPLE_ID: CP_012

CATEGORY:
chunk continuity reassembly

INPUT:

“En séptimo trabajamos ritmo.

[multiple unrelated paragraphs]

Eso mismo hay que seguir reforzándolo.”

EXPECTED_OUTPUT:

```json
{
  "Séptimo": {
    "revision": [
      {
        "observacion": "trabajo de ritmo realizado"
      }
    ],
    "pendientes_sala": [
      {
        "accion": "seguir reforzando trabajo de ritmo"
      }
    ]
  }
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- unrelated continuity reconnection
- cross-topic contamination
- hallucinated semantic linkage

NOTES:
Long-distance continuity MAY reconnect conservatively.

---

## EXAMPLE_ID: CP_013

CATEGORY:
compound overinference prevention

INPUT:

“Quizás después podríamos hacer una banda.
A los niños les gusta tocar juntos.”

EXPECTED_OUTPUT:

```json
{
  "curso": "UNRESOLVED",
  "revision": [
    {
      "observacion": "interés grupal por tocar juntos"
    }
  ]
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- invented ensemble project
- speculative planning continuity
- fabricated future structure

NOTES:
Weak combined signals MUST NOT generate artificial projects.

---

## EXAMPLE_ID: CP_014

CATEGORY:
safe partial collapse recovery

INPUT:

“En quinto...
después la canción...
y en segundo no alcanzamos...”

EXPECTED_OUTPUT:

```json
{
  "Quinto": {
    "warnings": [
      {
        "type": "PARTIAL_CONTINUITY_COLLAPSE"
      }
    ]
  },
  "Segundo": {
    "revision": [
      {
        "observacion": "no alcanzaron a completar actividad"
      }
    ]
  }
}
```

FORBIDDEN_OUTPUT_BEHAVIOR:
- fabricated reconstruction
- aggressive continuity completion
- invented narrative structure

NOTES:
Safe partial preservation preferred over hallucinated reconstruction.

---

# GLOBAL VALIDATION RULES

The parser MUST prioritize:
- semantic-operational preservation
- deterministic continuity
- contract-safe output
- conservative redistribution
- ambiguity preservation
- malformed-input resilience

The parser MUST avoid:
- hallucinated pedagogy
- speculative continuity inflation
- structural instability
- semantic collapse
- continuity leakage
- unsafe ambiguity resolution

---

# FREEZE NOTES

This document defines:
canonical semantic-operational parser examples for SRP v1.

This document SHOULD evolve ONLY through:
- regression discoveries
- semantic instability findings
- continuity corruption detection
- ambiguity failure analysis
- contract incompatibility findings

Canonical examples MUST remain:
- implementation-independent
- semantically deterministic
- operationally conservative
- regression-safe
- contract-oriented