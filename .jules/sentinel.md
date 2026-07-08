## 2024-05-24 - [XSS via dangerouslySetInnerHTML in IA.jsx]
**Vulnerability:** Found a High severity Cross-Site Scripting (XSS) vulnerability in `src/pages/IA.jsx` where chat messages were rendered using `dangerouslySetInnerHTML` to support bold text formatting.
**Learning:** Using `dangerouslySetInnerHTML` with `replace()` for text formatting bypasses React's built-in XSS protections and allows malicious HTML/JS execution.
**Prevention:** Use React's JSX array mapping and regex `.split()` with capture groups to safely render formatting tags (like `<b>`) while treating the rest of the content as safe strings.
