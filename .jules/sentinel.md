## 2024-05-15 - [XSS via dangerouslySetInnerHTML in Chat]
**Vulnerability:** Used dangerouslySetInnerHTML with unsanitized user/AI input in the Nexus AI chat component.
**Learning:** React provides safe alternatives to dangerouslySetInnerHTML for simple text formatting, avoiding the need for external sanitization libraries like DOMPurify. Specifically, string splitting and returning unformatted parts as strings directly in array mapping is a robust pattern here.
**Prevention:** Always use React-based string splitting and mapping to render formatted elements safely, rather than relying on regex replacements and dangerouslySetInnerHTML.
