const DIRTY_PREFIX = 'dirtyindex:'; // tag names are always all lowercase
const DIRTY_REGEX = /dirtyindex:(\d+):/;
const DIRTY_REGEX_G = /dirtyindex:(\d+):/g;
const DIRTY_SEPERATOR_REGEX_G = /(dirtyindex:\d+:)/g;
const RADIX = 10;

/**
 * 빠르게 동작하는 DOM 객체인 DocumentFragment를 리턴합니다.
 * DocumentFragment는 appendChild 등의 함수를 통해서 다른곳으로 이동하면 자기자신을 잃습니다.
 * 속도를 포기하고 자기 참조를 유지하고 싶으면 함수를 일부 수정해서 template 대신 다른 태그를 사용해서 구현하세요.
 * https://coderwall.com/p/o9ws2g/why-you-should-always-append-dom-elements-using-documentfragments
 * @returns {DocumentFragment}
 */
const html = (
  strings: TemplateStringsArray,
  ...args: any[]
): DocumentFragment => {
  if (!strings[0] && args.length) {
    throw new Error('Failed To Parse');
  }

  let template = document.createElement('template');
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

  function domifyText(text: string, index: string) {
    const replacement = args[Number(index)];
    if (replacement instanceof DocumentFragment) {
      return replacement;
    } else if (typeof replacement === 'string') {
      const $text = document.createTextNode(text);
      return $text;
    }
  }

  function replaceAttribute(name: string, value: any, element: HTMLElement) {
    if (typeof value === 'function') {
      element.addEventListener(name.replace('on', '').toLowerCase(), value);
      element.removeAttribute(name);
    } else if (typeof value === 'string') {
      const attribute = element.getAttribute(name);
      const replaced_attr = attribute?.replace(
        DIRTY_REGEX_G,
        replaceSubstitution,
      );
      element.setAttribute(name, replaced_attr ?? '');
    }
  }

  let walker = document.createNodeIterator(
    template.content,
    NodeFilter.SHOW_ALL,
  );
  let node;
  while ((node = walker.nextNode())) {
    if (
      node.nodeType === Node.TEXT_NODE &&
      node.nodeValue?.includes(DIRTY_PREFIX)
    ) {
      const texts = node.nodeValue.split(DIRTY_SEPERATOR_REGEX_G);
      const doms: DocumentFragment[] = [];
      texts.forEach(text => {
        if (!text.includes(DIRTY_PREFIX)) {
          const template = document.createElement('template');
          template.content.textContent = `${text}`;
          doms.push(template.content);
        } else {
          const index = DIRTY_REGEX.exec(text)?.[1];
          if (index) {
            const $dom = args[Number(index)];
            if ($dom instanceof DocumentFragment) doms.push($dom);
            else {
              const template = document.createElement('template');
              template.content.textContent = `${$dom}`;
              doms.push(template.content);
            }
          }
        }
      });

      for (const dom of doms) {
        node.parentNode?.insertBefore(dom, node);
      }
      node.nodeValue = '';
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

  return template.content;
};

export default html;
