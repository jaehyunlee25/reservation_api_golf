select 
	golf_club.id,
	golf_club.name,
    golf_club_eng.eng_id,
    golf_club.homepage,
    golf_club_search_url.mobile,
    golf_club.created_at,
    golf_club.updated_at
from 
	golf_club
left join golf_club_eng on golf_club_eng.golf_club_id = golf_club.id
left join golf_club_search_url on golf_club_search_url.golf_club_id = golf_club.id;