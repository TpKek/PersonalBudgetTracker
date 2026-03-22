import pg from "pg"
const {Pool} = pg

const pool= new Pool({
    user: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

export default pool

pool
  .connect()
  .catch(err => console.error('Database connection failed:', err.message));
