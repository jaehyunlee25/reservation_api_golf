select
    id golfClubId
from
    golf_club
where
    name = '${name}' and
    corp_reg_number = '${corpRegNumber}';