import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  delGolfClubInDevice: 'delGolfClubInDevice',
};
const baseUrl = 'sqls/reservation/delGolfClubInDevice'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.delGolfClubInDevice.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  const {
    id: deviceUUID,
    golf_club_id: golfClubId,
  } = req.body;

  EXEC_STEP = '3.1.1.'; // #3.1.1. 
  const qDel = await QTS.delGolfClubInDevice.fQuery(baseUrl, {
    deviceUUID,
    golfClubId,
  });
  if (qDel.type === 'error')
    return qDel.onError(res, 'delGolfClubInDevice.3.1.1', 'deleting golf_club');
    
  // #3.1.3.
  return RESPOND(res, {
    message: '골프클럽이 성공적으로 삭제되었습니다.',
    resultCode: 200,
  });
}
