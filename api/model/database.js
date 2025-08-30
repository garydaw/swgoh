//maria db
import mariadb from 'mariadb';

//vars to be swapped with env variables
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.MY_DB,
  bigIntAsNumber: true 
});

//connect to db, run query and return results
var runSQL = async function sqlConnection(sql, values) {
  
    //console.log(sql);
    //console.log(values);
    const conn = await pool.getConnection();
    const rows = await conn.query(sql, values);
    //console.log(rows);
    conn.release();

    return rows;
};

export default runSQL;