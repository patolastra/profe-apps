from __future__ import annotations

import json
import re
import uuid
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional


# ============================================================
# RUNTIME EXECUTOR v1
# ============================================================
# STATUS:
# ACTIVE
#
# PURPOSE:
# Deterministic runtime orchestration layer for SRP parser
# execution.
#
# RESPONSIBILITIES:
# - Runtime invocation orchestration
# - JSON extraction
# - Contract-safe validation
# - Drift classification
# - Traceability preservation
# - Persistence
# - Retry orchestration
#
# NON-RESPONSIBILITIES:
# - Semantic reinterpretation
# - Pedagogical reasoning
# - Continuity invention
# - Hidden normalization
# ============================================================


# ============================================================
# CONFIGURATION
# ============================================================

MAX_RETRIES = 1
TRACE_DIR = Path("./execution_traces")
TRACE_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# DATA MODELS
# ============================================================


@dataclass
class DriftReport:
    semantic_drift: bool = False
    continuity_drift: bool = False
    redistribution_drift: bool = False
    category_drift: bool = False
    warning_drift: bool = False
    structural_drift: bool = False
    overinference_drift: bool = False
    multicourse_drift: bool = False


@dataclass
class ValidationResult:
    contract_safe: bool
    errors: List[str]
    warnings: List[str]


@dataclass
class ExecutionTrace:
    execution_id: str
    timestamp_utc: str
    raw_input: str
    runtime_prompt_path: str
    runtime_output_raw: str
    extracted_json: Optional[Dict[str, Any]]
    validation_result: Dict[str, Any]
    drift_report: Dict[str, Any]
    retry_count: int
    execution_status: str


# ============================================================
# RUNTIME LOADER
# ============================================================


class RuntimeLoader:
    def __init__(self, runtime_path: Path):
        self.runtime_path = runtime_path

    def load(self) -> str:
        if not self.runtime_path.exists():
            raise FileNotFoundError(
                f"Runtime file not found: {self.runtime_path}"
            )

        return self.runtime_path.read_text(encoding="utf-8")


# ============================================================
# RUNTIME CLIENT
# ============================================================
# NOTE:
# This class intentionally remains provider-agnostic.
# Replace invoke() with real LLM provider implementation.
# ============================================================


class RuntimeClient:
    def invoke(self, runtime_prompt: str, raw_input: str) -> str:
        raise NotImplementedError(
            "Runtime invocation provider not implemented."
        )


# ============================================================
# JSON EXTRACTION
# ============================================================


class JsonExtractor:
    JSON_PATTERN = re.compile(r"\{.*\}", re.DOTALL)

    def extract(self, runtime_output: str) -> Dict[str, Any]:
        match = self.JSON_PATTERN.search(runtime_output)

        if not match:
            raise ValueError("No JSON structure detected in runtime output.")

        json_candidate = match.group(0)

        try:
            parsed = json.loads(json_candidate)
        except json.JSONDecodeError as exc:
            raise ValueError(f"Malformed JSON detected: {exc}") from exc

        if not isinstance(parsed, dict):
            raise ValueError("Root JSON structure must be an object.")

        return parsed


# ============================================================
# CONTRACT VALIDATION
# ============================================================


class ContractValidator:
    REQUIRED_TOP_LEVEL_TYPES = (dict,)

    def validate(self, payload: Dict[str, Any]) -> ValidationResult:
        errors: List[str] = []
        warnings: List[str] = []

        if not isinstance(payload, self.REQUIRED_TOP_LEVEL_TYPES):
            errors.append("Payload root structure must be an object.")

        for key, value in payload.items():
            if not isinstance(key, str):
                errors.append("All top-level keys must be strings.")

            if not isinstance(value, dict):
                errors.append(
                    f"Top-level entity '{key}' must contain an object."
                )

        return ValidationResult(
            contract_safe=len(errors) == 0,
            errors=errors,
            warnings=warnings,
        )


# ============================================================
# DRIFT CLASSIFICATION
# ============================================================


class DriftClassifier:
    def classify(
        self,
        validation_result: ValidationResult,
    ) -> DriftReport:
        report = DriftReport()

        if validation_result.errors:
            report.structural_drift = True

        return report


# ============================================================
# TRACE PERSISTENCE
# ============================================================


class TracePersistence:
    def persist(self, trace: ExecutionTrace) -> Path:
        trace_path = TRACE_DIR / f"{trace.execution_id}.json"

        with trace_path.open("w", encoding="utf-8") as handle:
            json.dump(
                asdict(trace),
                handle,
                ensure_ascii=False,
                indent=2,
            )

        return trace_path


# ============================================================
# EXECUTION RESULT
# ============================================================


@dataclass
class ExecutionResult:
    execution_id: str
    execution_status: str
    extracted_json: Optional[Dict[str, Any]]
    validation_result: Dict[str, Any]
    drift_report: Dict[str, Any]
    trace_path: str
    retry_count: int


# ============================================================
# RUNTIME EXECUTOR
# ============================================================


class RuntimeExecutor:
    def __init__(
        self,
        runtime_loader: RuntimeLoader,
        runtime_client: RuntimeClient,
        json_extractor: JsonExtractor,
        contract_validator: ContractValidator,
        drift_classifier: DriftClassifier,
        trace_persistence: TracePersistence,
    ):
        self.runtime_loader = runtime_loader
        self.runtime_client = runtime_client
        self.json_extractor = json_extractor
        self.contract_validator = contract_validator
        self.drift_classifier = drift_classifier
        self.trace_persistence = trace_persistence

    def execute(self, raw_input: str) -> ExecutionResult:
        execution_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc).isoformat()

        runtime_prompt = self.runtime_loader.load()

        retry_count = 0
        runtime_output = ""
        extracted_json: Optional[Dict[str, Any]] = None

        validation_result = ValidationResult(
            contract_safe=False,
            errors=[],
            warnings=[],
        )

        drift_report = DriftReport()

        execution_status = "FAILED"

        while retry_count <= MAX_RETRIES:
            try:
                runtime_output = self.runtime_client.invoke(
                    runtime_prompt=runtime_prompt,
                    raw_input=raw_input,
                )

                extracted_json = self.json_extractor.extract(runtime_output)

                validation_result = self.contract_validator.validate(
                    extracted_json
                )

                drift_report = self.drift_classifier.classify(
                    validation_result
                )

                if validation_result.contract_safe:
                    execution_status = "SUCCESS"
                    break

                if retry_count >= MAX_RETRIES:
                    execution_status = "PARTIAL_FAILURE"
                    break

            except Exception as exc:
                validation_result.errors.append(str(exc))

                if retry_count >= MAX_RETRIES:
                    execution_status = "FAILURE"
                    break

            retry_count += 1

        trace = ExecutionTrace(
            execution_id=execution_id,
            timestamp_utc=timestamp,
            raw_input=raw_input,
            runtime_prompt_path=str(self.runtime_loader.runtime_path),
            runtime_output_raw=runtime_output,
            extracted_json=extracted_json,
            validation_result=asdict(validation_result),
            drift_report=asdict(drift_report),
            retry_count=retry_count,
            execution_status=execution_status,
        )

        trace_path = self.trace_persistence.persist(trace)

        return ExecutionResult(
            execution_id=execution_id,
            execution_status=execution_status,
            extracted_json=extracted_json,
            validation_result=asdict(validation_result),
            drift_report=asdict(drift_report),
            trace_path=str(trace_path),
            retry_count=retry_count,
        )


# ============================================================
# EXAMPLE BOOTSTRAP
# ============================================================
# NOTE:
# Replace RuntimeClient implementation before production use.
# ============================================================


if __name__ == "__main__":
    runtime_loader = RuntimeLoader(
        Path("./runtime/PARSER_RUNTIME_v1.md")
    )

    runtime_client = RuntimeClient()

    executor = RuntimeExecutor(
        runtime_loader=runtime_loader,
        runtime_client=runtime_client,
        json_extractor=JsonExtractor(),
        contract_validator=ContractValidator(),
        drift_classifier=DriftClassifier(),
        trace_persistence=TracePersistence(),
    )

    sample_input = (
        "En segundo cantamos la canción del ritmo y después "
        "no alcanzamos metalófonos."
    )

    result = executor.execute(sample_input)

    print(json.dumps(asdict(result), indent=2, ensure_ascii=False))
