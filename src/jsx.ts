const SUBSTITUTION_INDEX = 'substitutionindex:'; // tag names are always all lowercase
const SUBSTITUTION_REGEX = /substitutionindex:(\d+):/;

const html = (strings: TemplateStringsArray, ...values: any[]): HTMLElement | DocumentFragment | ChildNode => {
  if (!strings[0] && values.length) {
    return document.createElement('div');
  }

  let str = strings[0];
  for (let i = 0; i < values.length; i++) {
    str += SUBSTITUTION_INDEX + i + ':' + strings[i + 1];
  }

  let template = document.createElement('template');
  template.innerHTML = str;

  // console.log(template.outerHTML);
  /**
   * Replace a string with substitution placeholders with its substitution values.
   * @private
   *
   * @param {string} match - Matched substitution placeholder.
   * @param {string} index - Substitution placeholder index.
   */
  function replaceSubstitution(match: string, index: string) {
    return values[parseInt(index, 10)];
  }

  let walker = document.createNodeIterator(template.content, NodeFilter.SHOW_ALL);
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === 3 && node.nodeValue?.includes(SUBSTITUTION_INDEX)) {
      node.nodeValue = node.nodeValue.replace(SUBSTITUTION_REGEX, replaceSubstitution);
      continue;
    }

    const element = <HTMLElement>node;

    let attributes: Attr[] = [];
    if (element.attributes) {
      attributes = Array.from(element.attributes);
    }

    for (let i = 0; i < attributes.length; i++) {
      let attribute = attributes[i];
      let { name, value } = attribute;

      if (name && value.includes(SUBSTITUTION_INDEX)) {
        const match = SUBSTITUTION_REGEX.exec(value);
        if (match) {
          value = values[parseInt(match[1], 10)];
          if (typeof value === 'function') {
            element.addEventListener(name.replace('on', '').toLowerCase(), value);
            element.removeAttribute(name);
          } else if (typeof value === 'string') {
            element.setAttribute(name, value);
          }
        }
      }
    }
  }

  return template.content;
};

export default html;
