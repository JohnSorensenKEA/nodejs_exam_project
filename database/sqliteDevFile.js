import { createConnection } from "./connectSqlite.js";

(async () => {
    const connection = await createConnection();

    connection.run(`INSERT INTO messages ('text', 'user_id') VALUES ('Hello world', 0)`);

    connection.close();
})();