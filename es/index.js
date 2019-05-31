'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from 'prop-types';
import React from 'react';

var DOMParser = typeof window !== 'undefined' && window.DOMParser;
var process = process || {};
process.env = process.env || {};
var parserAvailable = typeof DOMParser !== 'undefined' && DOMParser.prototype != null && DOMParser.prototype.parseFromString != null;

function isParsable(src) {
    // kinda naive but meh, ain't gonna use full-blown parser for this
    return parserAvailable && typeof src === 'string' && src.trim().substr(0, 4) === '<svg';
}

// parse SVG string using `DOMParser`
function parseFromSVGString(src) {
    var parser = new DOMParser();
    return parser.parseFromString(src, "image/svg+xml");
}

// Transform DOM prop/attr names applicable to `<svg>` element but react-limited
function switchSVGAttrToReactProp(propName) {
    switch (propName) {
        case 'class':
            return 'className';
        default:
            return propName;
    }
}

var InlineSVG = (function (_React$Component) {
    _inherits(InlineSVG, _React$Component);

    _createClass(InlineSVG, null, [{
        key: 'defaultProps',
        value: {
            element: 'i',
            raw: false,
            src: ''
        },
        enumerable: true
    }, {
        key: 'propTypes',
        value: {
            src: PropTypes.string.isRequired,
            element: PropTypes.string,
            raw: PropTypes.bool
        },
        enumerable: true
    }]);

    function InlineSVG(props) {
        _classCallCheck(this, InlineSVG);

        _get(Object.getPrototypeOf(InlineSVG.prototype), 'constructor', this).call(this, props);
        this._extractSVGProps = this._extractSVGProps.bind(this);
    }

    // Serialize `Attr` objects in `NamedNodeMap`

    _createClass(InlineSVG, [{
        key: '_serializeAttrs',
        value: function _serializeAttrs(map) {
            var ret = {};
            var prop = undefined;
            for (var i = 0; i < map.length; i++) {
                prop = switchSVGAttrToReactProp(map[i].name);
                ret[prop] = map[i].value;
            }
            return ret;
        }

        // get <svg /> element props
    }, {
        key: '_extractSVGProps',
        value: function _extractSVGProps(src) {
            var map = parseFromSVGString(src).documentElement.attributes;
            return map.length > 0 ? this._serializeAttrs(map) : null;
        }

        // get content inside <svg> element.
    }, {
        key: '_stripSVG',
        value: function _stripSVG(src) {
            return parseFromSVGString(src).documentElement.innerHTML;
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(_ref) {
            var children = _ref.children;

            if ("production" !== process.env.NODE_ENV && children != null) {
                console.info('<InlineSVG />: `children` prop will be ignored.');
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var Element = undefined,
                __html = undefined,
                svgProps = undefined;
            var _props = this.props;
            var element = _props.element;
            var raw = _props.raw;
            var src = _props.src;

            var otherProps = _objectWithoutProperties(_props, ['element', 'raw', 'src']);

            if (raw === true && isParsable(src)) {
                Element = 'svg';
                svgProps = this._extractSVGProps(src);
                __html = this._stripSVG(src);
            }
            __html = __html || src;
            Element = Element || element;
            svgProps = svgProps || {};

            return React.createElement(Element, _extends({}, svgProps, otherProps, { src: null, children: null,
                dangerouslySetInnerHTML: { __html: __html } }));
        }
    }]);

    return InlineSVG;
})(React.Component);

export default InlineSVG;