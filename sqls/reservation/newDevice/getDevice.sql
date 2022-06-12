select 
    id deviceUUID
from
    device
where
    token = '${deviceToken}';