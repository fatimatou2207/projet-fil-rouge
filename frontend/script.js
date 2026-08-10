const bouton = document.getElementById("ajouter");

let idModification = null;


// =====================================
// CHARGER LES STAGIAIRES
// =====================================

function chargerStagiaires() {

    fetch("http://localhost:3000/stagiaires")

        .then(response => {

            if (!response.ok) {
                throw new Error("Erreur lors du chargement");
            }

            return response.json();

        })

        .then(stagiaires => {

            const liste = document.getElementById("liste");

            liste.innerHTML = "";


            stagiaires.forEach(stagiaire => {

                const ligne = document.createElement("tr");


                ligne.innerHTML = `
                    <td>${stagiaire.id}</td>

                    <td>${stagiaire.nom}</td>

                    <td>${stagiaire.note}</td>

                    <td>${stagiaire.formation}</td>

                    <td>${formaterDate(stagiaire.date_naissance)}</td>

                    <td></td>
                `;


                // =====================================
                // BOUTON MODIFIER
                // =====================================

                const boutonModifier =
                    document.createElement("button");

                boutonModifier.textContent = "Modifier";


                boutonModifier.addEventListener("click", () => {

                    document.getElementById("nom").value =
                        stagiaire.nom;

                    document.getElementById("note").value =
                        stagiaire.note;

                    document.getElementById("formation").value =
                        stagiaire.formation;

                    document.getElementById("date_naissance").value =
                        stagiaire.date_naissance;


                    idModification = stagiaire.id;

                    bouton.textContent = "Modifier";

                });


                // =====================================
                // BOUTON SUPPRIMER
                // =====================================

                const boutonSupprimer =
                    document.createElement("button");

                boutonSupprimer.textContent = "Supprimer";


                boutonSupprimer.addEventListener("click", () => {

                    supprimerStagiaire(stagiaire.id);

                });


                ligne.children[5].appendChild(
                    boutonModifier
                );

                ligne.children[5].appendChild(
                    boutonSupprimer
                );


                liste.appendChild(ligne);

            });
            const total = stagiaires.length;

let moyenne = 0;
let noteMax = 0;
let noteMin = 0;

if (total > 0) {

    const notes = stagiaires.map(
        stagiaire => Number(stagiaire.note)
    );

    const somme = notes.reduce(
        (total, note) => total + note,
        0
    );

    moyenne = somme / total;
    noteMax = Math.max(...notes);
    noteMin = Math.min(...notes);
}
document.getElementById("totalStagiaires").textContent = total;

document.getElementById("moyenneNotes").textContent =
    moyenne.toFixed(2);

document.getElementById("noteMax").textContent = noteMax;

document.getElementById("noteMin").textContent = noteMin;

            // Appliquer les filtres après chargement

            filtrerStagiaires();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Impossible de charger les stagiaires."
            );

        });

}



// =====================================
// DATE FRANÇAISE
// =====================================

function formaterDate(date) {

    if (!date) {
        return "";
    }


    const morceaux = date.split("-");


    if (morceaux.length !== 3) {
        return date;
    }


    return (
        morceaux[2] +
        "/" +
        morceaux[1] +
        "/" +
        morceaux[0]
    );

}



// =====================================
// AJOUTER / MODIFIER
// =====================================

bouton.addEventListener("click", () => {


    const nom =
        document.getElementById("nom").value.trim();


    const note =
        document.getElementById("note").value;


    const formation =
        document.getElementById("formation").value.trim();


    const date_naissance =
        document.getElementById("date_naissance").value;



    // =====================================
    // VALIDATION
    // =====================================

    if (nom === "") {

        alert("Veuillez entrer un nom.");

        return;

    }


    if (note === "") {

        alert("Veuillez entrer une note.");

        return;

    }


    if (Number(note) < 0 || Number(note) > 20) {

        alert(
            "La note doit être comprise entre 0 et 20."
        );

        return;

    }


    if (formation === "") {

        alert("Veuillez entrer une formation.");

        return;

    }


    if (date_naissance === "") {

        alert(
            "Veuillez entrer une date de naissance."
        );

        return;

    }



    const stagiaire = {

        nom: nom,

        note: Number(note),

        formation: formation,

        date_naissance: date_naissance

    };



    let url =
        "http://localhost:3000/stagiaires";


    let methode = "POST";



    // =====================================
    // MODIFICATION
    // =====================================

    if (idModification !== null) {

        url =
            `http://localhost:3000/stagiaires/${idModification}`;

        methode = "PUT";

    }



    fetch(url, {

        method: methode,

        headers: {

            "Content-Type":
                "application/json"

        },

        body: JSON.stringify(stagiaire)

    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Erreur serveur"
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(data);


            if (idModification === null) {

                alert(
                    "Stagiaire ajouté !"
                );

            } else {

                alert(
                    "Stagiaire modifié !"
                );

            }


            idModification = null;


            bouton.textContent = "Ajouter";


            viderFormulaire();


            chargerStagiaires();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Erreur lors de l'opération."
            );

        });

});



// =====================================
// VIDER LE FORMULAIRE
// =====================================

function viderFormulaire() {

    document.getElementById("nom").value = "";

    document.getElementById("note").value = "";

    document.getElementById("formation").value = "";

    document.getElementById("date_naissance").value = "";

}



// =====================================
// SUPPRIMER
// =====================================

function supprimerStagiaire(id) {


    const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce stagiaire ?"
    );


    if (!confirmation) {

        return;

    }


    fetch(
        `http://localhost:3000/stagiaires/${id}`,
        {
            method: "DELETE"
        }
    )

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Erreur suppression"
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(data);


            alert(
                "Stagiaire supprimé !"
            );


            chargerStagiaires();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Impossible de supprimer le stagiaire."
            );

        });

}



// =====================================
// RECHERCHE + FILTRE
// =====================================

const recherche =
    document.getElementById("recherche");


const filtreFormation =
    document.getElementById("filtreFormation");



function filtrerStagiaires() {


    const texte =
        recherche.value
            .toLowerCase()
            .trim();


    const formationChoisie =
        filtreFormation.value
            .toLowerCase()
            .trim();


    const lignes =
        document.querySelectorAll("#liste tr");


    lignes.forEach(ligne => {


        const nom =
            ligne.children[1]
                .textContent
                .toLowerCase()
                .trim();


        const formation =
            ligne.children[3]
                .textContent
                .toLowerCase()
                .trim();


        const nomCorrespond =
            nom.includes(texte);


        const formationCorrespond =
            formationChoisie === "" ||
            formation === formationChoisie;



        if (
            nomCorrespond &&
            formationCorrespond
        ) {

            ligne.style.display = "";

        } else {

            ligne.style.display = "none";

        }

    });

}



// Recherche en temps réel

recherche.addEventListener(
    "input",
    filtrerStagiaires
);



// Filtre formation

filtreFormation.addEventListener(
    "change",
    filtrerStagiaires
);



// =========================
// MODE CLAIR / MODE SOMBRE
// =========================

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️ Mode clair";
    } else {
        themeBtn.textContent = "🌙 Mode sombre";
    }

});



chargerStagiaires();