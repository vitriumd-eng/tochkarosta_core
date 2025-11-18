# ПРИМЕР: master_prompt.md update - Gateway Enforcement addition (snippet)
- Gateways must validate endpoint existence in core openapi before forwarding.
- Gateways must normalize payload: external_id as string, signature present.
- Cursor must enforce no creation of new endpoints; use OpenAPI contract only.

