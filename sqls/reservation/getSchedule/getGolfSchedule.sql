select 
    gs.id,
    gcb.name golf_club_name,
    date_format(gs.date, '%Y-%m-%d') as date,
    gcs.name golf_course_name,
    gs.time,
    gs.fee_normal,
    gs.fee_discount,
    gs.others,
    gs.created_at,
from
    golf_schedule gs
    left join golf_club gcb on gcb.id = gs.golf_club_id
    left join golf_course gcs on gcs.id = gs.golf_course_id
where
    gs.golf_club_id = '${golfClubId}'
order by
    date asc,
    time asc;