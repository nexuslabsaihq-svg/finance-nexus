## 2024-05-18 - [Fix XSS via dangerouslySetInnerHTML in AI Chat]
**Vulnerability:** XSS vulnerability via the `dangerouslySetInnerHTML` React prop found in `src/pages/IA.jsx` for displaying AI chat messages.
**Learning:** `dangerouslySetInnerHTML` poses a high XSS risk because external or user inputs might contain malicious HTML when not correctly escaped or properly sanitized.
**Prevention:** Avoid `dangerouslySetInnerHTML`. Use React element parsing/mapping approaches to safely render specific formatting syntax (e.g. `*bold*` -> `<b>bold</b>`) dynamically or use a mature HTML sanitizer.
