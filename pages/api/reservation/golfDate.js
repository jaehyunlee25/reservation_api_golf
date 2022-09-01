import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  newGolfDate: 'newGolfDate',
  delPastGolfDate: 'delPastGolfDate',
};
const baseUrl = 'sqls/reservation/golfDate'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.golfDate.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  const {
    golf_date: golfDate,
    golf_club_id: golfClubId,
    device_id: deviceId,
  } = req.body;
  console.log(req.body);

  EXEC_STEP = '3.2.';
  const qDSD = await QTS.delPastGolfDate.fQuery(baseUrl, { golfClubId });
  if (qDSD.type === 'error')
    return qDSD.onError(res, 'delPastGolfDate.3.2.1', 'removing golf_date');

  EXEC_STEP = '3.3.';
  if (golfDate.length > 0) {
    const arrValues = [];
    golfDate.forEach((date) => {
      const str = [
        'uuid()',
        `'${deviceId}'`,
        `'${golfClubId}'`,
        `'${date}'`,
        'now()',
        'now()',
      ].join(',');
      arrValues.push(['(', str, ')'].join(''));
    });
    const sqlValues = arrValues.join(',');

    EXEC_STEP = '3.3.';
    const qNew = await QTS.newGolfDate.fQuery(baseUrl, { sqlValues });
    if (qNew.type === 'error')
      return qNew.onError(res, 'golfDate.3.3.1', 'creating golf_schedule');

    EXEC_STEP = '3.3.';
    /* const qDel = await QTS.delPastStatusDetail.fQuery(baseUrl, {});
    if (qDel.type === 'error')
      return qDel.onError(res, 'getCourses.3.3.1', 'removing golf_status_detail'); */
  }

  // #3.1.3.
  return RESPOND(res, {
    message: '해당하는 데이터를 성공적으로 입력하였습니다.',
    resultCode: 200,
  });
}
