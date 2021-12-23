/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
import fs from 'fs';

export function SAVE(clubId, json) {
  const base = 'statics';
  fs.writeFileSync(
    base + '/' + clubId + '.json',
    JSON.stringify(json),
    'utf-8',
  );
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
