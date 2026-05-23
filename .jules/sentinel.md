## 2024-05-23 - [Critical] XSS vulnerability via dangerouslySetInnerHTML
**Vulnerability:** A cross-site scripting (XSS) vulnerability was found in `src/pages/IA.jsx` due to the use of `dangerouslySetInnerHTML` for parsing asterisks as bold text in chat messages.
**Learning:** `dangerouslySetInnerHTML` allows any arbitrary HTML inside the message content to be rendered and executed by the browser, not just `<b>` tags.
**Prevention:** Avoid `dangerouslySetInnerHTML`. Instead, use string splitting and a safe mapping to return React nodes (like `<b>`), treating user content as strings rather than raw HTML.
