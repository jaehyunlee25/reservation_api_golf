delete from
    golf_club_in_device
where
    device_id = '${deviceUUID}' and
    golf_club_id = '${golfClubId}';