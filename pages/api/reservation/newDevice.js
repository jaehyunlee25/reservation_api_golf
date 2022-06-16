import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  newDevice: 'newDevice',
  getDeviceUUID: 'getDevice',
};
const baseUrl = 'sqls/reservation/newDevice'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.newDevice.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  console.log(req.body);
  const { token: deviceToken, type: deviceType } = req.body;

  EXEC_STEP = '3.1.1.'; // #3.1.1.
  const qNew = await QTS.newDevice.fQuery(baseUrl, {
    deviceToken,
    deviceType,
  });
  if (qNew.type === 'error')
    return qNew.onError(res, 'newDevice.3.1.1', 'creating Device');

  EXEC_STEP = '3.2.';
  const qGet = await QTS.getDeviceUUID.fQuery(baseUrl, {
    deviceToken,
  });
  if (qGet.type === 'error')
    return qGet.onError(res, 'newDevice.3.2.1', 'searching deviceUUID');

  const { deviceUUID } = qGet.message[0];

  // #3.1.3.
  return RESPOND(res, {
    deviceUUID,
    message: '디바이스를 성공적으로 등록하였습니다.',
    resultCode: 200,
  });
}
