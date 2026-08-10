const http = require("http");
const db = require("./db");

const serveur = http.createServer((req, res) => {

    // =========================
    // CORS
    // =========================

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    // =========================
    // OPTIONS
    // =========================

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }


    // =========================
    // GET : afficher tous les stagiaires
    // =========================

    if (req.method === "GET" && req.url === "/stagiaires") {

        const stagiaires = db.prepare(
            "SELECT * FROM stagiaires"
        ).all();

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(stagiaires));

        return;
    }


    // =========================
    // POST : ajouter un stagiaire
    // =========================

    if (req.method === "POST" && req.url === "/stagiaires") {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const stagiaire = JSON.parse(body);

            // Date et heure d'ajout
            const dateAjout = new Date().toISOString();

            db.prepare(`
                INSERT INTO stagiaires
                (
                    nom,
                    note,
                    formation,
                    date_naissance,
                    date_ajout
                )
                VALUES (?, ?, ?, ?, ?)
            `).run(
                stagiaire.nom,
                stagiaire.note,
                stagiaire.formation,
                stagiaire.date_naissance,
                dateAjout
            );

            res.writeHead(201, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Stagiaire ajouté"
            }));
        });

        return;
    }


    // =========================
    // PUT : modifier un stagiaire
    // =========================

    if (
        req.method === "PUT" &&
        req.url.startsWith("/stagiaires/")
    ) {

        const id = req.url.split("/")[2];

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {

            const stagiaire = JSON.parse(body);

            db.prepare(`
                UPDATE stagiaires
                SET
                    nom = ?,
                    note = ?,
                    formation = ?,
                    date_naissance = ?
                WHERE id = ?
            `).run(
                stagiaire.nom,
                stagiaire.note,
                stagiaire.formation,
                stagiaire.date_naissance,
                id
            );

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                message: "Stagiaire modifié"
            }));
        });

        return;
    }


    // =========================
    // DELETE : supprimer un stagiaire
    // =========================

    if (
        req.method === "DELETE" &&
        req.url.startsWith("/stagiaires/")
    ) {

        const id = req.url.split("/")[2];

        db.prepare(
            "DELETE FROM stagiaires WHERE id = ?"
        ).run(id);

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify({
            message: "Stagiaire supprimé"
        }));

        return;
    }


    // =========================
    // ROUTE INCONNUE
    // =========================

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        message: "Route non trouvée"
    }));

});


serveur.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});