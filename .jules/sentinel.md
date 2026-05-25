## 2024-05-25 - [XSS] dangerouslySetInnerHTML using unescaped string
**Vulnerability:** Found `dangerouslySetInnerHTML` in `src/pages/IA.jsx` formatting user messages: `dangerouslySetInnerHTML={{__html: msg.content.replace(/\*([^*]+)\*/g, '<b>$1</b>')}}`
**Learning:** Formatting logic is done insecurely, which allows arbitrary HTML rendering if the text comes from the user input.
**Prevention:** Rather than using `dangerouslySetInnerHTML`, text fragments should be generated safely using React string parsing and map components to avoid XSS vulnerabilities while allowing formatting.
