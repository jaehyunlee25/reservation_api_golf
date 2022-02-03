select 
    gs.id,
    gcb.name,
    gs.date,    
    gcs.name,    
    gs.time,
    gs.fee_normal,
    gs.fee_discount,
    gs.others
from
    golf_schedule gs
    left join golf_club gcb on gcb.id = gs.golf_club_id
    left join golf_course gcs on gcs.id = gs.golf_course_id
where
    golf_club_id = '${golfClubId}'
order by
    date asc,
    time asc;