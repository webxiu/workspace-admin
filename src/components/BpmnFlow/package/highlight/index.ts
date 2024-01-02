import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";

hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);

export default hljs;
