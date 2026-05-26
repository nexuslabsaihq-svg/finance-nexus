## 2024-05-26 - [Remove dangerouslySetInnerHTML]
**Vulnerability:** XSS vulnerability by using `dangerouslySetInnerHTML` in React to render AI message content, which could allow arbitrary script execution if the content is manipulated.
**Learning:** React provides safe ways to render formatted text using array mapping and component splitting, rather than relying on raw HTML parsing which bypasses React's built-in XSS protections.
**Prevention:** Always use safe string splitting and mapping strategies to render simple formatting (like bolding with markdown `*`) instead of injecting raw HTML via `dangerouslySetInnerHTML`.
