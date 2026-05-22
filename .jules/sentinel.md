## 2025-02-24 - [Replaced dangerouslySetInnerHTML with React-based parsing]
**Vulnerability:** XSS vulnerability in `src/pages/IA.jsx` due to usage of `dangerouslySetInnerHTML` for parsing text.
**Learning:** React provides safe text rendering out of the box. Manually replacing formatting markup with HTML strings via `dangerouslySetInnerHTML` bypasses React's escaping mechanism.
**Prevention:** Avoid `dangerouslySetInnerHTML` for dynamically formatted user or agent-generated text. Use array mapping to safely render formatted parts as React elements.
