
## 2024-05-18 - [XSS Prevention in React Message Rendering]
**Vulnerability:** The Nexus AI chat component in `src/pages/IA.jsx` was using `dangerouslySetInnerHTML` to render basic formatting (like bold text) from messages. This created a potential XSS vector if any malicious HTML strings were injected in messages.
**Learning:** Even simple text formatting replacements combined with `dangerouslySetInnerHTML` is a critical security vulnerability, as attackers can bypass the formatting logic and inject arbitrary tags (e.g., `<img src=x onerror=alert(1)>`).
**Prevention:** Instead of manipulating HTML strings and rendering them directly, we should safely split the text using regex and map the resulting array into React elements (like `<b>`), allowing React to handle the safe rendering of plain text parts without executing potential scripts.
