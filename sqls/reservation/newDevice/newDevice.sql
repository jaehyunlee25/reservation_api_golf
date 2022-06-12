insert into 
    device 
values(
    uuid(),
    '${deviceToken}',
    '${deviceType}',
    now(),
    now()
);
