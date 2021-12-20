import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  newGolfStatus: 'newGolfStatus',
  getStatus: 'getStatus',
};
const baseUrl = 'sqls/reservation/newGolfStatus'; // 끝에 슬래시 붙이지 마시오.
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
  const {
    golf_club_id: golfClubId,
    golf_course_id: golfCourseId,
    date,
    status,
    teams,
  } = req.body;

  EXEC_STEP = '3.1.1.'; // #3.1.1. productId를 바탕으로 product 상세 정보를 얻는다.
  const qStatus = await QTS.newGolfStatus.fQuery(baseUrl, {
    golfClubId,
    golfCourseId,
    date,
    status,
    teams,
  });
  if (qStatus.type === 'error')
    return qStatus.onError(res, 'getCourses.3.1.1', 'creating golf_status');

  EXEC_STEP = '3.2.';
  const qGet = await QTS.getStatus.fQuery(baseUrl, {});
  if (qGet.type === 'error')
    return qGet.onError(res, 'getCourses.3.2.1', 'searching golf_status');

  const golfStatus = qGet.message[0];

  // #3.1.3.
  return RESPOND(res, {
    golfStatus,
    message: '해당하는 데이터를 성공적으로 입력하였습니다.',
    resultCode: 200,
  });
}
