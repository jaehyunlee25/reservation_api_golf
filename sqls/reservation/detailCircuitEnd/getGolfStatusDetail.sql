select 
	gss.*,
	gss.date,
    gss.club_name,
    gss.course_name,
    sd.time_slot,
    sd.teams,
    sd.green_fee
from golf_status_detail sd
	left join (select 
					tgs.id id, 
                    tgs.date, 
                    c.name club_name, 
                    gc.name course_name
				from (select  
							golf_status.*
						from  golf_status
								left join golf_course on golf_course.id = golf_status.golf_course_id
						where 
							(golf_status.date, golf_status.created_at) 
							in (select 
									date, 
                                    max(created_at) created_at 
								from 
									golf_status
								group by date)
						order by golf_status.date asc) tgs 
					left join golf_club c on c.id = tgs.golf_club_id
                    left join golf_course gc on gc.id = tgs.golf_course_id) gss
	on sd.golf_status_id = gss.id
where gss.id is not null
order by 
	gss.date asc
	and gss.time_slot asc;