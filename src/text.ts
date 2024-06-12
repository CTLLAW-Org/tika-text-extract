// import got from 'got';

/*const got = (...args) => import('got').then(({default: got}) => got(...args));*/

/*let got;

(async () => {
    got = await import('got').then(got => got.default)
})().catch(console.error);*/

// import axios from "axios";
import got from 'got';
import intoStream from 'into-stream';
import isStream from 'is-stream';
import getStream from 'get-stream';

const URL = 'http://localhost:9998/tika';

/**
 * Extract text from a document
 * @param input File to extract text from
 * @return Extracted text
 */
export function extract(input: Buffer | string | Promise<string> = ''): Promise<string> {
  const fileStream = isStream(input) ? input : intoStream(input);
  const tikaStream = got.stream.put(URL, {
    headers: {Accept: 'text/plain'},
  });

    /*const response = await axios.put(URL, {
        headers: {Accept: 'text/plain'},
        responseType: 'stream'
    });

    const tikaStream = response.data;*/

  return getStream(fileStream.pipe(tikaStream));
}
