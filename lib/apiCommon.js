/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
import fs from 'fs';

export function READ(clubId) {
  const base = 'statics/reservation';
  let result;
  try {
    const con = fs.readFileSync(base + '/' + clubId + '.json', 'utf-8');
    result = { type: 'success', message: con };
  } catch (err) {
    console.log(err, '\n\n\n\n');
    result = {
      type: 'error',
      onError: (res, id, name) => {
        const prm = {
          type: 'error',
          resultCode: 400,
          id: ['ERR', base, id].join('.'),
          name: [name, 'query failed'].join(' '),
          err: err.toString(),
        };
        res.end(JSON.stringify(prm));
      },
    };
  }
  return result;
}
export function SAVE(clubId, json) {
  const base = 'statics/reservation';
  let result;
  try {
    fs.writeFileSync(
      base + '/' + clubId + '.json',
      JSON.stringify(json),
      'utf-8',
    );
    result = {
      type: 'success',
      message: '골프 클럽 예약정보 저장에 성공했습니다.',
    };
  } catch (err) {
    console.log(err, '\n\n\n\n');
    result = {
      type: 'error',
      onError: (res, id, name) => {
        const prm = {
          type: 'error',
          resultCode: 400,
          id: ['ERR', base, id].join('.'),
          name: [name, 'query failed'].join(' '),
          err: err.toString(),
        };
        res.end(JSON.stringify(prm));
      },
    };
  }
  return result;
}
export function getRandom(start, end) {
  const amount = end - start;
  const rslt = Math.random() * (amount + 1) + start;
  return parseInt(rslt, 10);
}
export function RESPOND(res, param) {
  res.end(JSON.stringify(param));
}
export function ERROR(res, param) {
  param.type = 'error';
  param.resultCode = 400;
  res.end(JSON.stringify(param));
}
