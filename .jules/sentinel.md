## 2024-06-09 - [HIGH] XSS Vulnerability in IA Chat
**Vulnerability:** User chat message content (`msg.content`) was directly rendered as HTML using `dangerouslySetInnerHTML`.
**Learning:** The previous implementation attempted to format text (bolding) by executing `.replace` with regex over the string to inject HTML tags, which required `dangerouslySetInnerHTML`.
**Prevention:** Avoid `dangerouslySetInnerHTML` for simple text formatting. Use React's array-mapping capabilities with `.split` using capture groups to safely parse strings and render specific matches into elements without injecting arbitrary markup.
