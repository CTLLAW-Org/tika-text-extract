"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = extract;
var _axios = _interopRequireDefault(require("axios"));
var _intoStream = _interopRequireDefault(require("into-stream"));
var _isStream = _interopRequireDefault(require("is-stream"));
var _getStream = _interopRequireDefault(require("get-stream"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// import got from 'got';

/*const got = (...args) => import('got').then(({default: got}) => got(...args));*/

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
async function extract(input = '') {
  const fileStream = (0, _isStream.default)(input) ? input : (0, _intoStream.default)(input);
  /*const tikaStream = got.stream.put(URL, {
    headers: {Accept: 'text/plain'},
  });*/

  const response = await _axios.default.put(URL, {
    headers: {
      Accept: 'text/plain'
    },
    responseType: 'stream'
  });
  const tikaStream = response.data;
  return (0, _getStream.default)(fileStream.pipe(tikaStream));
}