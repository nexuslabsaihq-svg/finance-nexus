## 2026-06-01 - [XSS Fix in IA Chat]
**Vulnerability:** XSS vulnerability found in `src/pages/IA.jsx` due to the use of `dangerouslySetInnerHTML` to render user and AI messages in the chat UI.
**Learning:** React components sometimes use `dangerouslySetInnerHTML` incorrectly to parse simple text formatting (like markdown-style bolding using asterisks), leading to significant XSS risks.
**Prevention:** Rather than using `dangerouslySetInnerHTML`, custom text parsing logic (e.g. splitting string by regex and mapping to React components) should be used.
