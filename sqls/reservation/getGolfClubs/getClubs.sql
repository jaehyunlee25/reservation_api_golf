select
    golf_club.*,
    golf_club_eng.eng_id

from

    golf_club
    join golf_club_eng on golf_club_eng.golf_club_id = golf_club.id;