#!/usr/bin/env python3
"""Return concise project state as SessionStart additional context."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    try:
        event = json.load(sys.stdin)
    except (json.JSONDecodeError, UnicodeDecodeError):
        event = {}
    cwd = Path(event.get("cwd") or ".").resolve()
    parts: list[str] = []
    for relative, heading in (
        (".harness/goal.md", "Project goal"),
        (".harness/state.md", "Current state"),
    ):
        path = cwd / relative
        if path.is_file():
            text = path.read_text(encoding="utf-8")[:2800]
            parts.append(f"## {heading}\n\n{text}")

    output = {"continue": True}
    if parts:
        output["hookSpecificOutput"] = {
            "hookEventName": "SessionStart",
            "additionalContext": (
                "AI Harnessの再開情報です。ユーザーの最新指示を優先してください。\n\n"
                + "\n\n".join(parts)
            ),
        }
    json.dump(output, sys.stdout, ensure_ascii=False)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
