module.exports = function availability(pool) {


    async function checkingWaiters(nameEntered) {
        var names = await pool.query("select id from waiters where waiter_name=$1", [nameEntered]);
        return names.rowCount == 0
    }

    async function WaiterId(get) {
        
        var Wid = await pool.query("select id from waiters where waiter_name=$1", [get]);
        return Wid.rows[0].id
    }

    async function addWaiters(nameEntered) {
        var waiterName = await pool.query(`select waiter_name from waiters where waiter_name=$1`, [nameEntered])
        if (waiterName.rowCount == 0) {
            await pool.query(`insert into waiters (waiter_name) values($1)`, [nameEntered]);
        }
        var getId = await WaiterId(nameEntered)
        return getId;


    }

async function selectedDays(day){
    const days = await pool.query(`select dayname from shifts where waiter_name = $1`, [day])
    const d = days.rows;

    const weekday = await pool.query(`select * from weekdays`)
    const intsuku = weekday.rows;

    intsuku.forEach(chosenDays => {
        if (selectedDays.weekday === chosenDays.weekdays) {
            chosenDays.state = "checked"
        }
    })
    return intsuku;
}

    async function checkDays(days) {
        var day = await pool.query(`select id from weekdays where dayname = $1`, [days])
        return day.rowCount == 0;

    }


    async function addShifts(personId, dayId) {
       
        var name = await addWaiters(personId)
        console.log(name);

        await pool.query(`delete from shifts where waiterId = $1`, [name])
   

        for (const day of dayId) {
            var usuku = await getDay(day)
        
            for (const z of usuku) {
                await pool.query(`insert into shifts(weekdayId, waiterId) values($1, $2)`, [z.weekdayId, name])

            }

        }
    }

    async function getShifts(){

    }

    async function addWaitersShifts(personId, dayId) {
        await pool.query(`insert into shifts (weekdayId, waiterId) values($1,$2)`, [dayId, personId])
    }


    async function deleteUser(names) {

        await pool.query(`delete from waiters where waiter_name = $1`, [names])
    }

    async function getWaiters() {
        var waiter = await pool.query(`select waiter_name from waiters`);
        return waiter.rows;
    }

    async function getDays() {
        var days = await pool.query(`select * from weekdays`)
        return days.rows
    }

    async function getWaiterByName(names) {
        const waiter = await pool.query(`select waiter_name from waiters where waiter_name=$1`, [names])
        return waiter.rows[0];
    }

    async function getDay(dayId) {
        const day = await pool.query(`select id from weekdays where dayname = $1`, [dayId])
    
        return day.rows;
    }

    async function reset() {
        await pool.query(`delete from shifts`)
    }


    return {
        addWaiters,
        getDays,
        selectedDays,
        addWaitersShifts,
        getWaiters,
        WaiterId,
        getWaiterByName,
        checkingWaiters,
        deleteUser,
        addShifts,
        getShifts,
        checkDays,
        getDay,
        reset,
       }
    }