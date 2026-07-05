## 2024-05-24 - XSS via dangerouslySetInnerHTML
**Vulnerability:** Cross-Site Scripting (XSS) vulnerability due to using dangerouslySetInnerHTML to render user and AI-generated chat messages.
**Learning:** Using dangerouslySetInnerHTML directly on user input or AI output, even after simple string replacement, exposes the application to XSS attacks as malicious script tags can be injected and executed.
**Prevention:** Use React's built-in safe text rendering by splitting strings into arrays with regex and mapping matched segments to JSX elements instead of raw HTML.
