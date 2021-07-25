'use strict';
exports.__esModule = true;
var DIRTY_PREFIX = 'dirtyindex:'; // tag names are always all lowercase
var DIRTY_REGEX = /dirtyindex:(\d+):/;
var DIRTY_REGEX_G = /dirtyindex:(\d+):/g;
var RADIX = 10;
var html = function (strings) {
  var _a, _b;
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
      var argsString = args[index] ? DIRTY_PREFIX + index + ':' : '';
      return '' + str + argsString;
    })
    .join('');
  function replaceSubstitution(match, index) {
    return args[parseInt(index, RADIX)];
  }
  function replaceAttribute(name, value, element) {
    if (typeof value === 'function') {
      element.addEventListener(name.replace('on', '').toLowerCase(), value);
      element.removeAttribute(name);
    } else if (typeof value === 'string') {
      element.setAttribute(name, value);
    }
  }
  var walker = document.createNodeIterator(template.content, NodeFilter.SHOW_ALL);
  var node;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE && ((_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.includes(DIRTY_PREFIX))) {
      node.nodeValue = node.nodeValue.replace(DIRTY_REGEX_G, replaceSubstitution);
      continue;
    }
    node = node;
    var attributes = Array.from((_b = node.attributes) !== null && _b !== void 0 ? _b : []);
    for (var _c = 0, attributes_1 = attributes; _c < attributes_1.length; _c++) {
      var _d = attributes_1[_c],
        name_1 = _d.name,
        value = _d.value;
      if (name_1 && value.includes(DIRTY_PREFIX)) {
        var match = DIRTY_REGEX.exec(value);
        if (!match) continue;
        value = args[parseInt(match[1], RADIX)];
        replaceAttribute(name_1, value, node);
      }
    }
  }
  return template.content;
};
exports['default'] = html;
