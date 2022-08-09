import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  getClubLoginInfo: 'getClubLoginInfo',
  newLoginUrl: 'newLoginUrl',
  setLoginUrl: 'setLoginUrl',
};
const baseUrl = 'sqls/reservation/setGolfClubLoginInfo'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.setGolfClubLoginInfo.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  const {
    id: golfClubId,
    mobile,
    admin_id: adminId,
    admin_pw: adminPw,
  } = req.body;
  EXEC_STEP = '3.1.1.';
  const qClubs = await QTS.getClubLoginInfo.fQuery(baseUrl, { golfClubId });
  if (qClubs.type === 'error')
    return qClubs.onError(
      res,
      'setGolfClubLoginInfo.3.1.1',
      'searching club login info',
    );

  EXEC_STEP = '3.1.2.';
  const golfClubs = qClubs.message;
  if (golfClubs.length === 0) {
    const qNew = await QTS.newLoginUrl.fQuery(baseUrl, { golfClubId });
    if (qNew.type === 'error')
      return qNew.onError(
        res,
        'setGolfClubLoginInfo.3.1.2',
        'searching club login url',
      );
  }

  EXEC_STEP = '3.1.3.';
  const qSet = await QTS.setLoginUrl.fQuery(baseUrl, {
    golfClubId,
    mobile,
    adminId,
    adminPw,
  });
  if (qSet.type === 'error')
    return qSet.onError(
      res,
      'setGolfClubLoginInfo.3.1.3',
      'updating club login url',
    );

  // #3.1.3.
  return RESPOND(res, {
    message: '해당하는 데이터를 성공적으로 입력하였습니다.',
    resultCode: 200,
  });
}
