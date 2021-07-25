const DIRTY_PREFIX = 'dirtyindex:'; // tag names are always all lowercase
const DIRTY_REGEX = /dirtyindex:(\d+):/;
const DIRTY_REGEX_G = /dirtyindex:(\d+):/g;
const RADIX = 10;

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
    return args[parseInt(index, RADIX)];
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
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue?.includes(DIRTY_PREFIX)) {
      node.nodeValue = node.nodeValue.replace(DIRTY_REGEX_G, replaceSubstitution);
      continue;
    }

    node = <HTMLElement>node;

    let attributes: Attr[] = Array.from(node.attributes ?? []);

    for (let { name, value } of attributes) {
      if (name && value.includes(DIRTY_PREFIX)) {
        const match = DIRTY_REGEX.exec(value);
        if (!match) continue;
        value = args[parseInt(match[1], RADIX)];

        replaceAttribute(name, value, node);
      }
    }
  }

  return template.content;
};

export default html;
