## 2024-06-17 - XSS Vulnerability in IA.jsx
**Vulnerability:** XSS vulnerability through `dangerouslySetInnerHTML` rendering user chat content.
**Learning:** Using `dangerouslySetInnerHTML` is unsafe for dynamic user-provided content. React-based array mapping is a safe alternative.
**Prevention:** Use array splitting and React elements mapping instead of innerHTML.
