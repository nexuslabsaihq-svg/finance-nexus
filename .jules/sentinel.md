## 2024-05-18 - XSS Vulnerability in Chat Output
**Vulnerability:** The application used `dangerouslySetInnerHTML` to render dynamically formatted text (bolding text wrapped in asterisks) from AI/user messages in `src/pages/IA.jsx`, creating a Cross-Site Scripting (XSS) vulnerability.
**Learning:** Using regex to replace text with HTML tags and injecting it directly via `dangerouslySetInnerHTML` bypasses React's built-in XSS protection.
**Prevention:** Use React-based string splitting (`.split()`) and array mapping to safely render dynamically formatted text without relying on `dangerouslySetInnerHTML`.
