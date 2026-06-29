## 2024-05-15 - [XSS vulnerability via dangerouslySetInnerHTML]
**Vulnerability:** The application is using dangerouslySetInnerHTML to render user input formatted with bold text using regex replace in `src/pages/IA.jsx` without sanitizing the input beforehand.
**Learning:** `dangerouslySetInnerHTML` should never be used on unsanitized user or API input, even if it's meant to format markdown-like syntax. XSS vectors could be embedded inside the chat messages.
**Prevention:** Avoid `dangerouslySetInnerHTML` for basic formatting. Instead, split the text string and map the segments into safe React elements using an index check or use a dedicated markdown parser or sanitizer library.
