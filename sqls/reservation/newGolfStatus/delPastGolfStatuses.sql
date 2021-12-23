delete from 
    golf_status 
where 
    id 
    not in 
    (
        select  gs.id
        from  golf_status gs
                left join golf_course gc on gc.id = gs.golf_course_id
        where 
            (gs.date, gs.created_at) 
            in (select date, max(created_at) created_at 
                from golf_status 
                group by date
                )
        order by gs.date asc
    );