## 2024-10-24 - Fix XSS Vulnerability in IA Chat
**Vulnerability:** XSS vulnerability in `src/pages/IA.jsx` due to the use of `dangerouslySetInnerHTML` for rendering chat messages.
**Learning:** `dangerouslySetInnerHTML` was used to render bold markdown, but it exposes the app to XSS if `msg.content` contains malicious HTML or scripts. It's safer to parse and render styled text using React string mapping instead.
**Prevention:** Avoid `dangerouslySetInnerHTML` for user or dynamically generated text. Prefer React-based string splitting and array mapping to safely render elements without relying on external sanitization dependencies.
