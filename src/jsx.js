'use strict';
exports.__esModule = true;
var DIRTY_PREFIX = 'dirtyindex:'; // tag names are always all lowercase
var DIRTY_REGEX = /dirtyindex:(\d+):/;
var DIRTY_REGEX_G = /dirtyindex:(\d+):/g;
var DIRTY_SEPERATOR_REGEX_G = /(dirtyindex:\d+:)/g;
var RADIX = 10;
/**
 * 빠르게 동작하는 DOM 객체인 DocumentFragment를 리턴합니다.
 * DocumentFragment는 appendChild 등의 함수를 통해서 다른곳으로 이동하면 자기자신을 잃습니다.
 * 속도를 포기하고 자기 참조를 유지하고 싶으면 함수를 일부 수정해서 template 대신 다른 태그를 사용해서 구현하세요.
 * https://coderwall.com/p/o9ws2g/why-you-should-always-append-dom-elements-using-documentfragments
 * @returns {DocumentFragment}
 */
var html = function (strings) {
  var _a, _b, _c;
  var args = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i];
  }
  if (!strings[0] && args.length) {
    throw new Error('Failed To Parse');
  }
  var template = document.createElement('template');
  template.innerHTML = strings
    .map(function (str, index) {
      var argsString =
        args.length > index ? '' + DIRTY_PREFIX + index + ':' : '';
      return '' + str + argsString;
    })
    .join('');
  function replaceSubstitution(match, index) {
    var replacement = args[Number(index)];
    if (typeof replacement === 'string') {
      return replacement;
    } else if (typeof replacement === 'number') {
      return '' + replacement;
    }
    return '';
  }
  function domifyText(text, index) {
    var replacement = args[Number(index)];
    if (replacement instanceof DocumentFragment) {
      return replacement;
    } else if (typeof replacement === 'string') {
      var $text = document.createTextNode(text);
      return $text;
    }
  }
  function replaceAttribute(name, value, element) {
    if (typeof value === 'function') {
      element.addEventListener(name.replace('on', '').toLowerCase(), value);
      element.removeAttribute(name);
    } else if (typeof value === 'string') {
      var attribute = element.getAttribute(name);
      var replaced_attr =
        attribute === null || attribute === void 0
          ? void 0
          : attribute.replace(DIRTY_REGEX_G, replaceSubstitution);
      element.setAttribute(
        name,
        replaced_attr !== null && replaced_attr !== void 0 ? replaced_attr : '',
      );
    }
  }
  var walker = document.createNodeIterator(
    template.content,
    NodeFilter.SHOW_ALL,
  );
  var node;
  var _loop_1 = function () {
    if (
      node.nodeType === Node.TEXT_NODE &&
      ((_a = node.nodeValue) === null || _a === void 0
        ? void 0
        : _a.includes(DIRTY_PREFIX))
    ) {
      var texts = node.nodeValue.split(DIRTY_SEPERATOR_REGEX_G);
      var doms_2 = [];
      texts.forEach(function (text) {
        var _a;
        if (!text.includes(DIRTY_PREFIX)) {
          var template_1 = document.createElement('template');
          template_1.content.textContent = '' + text;
          doms_2.push(template_1.content);
        } else {
          var index =
            (_a = DIRTY_REGEX.exec(text)) === null || _a === void 0
              ? void 0
              : _a[1];
          if (index) {
            var $dom = args[Number(index)];
            if ($dom instanceof DocumentFragment) doms_2.push($dom);
            else {
              var template_2 = document.createElement('template');
              template_2.content.textContent = '' + $dom;
              doms_2.push(template_2.content);
            }
          }
        }
      });
      for (var _d = 0, doms_1 = doms_2; _d < doms_1.length; _d++) {
        var dom = doms_1[_d];
        (_b = node.parentNode) === null || _b === void 0
          ? void 0
          : _b.insertBefore(dom, node);
      }
      node.nodeValue = '';
      return 'continue';
    }
    node = node;
    var attributes = Array.from(
      (_c = node.attributes) !== null && _c !== void 0 ? _c : [],
    );
    for (
      var _e = 0, attributes_1 = attributes;
      _e < attributes_1.length;
      _e++
    ) {
      var _f = attributes_1[_e],
        name_1 = _f.name,
        value = _f.value;
      if (name_1 && value.includes(DIRTY_PREFIX)) {
        var match = DIRTY_REGEX.exec(value);
        if (!match) continue;
        value = args[Number(match[1])];
        replaceAttribute(name_1, value, node);
      }
    }
  };
  while ((node = walker.nextNode())) {
    _loop_1();
  }
  return template.content;
};
exports['default'] = html;
