## 2024-05-18 - Avoid dangerouslySetInnerHTML
**Vulnerability:** XSS via `dangerouslySetInnerHTML`
**Learning:** Found dynamically formatted text using `dangerouslySetInnerHTML` in `src/pages/IA.jsx` for rendering markdown. This can allow XSS if user input (or external data that is rendered) is malicious, even in a chat interface where responses might reflect user inputs.
**Prevention:** Avoid `dangerouslySetInnerHTML`. Prefer React-based string splitting and mapping to render elements safely without requiring external sanitization dependencies.
