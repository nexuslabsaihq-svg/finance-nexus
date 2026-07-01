## 2024-03-24 - Secure Text Rendering in React Without DOMPurify
**Vulnerability:** XSS vulnerability identified in `src/pages/IA.jsx` due to the use of `dangerouslySetInnerHTML` for parsing custom markdown-like syntax (`*bold*`).
**Learning:** Using `dangerouslySetInnerHTML` for simple text formatting introduces unnecessary XSS risks. React's array mapping capabilities provide a native, secure way to parse string patterns.
**Prevention:** Use regex `.split()` with capture groups and map over the array (using index modulo `i % 2 === 1`) to wrap matched segments in JSX tags, avoiding raw HTML injection entirely.
