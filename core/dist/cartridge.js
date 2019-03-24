"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CartridgeBuilder = exports.isValid = exports.Cartridge = void 0;

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
  }]);

  return Cartridge;
}();

exports.Cartridge = Cartridge;

var isValid = function isValid(cartridge) {
  return (0, _lodash.isEqual)((0, _lodash.range)(0x0104, 0x0133 + 1).map(function (address) {
    return cartridge.readByte(address);
  }), _nintendoLogo.default);
};

exports.isValid = isValid;

var CartridgeBuilder =
/*#__PURE__*/
function () {
  function CartridgeBuilder(program) {
    _classCallCheck(this, CartridgeBuilder);

    _defineProperty(this, "_program", void 0);

    this._program = program || new Uint8Array();
  }

  _createClass(CartridgeBuilder, [{
    key: "program",
    value: function program(_program) {
      return this.clone({
        program: new Uint8Array(_program)
      });
    }
  }, {
    key: "build",
    value: function build() {
      return new Cartridge(new Uint8Array([].concat(_toConsumableArray((0, _lodash.range)(0x0000, 0x0104).map(function () {
        return 0x00;
      })), _toConsumableArray(_nintendoLogo.default), _toConsumableArray(this._program))));
    }
  }, {
    key: "clone",
    value: function clone(_ref) {
      var program = _ref.program;
      return new CartridgeBuilder(program || this._program);
    }
  }], [{
    key: "builder",
    value: function builder() {
      return new CartridgeBuilder();
    }
  }]);

  return CartridgeBuilder;
}();

exports.CartridgeBuilder = CartridgeBuilder;
//# sourceMappingURL=cartridge.js.map