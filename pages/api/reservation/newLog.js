import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';

const mqtt = require('mqtt');

const publisher = mqtt.connect('mqtt://dev.mnemosyne.co.kr');
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  newLog: 'newLog',
};
const baseUrl = 'sqls/reservation/newLog'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.newLog.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  console.log(req.body);
  const {
    type,
    sub_type: subType,
    device_id: deviceId,
    device_token: deviceToken,
    golf_club_id: golfClubId,
    message,
    parameter,
    noPub,
  } = req.body;

  if (!type || !subType || !deviceId || !deviceToken || !golfClubId)
    return qNew.onError(res, 'newLog.3.0.1', 'parameter');

  EXEC_STEP = '3.1.1.'; // #3.1.1.
  const ip = req.connection.remoteAddress;
  const qNew = await QTS.newLog.fQuery(baseUrl, {
    type,
    subType,
    deviceId,
    deviceToken,
    ip,
    golfClubId,
    message,
    parameter,
  });
  if (qNew.type === 'error')
    return qNew.onError(res, 'newLog.3.1.1', 'creating Device');

  // mqtt
  if(!noPub) 
    publisher.publish(
      'TZLOG',
      JSON.stringify({
        type,
        subType,
        deviceId,
        deviceToken,
        ip,
        golfClubId,
        message,
        parameter,
      }),
      { qos: 0 },
    );
  // #3.1.3.
  return RESPOND(res, {
    message: '로그를 성공적으로 등록하였습니다.',
    resultCode: 200,
  });
}
