
## 2024-05-29 - [Fix XSS via dangerouslySetInnerHTML in IA chat]
**Vulnerability:** XSS vulnerability identified in `src/pages/IA.jsx` due to the use of `dangerouslySetInnerHTML` for rendering AI chat messages. While it replaces basic Markdown formatting, the raw content might have contained malicious HTML/scripts.
**Learning:** Using `dangerouslySetInnerHTML` for dynamically generated content should be avoided. React's default string splitting and element mapping is a much safer alternative that preserves HTML escaping capabilities naturally.
**Prevention:** Always parse and reconstruct styled content via React array mapping instead of directly dumping raw HTML using `dangerouslySetInnerHTML`.
