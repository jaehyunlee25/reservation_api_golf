const http = require('http');
const axios = require('axios');

function ah(addr) {
  // ah = add header
  const header = 'http://golf.mnemosyne.co.kr';
  // const header = 'http://localhost:3001';
  return [header, addr].join('');
}
function httpGetRequest(addr) {
  const opts = {
    method: 'GET',
    path: ah(addr),
  };
  const promise = new Promise((resolve, reject) => {
    const resData = [];
    const req = http.request(opts, (res) => {
      res.on('data', (chunk) => {
        resData.push(chunk);
      });
      res.on('end', () => {
        resolve(JSON.parse(resData.join('')));
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.end();
  });
  return promise;
}
function httpPostRequest(addr, param) {
  /* const opts = {
    method: "POST",
    path: ah(addr),
    headers: {
      "Content-Type": "application/json",
    },
  }; */

  const promise = new Promise((resolve, reject) => {
    axios
      .post(ah(addr), param, { 'Content-Type': 'application/json' })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });

  /* const promise = new Promise((resolve, reject) => {
    const resData = [];
    const req = http.request(opts, (res) => {
      res.on('data', (chunk) => {
        resData.push(chunk);
      });
      res.on('end', (f) => {
        resolve(JSON.parse(resData.join('')));
      });
    });
    req.on('error', (err) => {
      reject(err);
    });
    req.write(JSON.stringify(param));
    req.end();
  }); */

  return promise;
}
export async function post(addr, param) {
  console.log(param);
  try {
    const qPost = await httpPostRequest(addr, param);
    return { type: 'success', message: qPost };
  } catch (e) {
    console.log(e);
    return {
      type: 'error',
      onError: (id, msg) => {
        const arr = ['error', `type:${id}`, `message:${msg}`, e.toString()];
        console.log(arr.join('\r\n'));
      },
    };
  }
}
export async function get(addr) {
  let qGet;
  try {
    qGet = await httpGetRequest(addr);
    return qGet;
  } catch (e) {
    return {
      type: 'error',
      onError: (id, msg) => {
        const arr = [
          'error',
          `type:${id}`,
          `message:${msg}`,
          `event:${e.toString()}`,
        ];
        console.log(arr.join('\r\n'));
      },
    };
  }
}
