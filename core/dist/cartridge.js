"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValid = exports.Cartridge = void 0;

var _lodash = require("lodash");

var _nintendoLogo = _interopRequireDefault(require("./nintendoLogo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
//# sourceMappingURL=cartridge.js.map