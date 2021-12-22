/* eslint-disable prefer-template */
/* eslint-disable no-param-reassign */
import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  delPastGolfStatuses: 'delPastGolfStatuses',
  delPastStatusDetail: 'delPastStatusDetail',
};
const baseUrl = 'sqls/reservation/delPast'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.newGolfStatus.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  // const { } = req.body;

  EXEC_STEP = '3.1.'; // golf_status 데이터를 지운다.
  const today = getToday(new Date());
  const qDS = await QTS.delPastGolfStatuses.fQuery(baseUrl, { today });
  if (qDS.type === 'error')
    return qDS.onError(res, 'delPast.3.1.1', 'removing golf_status');

  EXEC_STEP = '3.2.'; // golf_status 데이터를 지운다.
  const qDSD = await QTS.delPastGolfStatuses.fQuery(baseUrl, { today });
  if (qDSD.type === 'error')
    return qDSD.onError(res, 'delPast.3.2.1', 'removing golf_status_detail');

  // #3.1.3.
  return RESPOND(res, {
    message: '해당하는 데이터를 성공적으로 삭제하였습니다.',
    resultCode: 200,
  });
}
function getToday(date) {
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);

  return year + '-' + month + '-' + day;
}
