"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = extract;
var _intoStream = _interopRequireDefault(require("into-stream"));
var _isStream = _interopRequireDefault(require("is-stream"));
var _getStream = _interopRequireDefault(require("get-stream"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// import got from 'got';

const got = (...args) => Promise.resolve().then(() => _interopRequireWildcard(require('got'))).then(({
  default: got
}) => got(...args));

/*let got;

(async () => {
    got = await import('got').then(got => got.default)
})().catch(console.error);*/

const URL = 'http://localhost:9998/tika';

/**
 * Extract text from a document
 * @param input File to extract text from
 * @return Extracted text
 */
function extract(input = '') {
  const fileStream = (0, _isStream.default)(input) ? input : (0, _intoStream.default)(input);
  const tikaStream = got.stream.put(URL, {
    headers: {
      Accept: 'text/plain'
    }
  });
  return (0, _getStream.default)(fileStream.pipe(tikaStream));
}