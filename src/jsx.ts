const DIRTY_PREFIX = 'dirtyindex:'; // tag names are always all lowercase
const DIRTY_REGEX = /dirtyindex:(\d+):/;

const html = (strings: TemplateStringsArray, ...args: any[]): HTMLElement | DocumentFragment | ChildNode => {
  if (!strings[0] && args.length) {
    throw new Error('Failed To Parse');
  }

  let template = document.createElement('template');
  template.innerHTML = strings
    .map((str, index) => {
      const argsString = args[index] ? DIRTY_PREFIX + index + ':' : '';
      return `${str}${argsString}`;
    })
    .join('');

  function replaceSubstitution(match: string, index: string) {
    return args[parseInt(index, 10)];
  }

  function replaceAttribute(name: string, value: any, element: HTMLElement) {
    if (typeof value === 'function') {
      element.addEventListener(name.replace('on', '').toLowerCase(), value);
      element.removeAttribute(name);
    } else if (typeof value === 'string') {
      element.setAttribute(name, value);
    }
  }

  let walker = document.createNodeIterator(template.content, NodeFilter.SHOW_ALL);
  let node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === 3 && node.nodeValue?.includes(DIRTY_PREFIX)) {
      node.nodeValue = node.nodeValue.replace(DIRTY_REGEX, replaceSubstitution);
      continue;
    }

    node = <HTMLElement>node;

    let attributes: Attr[] = Array.from(node.attributes ?? []);

    for (let { name, value } of attributes) {
      if (name && value.includes(DIRTY_PREFIX)) {
        const match = DIRTY_REGEX.exec(value);
        if (!match) continue;
        value = args[parseInt(match[1], 10)];

        replaceAttribute(name, value, node);
      }
    }
  }

  return template.content;
};

export default html;
