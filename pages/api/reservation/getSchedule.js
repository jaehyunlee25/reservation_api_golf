/* eslint-disable func-names */
/* eslint-disable no-extend-native */
import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  getGolfSchedule: 'getGolfSchedule',
};
const baseUrl = 'sqls/reservation/getSchedule'; // 끝에 슬래시 붙이지 마시오.
let EXEC_STEP = '1.0.';

export default async function handler(req, res) {
  // 회원가입
  // #1. cors 해제
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*', // for same origin policy
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type', // for application/json
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  });
  // #2. preflight 처리
  if (req.method === 'OPTIONS') return RESPOND(res, {});

  // #3. 데이터 처리
  // #3.1. 작업
  try {
    return await main(req, res);
  } catch (e) {
    return ERROR(res, {
      id: 'ERR.reservation.golfSchedule.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  const { golf_club_id: golfClubId } = req.body;

  EXEC_STEP = '3.2.';
  const qGS = await QTS.getGolfSchedule.fQuery(baseUrl, { golfClubId });
  if (qGS.type === 'error')
    return qGS.onError(res, 'getGolfSchedule.3.2.1', 'getting golf_schedule');
  const arr = qGS.message;
  const result = {};
  const timeStamp = new Date(arr[0].create_at).toLocaleDateString('en-US', {
    timeZone: 'Asia/Seoul',
  });
  arr.forEach((ob) => {
    result
      .branch(ob.date, {})
      .branch(ob.golf_course_name, {})
      .branch(ob.time.gh(2), [])
      .push(ob);
  });

  // #3.1.3.
  return RESPOND(res, {
    message: '해당하는 데이터를 성공적으로 입력하였습니다.',
    timeStamp,
    schedule: result,
    resultCode: 200,
  });
}
Object.prototype.branch = function (key, val) {
  if (this[key] === undefined) this[key] = val;
  return this[key];
};
String.prototype.gh = function (num) {
  // get head
  return this.substring(0, num);
};
