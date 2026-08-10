const db = require('./db');

const stagiaires = db.prepare('SELECT * FROM stagiaires').all();

console.log(stagiaires);