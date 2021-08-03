const DIRTY_PREFIX = 'dirtyindex:'; // tag names are always all lowercase
const DIRTY_REGEX = /dirtyindex:(\d+):/;
const DIRTY_REGEX_G = /dirtyindex:(\d+):/g;
const DIRTY_SEPERATOR_REGEX_G = /(dirtyindex:\d+:)/g;

/**
 * DOM HTMLElement 를 리턴합니다.
 * HTMLElement Node를 상속받은 클래스입니다.
 *
 * @returns {HTMLElement}
 */
const html = (strings: TemplateStringsArray, ...args: any[]): HTMLElement => {
  if (!strings[0] && args.length) {
    throw new Error('Failed To Parse');
  }

  let template = document.createElement('frame');
  template.innerHTML = strings
    .map((str, index) => {
      const argsString = args.length > index ? `${DIRTY_PREFIX}${index}:` : '';
      return `${str}${argsString}`;
    })
    .join('');

  function replaceSubstitution(match: string, index: string) {
    const replacement = args[Number(index)];
    if (typeof replacement === 'string') {
      return replacement;
    } else if (typeof replacement === 'number') {
      return `${replacement}`;
    }
    return '';
  }

  function replaceAttribute(name: string, value: any, element: HTMLElement) {
    if (typeof value === 'function') {
      element.addEventListener(name.replace('on', '').toLowerCase(), value);
      element.removeAttribute(name);
    } else if (['string', 'number'].includes(typeof value)) {
      const attribute = element.getAttribute(name);
      const replaced_attr = attribute?.replace(
        DIRTY_REGEX_G,
        replaceSubstitution,
      );
      element.setAttribute(name, replaced_attr ?? '');
    } else if (typeof value === 'boolean') {
      if (value === true) {
        element.setAttribute(name, '');
      } else {
        element.removeAttribute(name);
      }
    }
  }

  function buildDocumentFragmentWith(str?: string) {
    const df = document.createDocumentFragment();
    if (!str) return df;
    df.appendChild(document.createTextNode(str));
    return df;
  }

  function handleTextNode(node: Node) {
    if (node.nodeType !== Node.TEXT_NODE) return;
    if (!node.nodeValue?.includes(DIRTY_PREFIX)) return;

    const texts = node.nodeValue.split(DIRTY_SEPERATOR_REGEX_G);
    const doms = texts.map(text => {
      const dirtyIndex = DIRTY_REGEX.exec(text)?.[1];
      if (!dirtyIndex) return buildDocumentFragmentWith(text);

      const arg = args[Number(dirtyIndex)];
      if (arg instanceof Node) return arg;
      if (arg instanceof Array) {
        const df = document.createDocumentFragment();
        arg.forEach($el => df.appendChild($el));
        return df;
      }
      return buildDocumentFragmentWith(arg);
    });

    for (const dom of doms) {
      node.parentNode?.insertBefore(dom, node);
    }
    node.nodeValue = '';
  }

  let walker = document.createNodeIterator(template, NodeFilter.SHOW_ALL);
  let node;
  while ((node = walker.nextNode())) {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue?.includes(DIRTY_PREFIX)
    ) {
      handleTextNode(node);
      continue;
    }

    node = <HTMLElement>node;

    let attributes: Attr[] = Array.from(node.attributes ?? []);

    for (let { name, value } of attributes) {
      if (name && value.includes(DIRTY_PREFIX)) {
        const match = DIRTY_REGEX.exec(value);
        if (!match) continue;
        value = args[Number(match[1])];

        replaceAttribute(name, value, node);
      }
    }
  }

  return <HTMLElement>template.firstElementChild ?? template;
};

export default html;
