"use strict";
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
        var argsString = args.length > index ? "" + DIRTY_PREFIX + index + ":" : '';
        return "" + str + argsString;
    })
        .join('');
    function replaceSubstitution(match, index) {
        var replacement = args[Number(index)];
        if (typeof replacement === 'string') {
            return replacement;
        }
        else if (typeof replacement === 'number') {
            return "" + replacement;
        }
        return '';
    }
    function replaceAttribute(name, value, element) {
        if (typeof value === 'function') {
            element.addEventListener(name.replace('on', '').toLowerCase(), value);
            element.removeAttribute(name);
        }
        else if (typeof value === 'string') {
            var attribute = element.getAttribute(name);
            var replaced_attr = attribute === null || attribute === void 0 ? void 0 : attribute.replace(DIRTY_REGEX_G, replaceSubstitution);
            element.setAttribute(name, replaced_attr !== null && replaced_attr !== void 0 ? replaced_attr : '');
        }
    }
    function buildDocumentFragmentWith(str) {
        var df = document.createDocumentFragment();
        df.appendChild(document.createTextNode(str));
        return df;
    }
    function handleTextNode(node) {
        var _a, _b;
        if (node.nodeType !== Node.TEXT_NODE)
            return;
        if (!((_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.includes(DIRTY_PREFIX)))
            return;
        var texts = node.nodeValue.split(DIRTY_SEPERATOR_REGEX_G);
        var doms = texts.map(function (text) {
            var _a;
            var dirtyIndex = (_a = DIRTY_REGEX.exec(text)) === null || _a === void 0 ? void 0 : _a[1];
            if (!dirtyIndex)
                return buildDocumentFragmentWith(text);
            var arg = args[Number(dirtyIndex)];
            if (arg instanceof Node)
                return arg;
            return buildDocumentFragmentWith(arg);
        });
        for (var _i = 0, doms_1 = doms; _i < doms_1.length; _i++) {
            var dom = doms_1[_i];
            (_b = node.parentNode) === null || _b === void 0 ? void 0 : _b.insertBefore(dom, node);
        }
        node.nodeValue = '';
    }
    var walker = document.createNodeIterator(template.content, NodeFilter.SHOW_ALL);
    var node;
    while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE &&
            ((_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.includes(DIRTY_PREFIX))) {
            handleTextNode(node);
            continue;
        }
        node = node;
        var attributes = Array.from((_b = node.attributes) !== null && _b !== void 0 ? _b : []);
        for (var _c = 0, attributes_1 = attributes; _c < attributes_1.length; _c++) {
            var _d = attributes_1[_c], name_1 = _d.name, value = _d.value;
            if (name_1 && value.includes(DIRTY_PREFIX)) {
                var match = DIRTY_REGEX.exec(value);
                if (!match)
                    continue;
                value = args[Number(match[1])];
                replaceAttribute(name_1, value, node);
            }
        }
    }
    return template.content;
};
exports["default"] = html;
