create table waiters(
    id serial primary key,
    waiter_name text not null
);

create table weekdays(
    id serial primary key,
    dayname text not null
);

create table shifts(
    waiterId int not null,
    weekdayId int not null,
     FOREIGN key (waiterId) REFERENCES waiters(id),
    FOREIGN key (weekdayId) REFERENCES weekdays(id)
);

insert into weekdays (dayname) values ('Monday');
insert into weekdays (dayname) values ('Tuesday');
insert into weekdays (dayname) values ('Wednesday');
insert into weekdays (dayname) values ('Thursday');
insert into weekdays (dayname) values ('Friday');


