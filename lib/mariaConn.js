/* eslint-disable func-names */
/* eslint no-extend-native: ["error", { "exceptions": ["String"] }] */
import fs from 'fs';
// fs의 baseUrl은 프로젝트 메인이다.
const mysql = require('mysql');

String.prototype.cm = function () {
  return `'${this}'`;
};
String.prototype.fQuery = async function fQuery(baseUrl, param) {
  const path = `${baseUrl}/${this}.sql`;
  let sql = fs.readFileSync(path, 'utf8');
  Object.keys(param).forEach((key) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g'); // 백슬래시 두 번, 잊지 말 것!!
    const val = param[key];
    sql = sql.replace(regex, val);
  });

  console.log(sql, '\n\n\n\n\n');

  let result;
  try {
    result = await procQuery(sql);
  } catch (err) {
    console.log(err, '\n\n\n\n');
    result = {
      type: 'error',
      onError: (res, id, name) => {
        const prm = {
          type: 'error',
          resultCode: 400,
          id: ['ERR', baseUrl, id].join('.'),
          name: [name, 'query failed'].join(' '),
          err: err.toString(),
        };
        res.end(JSON.stringify(prm));
      },
    };
  }

  return result;
};
function procQuery(sql) {
  const client = mysql.createConnection({
    user: process.env.db_user,
    host: process.env.db_host,
    database: process.env.db_name,
    password: process.env.db_password,
    port: process.env.db_port,
  });
  client.connect();
  const promise = new Promise((resolve, reject) => {
    client.query(sql, (err, res) => {
      if (err) {
        reject(err);
      } else {
        console.log(res, '\n\n\n\n');
        resolve({ type: 'success', message: res });
      }
      client.end();
    });
  });
  return promise;
}
