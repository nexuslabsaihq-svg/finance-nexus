
## 2024-06-08 - [XSS Mitigation in React Rendering]
**Vulnerability:** `dangerouslySetInnerHTML` was used in `src/pages/IA.jsx` to render AI chat messages formatting bold strings, causing an XSS risk since malicious inputs weren't being sanitized properly.
**Learning:** React provides simple string splitting logic to mitigate simple formatting needs directly within elements using an array mapping conditional iteration without the need for an external sanitization payload dependency such as `DOMPurify`.
**Prevention:** Avoid `dangerouslySetInnerHTML` for dynamically formatted user/system output. Instead, utilize React's rendering map techniques that split strings via regex on matching elements.
