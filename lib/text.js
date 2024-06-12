"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = extract;
var _got = _interopRequireDefault(require("got"));
var _intoStream = _interopRequireDefault(require("into-stream"));
var _isStream = _interopRequireDefault(require("is-stream"));
var _getStream = _interopRequireDefault(require("get-stream"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const URL = 'http://localhost:9998/tika';

/**
 * Extract text from a document
 * @param input File to extract text from
 * @return Extracted text
 */
function extract(input = '') {
  const fileStream = (0, _isStream.default)(input) ? input : (0, _intoStream.default)(input);
  const tikaStream = _got.default.stream.put(URL, {
    headers: {
      Accept: 'text/plain'
    }
  });
  return (0, _getStream.default)(fileStream.pipe(tikaStream));
}