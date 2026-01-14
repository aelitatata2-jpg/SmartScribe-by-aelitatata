
import { GOOGLE_CLIENT_ID, GOOGLE_API_SCOPES, GOOGLE_DISCOVERY_DOCS } from '../constants';

declare const gapi: any;
declare const google: any;

let tokenClient: any;

export async function initGoogleApi(): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('client', async () => {
        await gapi.client.init({
          clientId: GOOGLE_CLIENT_ID,
          scope: GOOGLE_API_SCOPES,
          discoveryDocs: GOOGLE_DISCOVERY_DOCS,
        });
        resolve();
      });
    };
    document.body.appendChild(script);

    const gsiScript = document.createElement('script');
    gsiScript.src = 'https://accounts.google.com/gsi/client';
    gsiScript.onload = () => {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_API_SCOPES,
        callback: '', // defined at call time
      });
    };
    document.body.appendChild(gsiScript);
  });
}

export async function saveToDrive(filename: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      tokenClient.callback = async (resp: any) => {
        if (resp.error !== undefined) {
          reject(resp);
          return;
        }

        const metadata = {
          name: filename,
          mimeType: 'application/vnd.google-apps.document', // This converts HTML/Text to Google Doc
        };

        const boundary = 'foo_bar_baz';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        // Use text/html to preserve formatting from our rich editor
        const contentType = 'text/html';
        const multipartRequestBody =
          delimiter +
          'Content-Type: application/json\r\n\r\n' +
          JSON.stringify(metadata) +
          delimiter +
          'Content-Type: ' + contentType + '\r\n\r\n' +
          content +
          close_delim;

        try {
          const response = await gapi.client.request({
            path: '/upload/drive/v3/files',
            method: 'POST',
            params: { uploadType: 'multipart' },
            headers: {
              'Content-Type': 'multipart/related; boundary="' + boundary + '"',
            },
            body: multipartRequestBody,
          });
          resolve(response);
        } catch (err) {
          reject(err);
        }
      };

      if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
      } else {
        tokenClient.requestAccessToken({ prompt: '' });
      }
    } catch (err) {
      reject(err);
    }
  });
}
