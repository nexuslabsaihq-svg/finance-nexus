## 2025-02-23 - [XSS] dangerouslySetInnerHTML vulnerability
**Vulnerability:** The component rendering messages allowed the use of `dangerouslySetInnerHTML`, which could lead to XSS attacks if the content contains malicious scripts.
**Learning:** Found an instance in `src/pages/IA.jsx` where formatting logic combined with `dangerouslySetInnerHTML` directly injected string messages.
**Prevention:** Avoid `dangerouslySetInnerHTML` when formatting strings in React, especially if the string comes from an untrusted source or could be manipulated. Instead, use React's built-in array mapping (e.g. mapping string splits) for safety.
