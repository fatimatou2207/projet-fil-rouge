const bouton = document.getElementById("ajouter");

let idModification = null;


// ===============================
// CHARGER LES STAGIAIRES
// ===============================

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
                    <td>${stagiaire.date_naissance}</td>
                    <td></td>
                `;


                // Modifier
                const boutonModifier = document.createElement("button");

                boutonModifier.textContent = "Modifier";

                boutonModifier.onclick = () => {

                    document.getElementById("nom").value = stagiaire.nom;
                    document.getElementById("note").value = stagiaire.note;
                    document.getElementById("formation").value = stagiaire.formation;
                    document.getElementById("date_naissance").value = stagiaire.date_naissance;

                    idModification = stagiaire.id;

                    bouton.textContent = "Modifier";
                };


                // Supprimer
                const boutonSupprimer = document.createElement("button");

                boutonSupprimer.textContent = "Supprimer";

                boutonSupprimer.onclick = () => {

                    supprimerStagiaire(stagiaire.id);

                };


                ligne.children[5].appendChild(boutonModifier);
                ligne.children[5].appendChild(boutonSupprimer);

                liste.appendChild(ligne);

            });

        })

        .catch(error => {

            console.error(error);

            alert("Impossible de charger les stagiaires.");

        });

}



// ===============================
// AJOUTER / MODIFIER
// ===============================

bouton.addEventListener("click", () => {

    const nom = document.getElementById("nom").value.trim();
    const note = document.getElementById("note").value;
    const formation = document.getElementById("formation").value.trim();
    const date_naissance = document.getElementById("date_naissance").value;


    // Vérification des champs
    if (nom === "") {

        alert("Veuillez entrer un nom.");

        return;
    }


    if (note === "") {

        alert("Veuillez entrer une note.");

        return;
    }


    if (note < 0 || note > 20) {

        alert("La note doit être comprise entre 0 et 20.");

        return;
    }


    if (formation === "") {

        alert("Veuillez entrer une formation.");

        return;
    }


    if (date_naissance === "") {

        alert("Veuillez entrer une date de naissance.");

        return;
    }


    const stagiaire = {

        nom: nom,
        note: note,
        formation: formation,
        date_naissance: date_naissance

    };


    let url = "http://localhost:3000/stagiaires";
    let methode = "POST";


    if (idModification !== null) {

        url = `http://localhost:3000/stagiaires/${idModification}`;

        methode = "PUT";

    }


    fetch(url, {

        method: methode,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(stagiaire)

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Erreur serveur");

            }

            return response.json();

        })

        .then(data => {

            console.log(data);

            alert(
                idModification === null
                    ? "Stagiaire ajouté !"
                    : "Stagiaire modifié !"
            );


            idModification = null;

            bouton.textContent = "Ajouter";


            document.getElementById("nom").value = "";
            document.getElementById("note").value = "";
            document.getElementById("formation").value = "";
            document.getElementById("date_naissance").value = "";


            chargerStagiaires();

        })

        .catch(error => {

            console.error(error);

            alert("Erreur lors de l'opération.");

        });

});



// ===============================
// SUPPRIMER
// ===============================

function supprimerStagiaire(id) {

    if (!confirm("Voulez-vous vraiment supprimer ce stagiaire ?")) {

        return;

    }


    fetch(`http://localhost:3000/stagiaires/${id}`, {

        method: "DELETE"

    })

        .then(response => {

            if (!response.ok) {

                throw new Error("Erreur suppression");

            }

            return response.json();

        })

        .then(data => {

            console.log(data);

            alert("Stagiaire supprimé !");

            chargerStagiaires();

        })

        .catch(error => {

            console.error(error);

            alert("Impossible de supprimer le stagiaire.");

        });

}



// ===============================
// CHARGEMENT INITIAL
// ===============================

chargerStagiaires();