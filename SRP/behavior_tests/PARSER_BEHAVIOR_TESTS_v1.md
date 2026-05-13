\# PARSER\_BEHAVIOR\_TESTS\_v1



STATUS: DRAFT

VERSION: v1

COMPATIBILITY:

\- PARSER\_v1\_SPEC\_FREEZE

\- SRP\_SCHEMA\_v3

\- PARSER\_OUTPUT\_CONTRACT\_v1\_FREEZE



PURPOSE:

Behavioral validation suite for SRP parser semantics.



This document defines:

\- semantic expectations

\- continuity expectations

\- redistribution expectations

\- persistence expectations

\- anti-overinference expectations

\- ambiguity handling expectations



This document DOES NOT define:

\- implementation

\- parser code

\- runtime architecture

\- rendering behavior

\- UI behavior



The purpose of this document is to validate:

semantic-operational parser behavior consistency.



\---



\# TEST STRUCTURE



Each test MUST contain:



\- TEST\_ID

\- CATEGORY

\- INPUT

\- EXPECTED\_BEHAVIOR

\- FORBIDDEN\_BEHAVIOR

\- NOTES



Tests validate:

\- parser interpretation behavior

\- continuity derivation

\- persistence thresholds

\- redistribution safety

\- category assignment

\- ambiguity handling

\- semantic preservation



Tests are behavioral.



Tests are NOT implementation-specific.



\---



\# CONTINUITY TESTS



\## TEST\_ID: CT\_001



CATEGORY:

implicit pedagogical continuity



INPUT:

“hay que reforzar la posición del güiro”



EXPECTED\_BEHAVIOR:

\- parser generates operational continuity

\- continuity classified as:

&#x20; 🎵 pendientes\_sala

\- semantic intent preserved

\- no methodology invention



FORBIDDEN\_BEHAVIOR:

\- inventing exercises

\- inventing pedagogy

\- converting into abstract reflection

\- generating multiple fragmented tasks



NOTES:

Explicit reinforcement language implies operational continuity.



\---



\## TEST\_ID: CT\_002



CATEGORY:

partial pedagogical progression



INPUT:

“todavía no logran tocar rápido”



EXPECTED\_BEHAVIOR:

\- parser preserves unresolved progression

\- parser generates continuity persistence

\- continuity remains operationally open

\- no specific pedagogical strategy inferred



FORBIDDEN\_BEHAVIOR:

\- prescribing speed exercises

\- inventing methodology

\- discarding progression state



NOTES:

“todavía no” implies unresolved pedagogical continuity.



\---



\## TEST\_ID: CT\_003



CATEGORY:

successful progression continuity



INPUT:

“ya tienen marcha”



EXPECTED\_BEHAVIOR:

\- parser preserves progress state

\- parser MAY generate open pedagogical continuation

\- continuation MUST remain non-prescriptive



FORBIDDEN\_BEHAVIOR:

\- prescribing next exercises

\- inventing specific advancement path

\- overinterpreting progression



NOTES:

Progress recognition MAY imply future continuity without explicit pedagogy.



\---



\# REDISTRIBUTION TESTS



\## TEST\_ID: RT\_001



CATEGORY:

semantic redistribution



INPUT:

“Hacer PPT con merengues para cantar”



EXPECTED\_BEHAVIOR:

\- parser separates operational actions conservatively

\- parser preserves semantic relationship

\- parser avoids semantic fragmentation



FORBIDDEN\_BEHAVIOR:

\- destroying semantic linkage

\- giant unsegmented persistence block

\- unrelated redistribution



NOTES:

Hybrid semantic segmentation required.



\---



\## TEST\_ID: RT\_002



CATEGORY:

cross-topic continuity preservation



INPUT:

“después seguimos con la canción anterior y luego volvimos al juego”



EXPECTED\_BEHAVIOR:

\- parser preserves operational continuity

\- parser MAY reorganize semantically

\- parser avoids destructive fragmentation



FORBIDDEN\_BEHAVIOR:

\- losing temporal continuity entirely

\- collapsing unrelated operations

\- excessive atomization



NOTES:

Redistribution MUST preserve operational meaning.



\---



\# MULTICOURSE TESTS



\## TEST\_ID: MT\_001



CATEGORY:

safe course separation



INPUT:

“En segundo practicamos la canción. En quinto evaluamos metalófonos.”



EXPECTED\_BEHAVIOR:

\- parser separates content by course

\- no cross-course contamination

\- continuity preserved independently



FORBIDDEN\_BEHAVIOR:

\- merging course contexts

\- assigning shared continuity

\- ambiguous redistribution



NOTES:

Course detection has highest structural priority.



\---



\## TEST\_ID: MT\_002



CATEGORY:

course ambiguity handling



INPUT:

“después seguimos trabajando eso”



EXPECTED\_BEHAVIOR:

\- parser preserves ambiguity if attribution unresolved

\- parser avoids unsafe redistribution

\- parser MAY preserve unresolved attribution



FORBIDDEN\_BEHAVIOR:

\- inventing course ownership

\- aggressive attribution

\- forced redistribution



NOTES:

Ambiguity preservation preferred over unsafe inference.



\---



\# OVERINFERENCE TESTS



\## TEST\_ID: OI\_001



CATEGORY:

anti-overinference



INPUT:

“quizás algún día trabajar jazz”



EXPECTED\_BEHAVIOR:

\- parser preserves as exploratory language ONLY if category policy allows

\- parser avoids automatic operational persistence



FORBIDDEN\_BEHAVIOR:

\- automatic pending generation

\- invented planning continuity

\- forced categorization



NOTES:

Exploratory language alone does not imply continuity.



\---



\## TEST\_ID: OI\_002



CATEGORY:

contextual improvisation



INPUT:

“terminé evaluando individualmente porque no funcionó grupal”



EXPECTED\_BEHAVIOR:

\- parser preserves contextual observation

\- parser avoids converting improvisation into future methodology



FORBIDDEN\_BEHAVIOR:

\- generating persistent evaluation policy

\- inventing future strategy

\- canonizing improvisation



NOTES:

Improvisation ≠ persistent methodology.



\---



\## TEST\_ID: OI\_003



CATEGORY:

emotional filtering



INPUT:

“tengo rechazo con estas niñas”



EXPECTED\_BEHAVIOR:

\- parser preserves operationally relevant observations ONLY

\- parser filters non-operational emotional reaction



FORBIDDEN\_BEHAVIOR:

\- psychologizing

\- emotional reinterpretation

\- institutional escalation inference



NOTES:

Emotional content alone does not generate persistence.



\---



\# PERSISTENCE TESTS



\## TEST\_ID: PT\_001



CATEGORY:

immediate-operational persistence



INPUT:

“hay que traer el parlante”



EXPECTED\_BEHAVIOR:

\- parser generates immediate operational persistence

\- category:

&#x20; 🎒 pendientes\_materiales



FORBIDDEN\_BEHAVIOR:

\- abstract categorization

\- revision-only preservation

\- speculative persistence



NOTES:

Material continuity is immediate-operational.



\---



\## TEST\_ID: PT\_002



CATEGORY:

pedagogical-design persistence



INPUT:

“buscar canciones para Josefa”



EXPECTED\_BEHAVIOR:

\- parser generates pedagogical planning continuity

\- category:

&#x20; 🧠 pendientes\_planificacion



FORBIDDEN\_BEHAVIOR:

\- operational classroom classification

\- speculative repertoire explosion

\- artificial task multiplication



NOTES:

Pedagogical intent explicitly present.



\---



\## TEST\_ID: PT\_003



CATEGORY:

exploratory-development persistence



INPUT:

“posible idea de app para mostrar acordes en línea de tiempo”



EXPECTED\_BEHAVIOR:

\- parser MAY preserve exploratory future development

\- category:

&#x20; 💻 pendientes\_apps



FORBIDDEN\_BEHAVIOR:

\- discarding exploratory development

\- forcing immediate operational continuity

\- converting into classroom task



NOTES:

Exploratory-development category tolerates speculative persistence.



\---



\## TEST\_ID: PT\_004



CATEGORY:

longitudinal-context preservation



INPUT:

“mezclar con clave los motivó más”



EXPECTED\_BEHAVIOR:

\- parser preserves pedagogically useful observation

\- category:

&#x20; 📝 revision



FORBIDDEN\_BEHAVIOR:

\- mandatory continuity generation

\- invented pedagogy

\- forced operational task



NOTES:

Longitudinal contextual memory allowed without operational continuity.



\---



\# CATEGORY DOMINANCE TESTS



\## TEST\_ID: CD\_001



CATEGORY:

operational dominance resolution



INPUT:

“hacer PPT de merengues para cantar”



EXPECTED\_BEHAVIOR:

\- parser prioritizes operational intent

\- planning continuity dominates

\- semantic relationship preserved



FORBIDDEN\_BEHAVIOR:

\- arbitrary category duplication

\- thematic-only categorization

\- operational ambiguity collapse



NOTES:

Operational intent dominates thematic content.



\---



\# AMBIGUITY TESTS



\## TEST\_ID: AT\_001



CATEGORY:

transcription ambiguity resilience



INPUT:

“cantamos pepelota”



EXPECTED\_BEHAVIOR:

\- parser preserves contextual continuity conservatively

\- parser avoids aggressive correction

\- parser MAY preserve uncertain song identity



FORBIDDEN\_BEHAVIOR:

\- hallucinated correction certainty

\- semantic replacement without context

\- destructive normalization



NOTES:

Parser prioritizes contextual resilience.



\---



\## TEST\_ID: AT\_002



CATEGORY:

incomplete sentence resilience



INPUT:

“y después cuando…”



EXPECTED\_BEHAVIOR:

\- parser tolerates incomplete structure

\- parser avoids fabricated continuation

\- parser preserves partial semantic state safely



FORBIDDEN\_BEHAVIOR:

\- hallucinated completion

\- invented continuity

\- forced interpretation



NOTES:

Safe incompleteness preferred over fabricated certainty.



\---



\# DETERMINISM TESTS



\## TEST\_ID: DT\_001



CATEGORY:

semantic stability



INPUT:

Equivalent semantic inputs with minor textual variation.



EXPECTED\_BEHAVIOR:

\- semantically stable operational output

\- stable category assignment

\- stable persistence behavior



FORBIDDEN\_BEHAVIOR:

\- major semantic drift

\- unstable categorization

\- random continuity generation



NOTES:

Parser determinism required for regression stability.



\---



\# FAILURE HANDLING TESTS



\## TEST\_ID: FH\_001



CATEGORY:

safe ambiguity preservation



INPUT:

Highly ambiguous multicourse fragmented narration.



EXPECTED\_BEHAVIOR:

\- parser preserves ambiguity safely

\- parser avoids hallucinated continuity

\- parser prioritizes structural safety



FORBIDDEN\_BEHAVIOR:

\- fabricated structure

\- forced attribution

\- aggressive redistribution



NOTES:

Safe uncertainty preferred over fabricated precision.



\---



\# GLOBAL VALIDATION RULES



The parser MUST prioritize:

\- semantic-operational preservation

\- continuity integrity

\- deterministic consistency

\- conservative redistribution

\- safe ambiguity handling



The parser MUST avoid:

\- hallucinated pedagogy

\- aggressive reinterpretation

\- structural instability

\- artificial continuity

\- speculative persistence leakage



\---



\# FREEZE NOTES



This document defines:

behavioral validation expectations for SRP parser v1.



This document SHOULD evolve ONLY through:

\- regression discoveries

\- parser instability findings

\- semantic contradiction detection

\- operational failure analysis



Behavior tests MUST remain:

\- implementation-independent

\- semantically deterministic

\- operationally conservative

\- regression-safe

