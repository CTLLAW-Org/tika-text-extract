"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startServer = startServer;
var _child_process = require("child_process");
var _debug = _interopRequireDefault(require("debug"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// es

const debug = (0, _debug.default)('tika-text-extract');

/**
 * Starts a Tika Server on a default localhost:9998
 * @param artifactPath Full path to .jar file of Tika Server
 * @param options Customize text extraction
 * @return Resolves when server is started
 */
function startServer(artifactPath, options) {
  if (!artifactPath) {
    throw new Error('Please provide path to Tika Server Artifact');
  }
  const startCommand = checkTikaVersion(artifactPath, options);
  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(startCommand).stderr.on('data', data => {
      debug(data);

      /* eslint-disable camelcase */
      const isTika1_14Started = data.indexOf('INFO: Started') > -1;
      const isTika1_17Started = data.indexOf('Started Apache Tika server ') > -1;
      const isStarted = isTika1_14Started || isTika1_17Started;
      /* eslint-enable camelcase */
      const isError = data.match(/java.*Exception|error/i);
      if (isStarted) {
        resolve();
      }
      if (isError) {
        reject(new Error(data));
      }
    });
  });
}
function getExecutableJavaPath(options) {
  if (options && options.executableJavaPath) {
    return options.executableJavaPath;
  }
  return 'java';
}
function getOptionsBasedOnJavaVersion(options) {
  if (options && options.alignWithJava8) {
    return '';
  }
  return '--add-modules=java.xml.bind,java.activation';
}
function checkTikaVersion(artifactPath, options) {
  if (options?.useTikaV1) {
    return `${getExecutableJavaPath(options)} ${getOptionsBasedOnJavaVersion(options)} -Duser.home=/tmp -jar ${artifactPath}`;
  }
  return `${getExecutableJavaPath(options)} -jar ${artifactPath} -noFork`;
}