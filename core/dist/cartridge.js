"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValid = exports.Cartridge = void 0;

var _lodash = require("lodash");

var _nintendoLogo = _interopRequireDefault(require("./nintendoLogo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// TODO: ROM banks, etc
var Cartridge =
/*#__PURE__*/
function () {
  function Cartridge(bytes) {
    _classCallCheck(this, Cartridge);

    _defineProperty(this, "bytes", void 0);

    this.bytes = bytes;
  }

  _createClass(Cartridge, [{
    key: "readByte",
    value: function readByte(address) {
      return this.bytes[address];
    }
  }], [{
    key: "newWithNintendoLogo",
    value: function newWithNintendoLogo(bytes) {
      return new Cartridge(new Uint8Array([0x00, // 0x0100
      0x00, // 0x0101
      0x00, // 0x0102
      0x00].concat(_toConsumableArray(_nintendoLogo.default), _toConsumableArray(bytes))));
    }
  }]);

  return Cartridge;
}();

exports.Cartridge = Cartridge;

_defineProperty(Cartridge, "PC_START", 4 + _nintendoLogo.default.length);

var isValid = function isValid(cartridge) {
  return (0, _lodash.isEqual)((0, _lodash.range)(0x0004, 0x0033 + 1).map(function (address) {
    return cartridge.readByte(address);
  }), _nintendoLogo.default);
};

exports.isValid = isValid;
//# sourceMappingURL=cartridge.js.map