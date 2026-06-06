## 2025-03-09 - XSS Vulnerability via dangerouslySetInnerHTML
**Vulnerability:** Found `dangerouslySetInnerHTML` being used to parse chat text into bold HTML, which allows potential XSS if the user content contains malicious script tags.
**Learning:** It existed because `replace` was used to insert `<b>` tags via string interpolation instead of utilizing React's component mapping which handles text escaping natively.
**Prevention:** Always use array mapping with string splits (e.g., `msg.content?.split(...)`) to render formatted text in React components instead of relying on `dangerouslySetInnerHTML`.
