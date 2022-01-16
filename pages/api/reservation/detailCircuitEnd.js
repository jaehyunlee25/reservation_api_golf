import { RESPOND, ERROR, SAVE } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  getGolfStatusDetail: 'getGolfStatusDetail',
};
const baseUrl = 'sqls/reservation/detailCircuitEnd'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.detailCircuitEnd.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  const { golf_club_id: golfClubId } = req.body;

  EXEC_STEP = '3.3.';
  const qGet = await QTS.getGolfStatusDetail.fQuery(baseUrl, { golfClubId });
  if (qGet.type === 'error')
    return qGet.onError(
      res,
      'detailCircuitEnd.3.3.1',
      'getting golf_status_detail',
    );
  const json = qGet.message;

  EXEC_STEP = '3.4.';
  const qSave = SAVE(golfClubId, json);
  if (qSave.type === 'error')
    return qSave.onError(
      res,
      'detailCircuitEnd.3.4.1',
      'reading golf_status_detail',
    );

  const result = qSave.message;

  // #3.1.3.
  return RESPOND(res, {
    result,
    message: '해당하는 데이터를 성공적으로 입력하였습니다.',
    resultCode: 200,
  });
}
