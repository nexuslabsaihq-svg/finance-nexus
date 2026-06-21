## 2023-10-24 - [CRITICAL] Prevent XSS in Nexus AI Chat
**Vulnerability:** The `src/pages/IA.jsx` component rendered user and AI chat content directly using `dangerouslySetInnerHTML`. An attacker could inject malicious scripts or manipulate the chat output due to lack of sanitization.
**Learning:** `dangerouslySetInnerHTML` should never be used on unsanitized user/AI input, especially without a library like DOMPurify. It enables direct execution of injected HTML/JavaScript inside the browser.
**Prevention:** Avoid `dangerouslySetInnerHTML`. To apply formatting like bold text from Markdown (e.g., `*text*`), use React-based string splitting and array mapping to safely render elements without interpreting HTML strings.
