import * as sqlite3 from 'sqlite3';

class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database(':memory:');

    this.db.serialize(() => {
      this.db.run(`CREATE TABLE IF NOT EXISTS apitokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    token TEXT UNIQUE NOT NULL
  )`);
    });
  }

  async get<T>(query: string, params: any) {
    return new Promise<T>((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async insert(query: string, params: any) {
    return new Promise<number>((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }
}

export default new Database();
