const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE library (id INTEGER PRIMARY KEY, title TEXT)");
  const mockData = [
    [0, "A Sorcerer's Journey"],
    [1, "Reverend Insanity"],
  ];
  const stmt = db.prepare("INSERT INTO library (id, title) VALUES (?,?)");
  mockData.forEach((row) => stmt.run(row));
  stmt.finalize();
});
db.close();
module.exports = db;
