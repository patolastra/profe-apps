from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


# ============================================================
# RUNTIME CLIENT v1
# ============================================================
# STATUS:
# ACTIVE
#
# PURPOSE:
# Deterministic transport layer responsible for:
# - runtime prompt delivery
# - raw input transmission
# - isolated LLM invocation
# - raw response retrieval
#
# NON-RESPONSIBILITIES:
# - semantic interpretation
# - JSON repair
# - validation
# - drift handling
# - continuity reasoning
# ============================================================


# ============================================================
# OPTIONAL OPENAI IMPORT
# ============================================================

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None


# ============================================================
# DATA MODELS
# ============================================================


@dataclass
class InvocationMetadata:
    provider: str
    model: str
    timestamp_utc: str
    temperature: float
    max_tokens: Optional[int]


@dataclass
class RuntimeRequest:
    runtime_prompt: str
    raw_input: str


@dataclass
class RuntimeResponse:
    raw_response: str
    metadata: InvocationMetadata


# ============================================================
# BASE RUNTIME CLIENT
# ============================================================


class BaseRuntimeClient:
    def invoke(
        self,
        runtime_prompt: str,
        raw_input: str,
    ) -> str:
        raise NotImplementedError


# ============================================================
# OPENAI RUNTIME CLIENT
# ============================================================


class OpenAIRuntimeClient(BaseRuntimeClient):
    def __init__(
        self,
        api_key: Optional[str] = None,
        model: str = "gpt-5.5",
        temperature: float = 0.1,
        max_tokens: Optional[int] = None,
    ):
        if OpenAI is None:
            raise ImportError(
                "OpenAI package not installed. Install with: pip install openai"
            )

        self.api_key = api_key or os.getenv("OPENAI_API_KEY")

        if not self.api_key:
            raise ValueError("OPENAI_API_KEY not found.")

        self.client = OpenAI(api_key=self.api_key)

        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens

    # ========================================================
    # PAYLOAD CONSTRUCTION
    # ========================================================

    def _build_messages(
        self,
        runtime_prompt: str,
        raw_input: str,
    ) -> List[Dict[str, str]]:
        return [
            {
                "role": "system",
                "content": runtime_prompt,
            },
            {
                "role": "user",
                "content": raw_input,
            },
        ]

    # ========================================================
    # INVOCATION
    # ========================================================

    def invoke(
        self,
        runtime_prompt: str,
        raw_input: str,
    ) -> str:
        messages = self._build_messages(
            runtime_prompt=runtime_prompt,
            raw_input=raw_input,
        )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )

        if not response.choices:
            raise RuntimeError("LLM provider returned no choices.")

        content = response.choices[0].message.content

        if content is None:
            raise RuntimeError("LLM provider returned empty content.")

        return content

    # ========================================================
    # TRACEABILITY
    # ========================================================

    def build_metadata(self) -> InvocationMetadata:
        return InvocationMetadata(
            provider="openai",
            model=self.model,
            timestamp_utc=datetime.now(timezone.utc).isoformat(),
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )


# ============================================================
# PROVIDER-AGNOSTIC FACTORY
# ============================================================


class RuntimeClientFactory:
    @staticmethod
    def create_openai_client(
        api_key: Optional[str] = None,
        model: str = "gpt-5.5",
        temperature: float = 0.1,
        max_tokens: Optional[int] = None,
    ) -> OpenAIRuntimeClient:
        return OpenAIRuntimeClient(
            api_key=api_key,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
        )


# ============================================================
# EXAMPLE USAGE
# ============================================================


if __name__ == "__main__":
    runtime_prompt = "You are a deterministic parser runtime."

    raw_input = (
        "En segundo alcanzamos a cantar la canción del ritmo "
        "pero faltó tiempo para metalófonos."
    )

    client = RuntimeClientFactory.create_openai_client()

    response = client.invoke(
        runtime_prompt=runtime_prompt,
        raw_input=raw_input,
    )

    print(response)
