select
    golf_club.id,
    golf_club.name,
    golf_club.phone,
    golf_club.area,
    golf_club.email,
    golf_club.homepage,
    golf_club.address,
    golf_club.corp_reg_number,
    golf_club.description,
    golf_club_eng.eng_id eng,
    golf_club_usability.golf_club_state state
from
    golf_club
    join golf_club_eng on golf_club_eng.golf_club_id = golf_club.id
    join golf_club_usability on golf_club_usability.golf_club_id = golf_club.id
    join golf_club_detail on golf_club_detail.golf_club_id = golf_club.id
    JOIN golf_club_order ON golf_club_order.golf_club_id = golf_club.id
where
    golf_club_detail.login_script = true
ORDER BY golf_club_order.golf_club_score desc;