import pg from "pg"
const {pool} = pg

const pool= new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "expense_tracker"
})

export default pool
