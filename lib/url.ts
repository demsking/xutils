// const request = require('request');

export async function resolve(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    resolve(url)
    // request({ url, followRedirect: false }, (err, res) => {
    //   if (err) {
    //     reject(err);
    //   } else {
    //     resolve(res.headers.location || url);
    //   }
    // });
  });
}
