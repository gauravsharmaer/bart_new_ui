import DOMPurify from "dompurify";

const createMarkup = (text: string) => {
  // Add <br> tags between list items
  const textWithBreaks = text.replace(/<\/li><li>/g, "</li><br><li>");

  // First sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(textWithBreaks, {
    ALLOWED_TAGS: [
      "a",
      "ol",
      "ul",
      "li",
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "span",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "class"],
  });

  // Create a temporary div to manipulate the HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = sanitizedHtml;

  // Process text nodes and list items
  const processNodes = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const newContent = node.textContent
        ?.replace(/\n-/g, "<br>•")
        .replace(/(?<!\n)-/g, "")
        .replace(/\n/g, "<br>");
      if (newContent) {
        const span = document.createElement("span");
        span.innerHTML = newContent;
        node.parentNode?.replaceChild(span, node);
      }
    } else {
      node.childNodes.forEach(processNodes);
    }
  };

  processNodes(tempDiv);

  return {
    __html: tempDiv.innerHTML,
  };
};

export default createMarkup;
