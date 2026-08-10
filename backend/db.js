const Database = require('better-sqlite3');

// Ouvre la base de données ou la crée si elle n'existe pas
const db = new Database('stage.db');

// Crée la table stagiaires si elle n'existe pas
db.exec(`
    CREATE TABLE IF NOT EXISTS stagiaires (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT NOT NULL,
        note REAL NOT NULL,
        formation TEXT NOT NULL,
        date_naissance TEXT
    )
`);

console.log('Base de données prête.');

module.exports = db;