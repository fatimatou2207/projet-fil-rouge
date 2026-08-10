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
try {
    db.exec(`
        ALTER TABLE stagiaires
        ADD COLUMN date_ajout TEXT
    `);

    console.log("Colonne date_ajout ajoutée.");
} catch (error) {
    // La colonne existe déjà, donc on ne fait rien
    if (!error.message.includes("duplicate column name")) {
        console.log(error.message);
    }
}

console.log('Base de données prête.');

module.exports = db;