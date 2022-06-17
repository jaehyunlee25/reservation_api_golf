import { RESPOND, ERROR } from '../../../lib/apiCommon';
import '../../../lib/mariaConn';

const mqtt = require('mqtt');

const publisher = mqtt.connect('mqtt://dev.mnemosyne.co.kr');
// import { get, post } from '../../../lib/xmlHttpRequest';

const QTS = {
  // Query TemplateS
  newGolfClub: 'newGolfClub',
  getGolfClub: 'getGolfClub',
  newGolfClubEng: 'newGolfClubEng',
  newGolfCourse: 'newGolfCourse',
};
const baseUrl = 'sqls/reservation/newGolfClub'; // 끝에 슬래시 붙이지 마시오.
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
      id: 'ERR.reservation.newGolfClub.3.2.2',
      message: 'post server logic error',
      error: e.toString(),
      step: EXEC_STEP,
    });
  }
}
async function main(req, res) {
  console.log(req.body);
  const {
    name,
    address,
    area,
    phone,
    email,
    homepage,
    corp_reg_number: corpRegNumber,
    description,
    eng_id: engId,
    courses,
  } = req.body;

  EXEC_STEP = '3.1.1.'; // #3.1.1.
  const qNew = await QTS.newGolfClub.fQuery(baseUrl, {
    name,
    address,
    area,
    phone,
    email,
    homepage,
    corpRegNumber,
    description,
  });
  if (qNew.type === 'error')
    return qNew.onError(res, 'newGolfClub.3.1.1', 'creating GolfClub');

  EXEC_STEP = '3.1.2.'; // #3.1.2.
  const qGet = await QTS.getGolfClub.fQuery(baseUrl, { name, corpRegNumber });
  if (qGet.type === 'error')
    return qGet.onError(res, 'newGolfClub.3.1.2', 'search GolfClub');
  const { golfClubId } = qGet.message[0];

  EXEC_STEP = '3.1.3.'; // #3.1.3.
  const qNewEng = await QTS.newGolfClubEng.fQuery(baseUrl, {
    engId,
    golfClubId,
  });
  if (qNewEng.type === 'error')
    return qNewEng.onError(res, 'newGolfClub.3.1.3', 'creating GolfClub');

  const values = [];
  courses.split(',').forEach((course) => {
    const [courseName, courseDescription] = course.split(':');
    const arr = [
      'uuid()',
      golfClubId.cm(),
      courseName.cm(),
      courseDescription.cm(),
      'now()',
      'now()',
    ];
    const value = ['(', arr.join(','), ')'].join('');
    values.push(value);
  });
  const strValues = values.join(',');

  EXEC_STEP = '3.1.4.'; // #3.1.4.
  const qNewCourse = await QTS.newGolfCourse.fQuery(baseUrl, { strValues });
  if (qNewCourse.type === 'error')
    return qNewCourse.onError(res, 'newGolfClub.3.1.4', 'creating GolfCourse');

  // mqtt
  EXEC_STEP = '3.1.5.'; // #3.1.5.
  publisher.publish(
    'TZLOG',
    JSON.stringify({
      message: '새로운 골프장이 등록되었습니다.',
      name,
      address,
      area,
      phone,
      email,
      homepage,
      corpRegNumber,
      description,
    }),
    { qos: 0 },
  );
  // #3.1.3.
  return RESPOND(res, {
    message: '로그를 성공적으로 등록하였습니다.',
    resultCode: 200,
  });
}
