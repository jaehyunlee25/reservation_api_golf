insert into 
    log (
        type,
        sub_type,
        device_id,
        device_token,
        ip,
        golf_club_id,
        message,
        parameter,
        created_at,
        updated_at
    )values(
        '${type}',
        '${subType}',
        '${deviceId}',
        '${deviceToken}',
        '${ip}',
        '${golfClubId}',
        '${message}',
        '${parameter}',
        now(),
        now()
    );
