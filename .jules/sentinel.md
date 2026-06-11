## 2026-06-11 - [Replace dangerouslySetInnerHTML]
**Vulnerability:** Found an XSS vulnerability in src/pages/IA.jsx where dangerouslySetInnerHTML was used to render chat messages from the AI/User.
**Learning:** Using dangerouslySetInnerHTML without proper sanitization (like DOMPurify) on potentially user-controlled or AI-generated content can lead to XSS attacks. The prompt suggested using regex split and React array mapping instead.
**Prevention:** Avoid using dangerouslySetInnerHTML for dynamically generated text formatting. Prefer React-based string splitting and mapping to safely render elements.
