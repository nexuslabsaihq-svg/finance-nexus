
## 2024-05-18 - [Fix XSS via dangerouslySetInnerHTML in IA.jsx]
**Vulnerability:** Found `dangerouslySetInnerHTML` being used to format chat messages in `src/pages/IA.jsx` based on user input, which opens up Cross-Site Scripting (XSS) vulnerabilities.
**Learning:** The application attempted to quickly format text by replacing `*text*` with `<b>text</b>` and rendering the resulting HTML. However, using `dangerouslySetInnerHTML` allows any arbitrary HTML from user input to be injected and executed.
**Prevention:** Rather than string replacement to HTML followed by `dangerouslySetInnerHTML`, use React's built-in abilities to split strings into arrays of components and strings and render them directly. This way, React automatically escapes string values, protecting against XSS.
