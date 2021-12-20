insert into
    golf_status
values
    (
        uuid(),
        '${golfClubId}',
        '${golfCourseId}',
        '${date}',
        '${status}',
        ${teams},
        now(),
        now()
    );