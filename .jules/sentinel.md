## 2024-05-18 - [XSS via dangerouslySetInnerHTML]
**Vulnerability:** The application was using `dangerouslySetInnerHTML` to render user-facing formatted text generated dynamically, exposing the application to Cross-Site Scripting (XSS) if the text content wasn't properly sanitized.
**Learning:** Using React's native string splitting and array mapping to render formatted elements (like `<b>`) is a safer alternative that avoids the need to inject HTML strings directly into the DOM or requiring external sanitization libraries for simple formatting.
**Prevention:** Avoid `dangerouslySetInnerHTML` for dynamic formatting unless strictly necessary and combined with a robust sanitization library like DOMPurify. Default to React-based mapping for basic string transformations.
