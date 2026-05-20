## 2024-05-18 - [Fix XSS Vulnerability in IA.jsx]
**Vulnerability:** A `dangerouslySetInnerHTML` prop was used in `src/pages/IA.jsx` to render chat messages containing markdown. The lack of sanitization made the app vulnerable to XSS.
**Learning:** Client-side rendering of untrusted AI/user content using `dangerouslySetInnerHTML` should be avoided when simple string splitting and map rendering natively escapes inputs and supports minimal markdown features without risk.
**Prevention:** Use React component mapping rather than HTML injection to format dynamically generated strings.
