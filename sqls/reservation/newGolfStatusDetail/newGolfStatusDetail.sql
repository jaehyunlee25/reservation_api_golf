insert into
    golf_status_detail
values
    (
        uuid(),
        '${golfStatusId}',
        '${timeSlot}',
        '${greenFee}',
        '${teams}',
        now(),
        now()
    );