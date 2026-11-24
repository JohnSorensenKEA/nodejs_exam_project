import { createConnection } from "./connectSqlite.js";

(async () => {
    const connection = await createConnection();
    
    await connection.exec("DROP TABLE IF EXISTS user_emails");
    await connection.exec("DROP TABLE IF EXISTS users");
    await connection.exec("DROP TABLE IF EXISTS messages");
    await connection.exec("DROP TABLE IF EXISTS posts");
    await connection.exec("DROP TABLE IF EXISTS requests");
    await connection.exec("DROP TABLE IF EXISTS emails");
    
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
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
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

    const requestsTableSchema = `
        CREATE TABLE requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL
        )
    `;

    const emailsTableSchema = `
        CREATE TABLE emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            system_message TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
    `;

    const userEmailsTableSchema = `
        CREATE TABLE user_emails (
            user_id INT,
            email_id INT,
            PRIMARY KEY (user_id, email_id),
            FOREIGN KEY (user_id) 
                REFERENCES users(id),
            FOREIGN KEY (email_id)
                REFERENCES emails(id)
                    ON DELETE CASCADE
                    ON UPDATE NO ACTION
        )
    `;

    await connection.exec(usersTableSchema);
    await connection.exec(messagesTableSchema);
    await connection.exec(postsTableSchema);
    await connection.exec(requestsTableSchema);
    await connection.exec(emailsTableSchema);
    await connection.exec(userEmailsTableSchema);

    await connection.close();
})();
