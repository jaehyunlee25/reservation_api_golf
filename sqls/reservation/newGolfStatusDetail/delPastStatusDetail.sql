delete from
    golf_status_detail
where
    id in (select gsd.id 
            from golf_status_detail gsd
                left join golf_status gs on gs.id = gsd.golf_status_id
            where gs.id is null
        );
