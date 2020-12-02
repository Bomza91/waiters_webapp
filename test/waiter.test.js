const waiter = require('./waiter');
var assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}


const connectionString = process.env.DATABASE_URL || 'postgresql://bomza:codex@123@localhost:5432/availability';

const pool = new Pool({
    connectionString
});

describe('The Add function for Waiter Availability', function () {

  beforeEach(async function () {
    await pool.query('DELETE FROM shifts');
  });
  it("should be able to add a ", async function () {
    const waiterInstance = waiter(pool)

    await waiterInstance.regNumber("CA 123 456")

    const results = await pool.query("select count(*) from regNumbers");

    assert.equal(1, results.rows[0].count);

  });

  it('should be able to add registration numbers from different towns', async function () {
    const waiterInstance = waiter(pool)

    await waiterInstance.regNumber("CJ 199 911")
    await waiterInstance.regNumber("CA 123 456")
    const results = await waiterInstance.getReg()

    await assert.deepEqual([{ "reg": "CA 123 456"  }], results)
   
  });

  it('should be able to add registration and filter them by a code', async function () {
    const waiterInstance = waiter(pool)

    await waiterInstance.regNumber("CJ 365 854")
    await waiterInstance.regNumber("CA 654 856")
    await waiterInstance.regNumber("CA 987 523")
    const results = await waiterInstance.showFilter('CJ')
  
    await assert.deepEqual[('CJ 365 854', results)]
  });
  


  it('should be able to delete everything on the database', async function () {
    const waiterInstance = waiter(pool)

    await waiterInstance.regNumber("CJ 256")
    await waiterInstance.regNumber("CA 123 852") 
    await waiterInstance.regNumber("CJ 654 856")
    await waiterInstance.regNumber("CA 987 563")
    await waiterInstance.reset()
    const results = await pool.query("select count(*) from regNumbers");
    await assert.deepEqual(0, results.rows[0].count)
  })


})
