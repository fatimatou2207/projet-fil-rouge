const db = require('./db');

const insert = db.prepare(`
    INSERT INTO stagiaires 
    (nom, note, formation, date_naissance)
    VALUES (?, ?, ?, ?)
`);

insert.run('Awa Diop', 15, 'Backend', '2002-05-10');
insert.run('Moussa Ba', 9, 'Frontend', '2001-08-20');
insert.run('Fatou Ndiaye', 17, 'Backend', '2003-02-15');
insert.run('Ibrahima Fall', 12, 'Frontend', '2002-11-03');
insert.run('Mariama Diallo', 14, 'Full Stack', '2001-06-25');

console.log('5 stagiaires ajoutés.');