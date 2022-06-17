insert into 
    golf_club 
values(
    uuid(),
    '${name}',
    '${address}',
    '${area}',
    '${phone}',
    '${email}',
    '${homepage}',
    '${corpRegNumber}',
    '${description}',
    now(),
    now()
);