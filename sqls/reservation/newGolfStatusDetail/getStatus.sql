select
    id,
    golf_club_id,
    golf_course_id,
    DATE_FORMAT(date, '%Y-%m-%d') date,
    status,
    teams
from
    golf_status
where
    golf_club_id = '${golfClubId}'
    and golf_course_id = '${golfCourseId}'
    and date = '${date}'
order by
    created_at desc
limit 1;