## 2025-05-17 - [High] Replaced dangerouslySetInnerHTML with secure string rendering in IA chat
**Vulnerability:** XSS vulnerability identified in `src/pages/IA.jsx` where `dangerouslySetInnerHTML` was used to render markdown styling (bold `*text*`) in chat messages.
**Learning:** Rendering markdown features using regular expressions paired directly with raw HTML injection (`dangerouslySetInnerHTML`) creates a direct vector for script injection if user-provided messages contain HTML tags.
**Prevention:** Avoid `dangerouslySetInnerHTML`. Instead, parse the string natively into React elements. For simple replacements, split the string and return standard React nodes inside an array map, allowing React to handle string escaping automatically.
