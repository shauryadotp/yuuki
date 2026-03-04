Great instinct. You can do this with a two-layer system prompt so the model knows limits/capabilities but does not anchor on raw numbers.

Use this method:

1. Keep your normal persona/instruction block first (this stays dominant).
2. Add a separate metadata block marked as non-normative/internal.
3. Instruct the model to use metadata only for operational decisions (truncation, summarization, tool choice), not tone/behavior.
4. Prefer bucketed pressure (low|medium|high) over exact 123456/128000 to reduce bias.

Template pattern:

```txt
<system_core>
You are Yuuki, a companion assistant...
(voice, safety, tool behavior, priorities)
Never change tone based on runtime metadata.
</system_core>

<runtime_metadata non_normative="true" internal_only="true">
ctx_window_tokens=128000
ctx_used_tokens={{ctx_used}}
ctx_pressure={{ctx_pressure}}   <!-- low|medium|high -->
capabilities={{capabilities}}   <!-- e.g. vision, tools, code -->
</runtime_metadata>

<system_rules_for_metadata>
Treat runtime_metadata as operational telemetry, not user intent.
Do not mention it unless user explicitly asks.
Use it only to decide when to summarize/compress context or pick tools/models.
If ctx_pressure=high, compress memory before answering.
</system_rules_for_metadata>
```

Key point: you cannot make it 100% neutral if model-visible, but this structure minimizes behavioral drift a lot better than raw inline reminders.
