/* eslint-disable no-param-reassign */
import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  getCourses: 'getCourses',
  newGolfStatuses: 'newGolfStatuses',
};
const baseUrl = 'sqls/reservation/newGolfStatuses'; // 끝에 슬래시 붙이지 마시오.
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
  const { golf_club_id: golfClubId, data } = req.body;

  EXEC_STEP = '3.1.'; // golfClubId로 골프코스를 불러온다.
  const qGetCourses = await QTS.getCourses.fQuery(baseUrl, { golfClubId });
  if (qGetCourses.type === 'error')
    return qGetCourses.onError(
      res,
      'getCourses.3.1.1',
      'searching golf_courses',
    );

  EXEC_STEP = '3.2.'; // key, value로 dictionary를 만든다.
  const dictCourse = {};
  qGetCourses.message.forEach((obj) => {
    dictCourse[obj.name] = obj.id;
  });

  EXEC_STEP = '3.2.'; // data를 수정한다.
  data.forEach((obj) => {
    obj.courseId = dictCourse[obj.courseName];
    delete obj.courseName;
  });

  EXEC_STEP = '3.3.'; // insert쿼리를 만든다.
  const strResult = [];
  data.forEach((obj) => {
    const arr = [
      'uuid()',
      `'${golfClubId}'`,
      `'${obj.courseId}'`,
      `'${obj.date}'`,
      `'${obj.status}'`,
      obj.teams,
      'now()',
      'now()',
    ];
    const str = arr.join(',');
    strResult.push(['(', str, ')'].join(''));
  });
  const strInsert = strResult.join(',');

  EXEC_STEP = '3.4.'; // table에 입력한다.
  const qIns = await QTS.newGolfStatuses.fQuery(baseUrl, { strInsert });
  if (qIns.type === 'error')
    return qIns.onError(res, 'getCourses.3.2.1', 'creating golf_status');

  /* const qStatus = await QTS.newGolfStatus.fQuery(baseUrl, {
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

  const golfStatus = qGet.message[0]; */

  // #3.1.3.
  return RESPOND(res, {
    message: '해당하는 데이터를 성공적으로 입력하였습니다.',
    resultCode: 200,
  });
}
