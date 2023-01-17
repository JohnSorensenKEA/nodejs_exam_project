import { createConnection } from "./connectSqlite.js";

(async () => {
    const connection = await createConnection();

    await connection.exec("DROP TABLE IF EXISTS users");
    await connection.exec("DROP TABLE IF EXISTS messages");
    await connection.exec("DROP TABLE IF EXISTS posts");
    
    
    const usersTableSchema = `
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            email TEXT NOT NULL,
            member_number TEXT NOT NULL
        )
    `;

    const messagesTableSchema = `
        CREATE TABLE messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id)
                REFERENCES users (id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION
        )
    `;

    const postsTableSchema = `
        CREATE TABLE posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id)
                REFERENCES users (id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION
        )
    `;

    await connection.exec(usersTableSchema);
    await connection.exec(messagesTableSchema);
    await connection.exec(postsTableSchema);

    await connection.close();
})();