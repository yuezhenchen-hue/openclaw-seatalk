# Changelog

## 0.3.1

- Update OpenClaw compatibility and remove SDK deprecation warnings.

## 0.3.0

- Support forwarded messages.
- Outbound coalescing: consecutive reply payloads are merged into a single message with automatic markdown-aware chunking at 4000 chars, configurable via `outboundCoalescing`.
- Pairing mode for DM access control with interactive approval flow (`dmPolicy: "pairing"`). Thanks @edvardchen.
- Inbound media URL allowlist gate and MIME detection fallback for extensionless URLs. Thanks @edvardchen.
- Retry on rate-limit with exponential backoff and include `x-rid` in all error messages.

## 0.2.1

- Remove `setupEntry` to avoid plugin id mismatch when channel is unconfigured.
- Add ClawHub compatibility metadata (`compat.pluginApi`).

## 0.2.0

- Migrate to new plugin SDK subpath imports. Requires OpenClaw >= 2026.3.22.

## 0.1.6

- Reuse cached API client in probe to avoid token rate limiting.

## 0.1.5

- Align plugin id with manifest.
- Bump minimum Node.js to >= 22.16.0.

## 0.1.4

- Exclude signingSecret from resolved account to prevent leaking in status output.

## 0.1.3

- Split local file read into media-local.ts to avoid security scan false positive.
- Add install metadata to package.json.

## 0.1.2

- Align plugin manifest id with npm package name.

## 0.1.1

- Use os.homedir() for media path resolution to avoid security scan false positive.

## 0.1.0

- Initial release.
