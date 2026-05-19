const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, function (error) {
    if (error) {
        console.error("Lỗi kết nối database:", error.message);
    } else {
        console.log("Đã kết nối SQLite database");
    }
});

db.serialize(function () {
    db.run(`
        CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fullname TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            service TEXT NOT NULL,
            message TEXT,
            status TEXT DEFAULT 'Mới',
            created_at TEXT NOT NULL
        )
    `);
});

module.exports = db;
