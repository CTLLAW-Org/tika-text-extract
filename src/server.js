
import { exec } from 'child_process';
import debugUtil from 'debug';

const debug = debugUtil('tika-text-extract');

/**
 * Starts a Tika Server on a default localhost:9998
 * @param artifactPath Full path to .jar file of Tika Server
 * @param options Customize text extraction
 * @return Resolves when server is started
 */
export default function startServer(artifactPath, options) {
  if (!artifactPath) {
    throw new Error('Please provide path to Tika Server Artifact');
  }

  const startCommand = checkTikaVersion(artifactPath, options);

  return new Promise((resolve, reject) => {
    exec(startCommand).stderr.on('data', data => {
      debug(data);

      const isTika1_14Started = data.indexOf('INFO: Started') > -1;
      const isTika1_17Started = data.indexOf('Started Apache Tika server ') > -1;

      const isStarted = isTika1_14Started || isTika1_17Started;
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
    return `${getExecutableJavaPath(options)} ${getOptionsBasedOnJavaVersion(
      options
    )} -Duser.home=/tmp -jar ${artifactPath}`;
  }

  return `${getExecutableJavaPath(options)} -jar ${artifactPath} -noFork`;
}
