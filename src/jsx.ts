const SUBSTITUTION_INDEX = "substitutionindex:"; // tag names are always all lowercase
const SUBSTITUTION_REGEX = new RegExp(SUBSTITUTION_INDEX + "(d+):", "g");
const re = /substitutionindex:(\d+):/;

const html = (
  strings: TemplateStringsArray,
  ...values: any[]
): HTMLElement | DocumentFragment | ChildNode => {
  if (!strings[0] && values.length) {
    return document.createElement("div");
  }

  let str = strings[0];
  for (let i = 0; i < values.length; i++) {
    str += SUBSTITUTION_INDEX + i + ":" + strings[i + 1];
  }

  let template = document.createElement("template");
  template.innerHTML = str;

  console.log(template.outerHTML);
  let walker = document.createNodeIterator(
    template.content,
    NodeFilter.SHOW_ALL
  );
  let node;
  while ((node = walker.nextNode() as Element)) {
    let tag = null;
    let attributesToRemove = [];

    let nodeName = node.nodeName.toLowerCase();

    let attributes: Attr[] = [];
    if (node.attributes) {
      attributes = Array.from(node.attributes);
    }

    for (let i = 0; i < attributes.length; i++) {
      let attribute = attributes[i];
      let { name, value } = attribute;
      let hasSubstitution = false;

      if (name && value.includes(SUBSTITUTION_INDEX)) {
        // console.log(nodeName);
        // console.log(name);

        const match = re.exec(value);
        if (match) {
          console.log(match);
          value = values[parseInt(match[1], 10)];
          console.log(value);
        }

        console.log(typeof value, value);
        if (typeof value === "function" && match) {
          (node as HTMLElement).addEventListener(
            name.replace("on", "").toLowerCase(),
            value
          );
          (node as HTMLElement).removeAttribute(name);
        }
      }
    }
  }

  console.log(values);

  return template.content;
};

export default html;
