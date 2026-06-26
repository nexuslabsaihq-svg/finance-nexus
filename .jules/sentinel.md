
## 2024-05-18 - Fix XSS in IA chat rendering
**Vulnerability:** XSS via `dangerouslySetInnerHTML` in `src/pages/IA.jsx` when rendering AI chat messages.
**Learning:** Using regex to wrap text with HTML tags and injecting it with `dangerouslySetInnerHTML` allows arbitrary code execution if the input is malicious.
**Prevention:** Use React's string splitting and array mapping to safely render dynamically formatted text without relying on `dangerouslySetInnerHTML`.
