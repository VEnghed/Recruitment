import pg from 'pg'; //postgres
const Pool = pg.Pool;

const newpool = new Pool({
    user: "postgres",
    password: "hello",
    host: "localhost",
    port: 5432,
    database: "testperson"
})

export default newpool;