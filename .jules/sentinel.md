## 2026-05-15 - [XSS Fix in AI Chat]
**Vulnerability:** XSS vulnerability in IA page due to unescaped user input rendered in HTML via `dangerouslySetInnerHTML`.
**Learning:** The frontend app takes user-input values in the AI chat section and renders them natively to parse basic formatting logic like `*bold*`. However, since `dangerouslySetInnerHTML` blindly executes content, XSS scripts sent to the chat log could trigger when displayed.
**Prevention:** Apply a frontend HTML sanitizer like DOMPurify before feeding values to `dangerouslySetInnerHTML`.
