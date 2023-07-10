// ---------------------------------------- On récupère les éléments du document ----------------------------------------

let button = document.querySelector('#changer');

let champVille = document.querySelector('#ville');
let champTemperature = document.querySelector('#temperature_label');
let champRessenti = document.querySelector('#feel_like_label');
let champTMin = document.querySelector('#tmin_label');
let champTMax = document.querySelector('#tmax_label');
let champDescription = document.querySelector('#description_label');
let champVentVitesse = document.querySelector('#wind_speed_label');
let champVentDirection = document.querySelector('#wind_direction_label');
let champSoleilLever = document.querySelector('#sunrise_label');
let champSoleilCoucher = document.querySelector('#sunset_label');

// ----- On rentre la clé secrète -----
const apiKey = 'd07bab99a7e3721155f261b16d42ec45';

// ----- Option de géolocalisation -----
// Cas 1 : La géolocalisation est désactivée.
// ------- Dans ce cas, on va afficher Paris par défaut, et on peut changer à souhait.
// Cas 2 : La géolocalisation est activée.
// -------- Dans ce cas, on va afficher par défaut la localisation, et on peut changer à souhait.
// -------- Si on veut retrouver la localisation, il faut réactualiser la page.
let villeChoisie = null;

if ("geolocation" in navigator && villeChoisie === null) {
    navigator.geolocation.getCurrentPosition((position) => {

        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        villeChoisie = null;
        mettreAjour(villeChoisie, lat, long);
    },
        // Si la localisation n'est pas activée, c'est la fonction "erreur" qui sera activée.
        erreur,
        // On paramètre les options dans un objet littéral (en bas du code)
        options);
}

// ---------- Écouteur d'évènements en cas de clic sur le bouton ----------
button.addEventListener('click', () => {
    villeChoisie = prompt('Veuillez entrer un nom de ville');
    mettreAjour(villeChoisie);
});

// ------------------------------------------------- FONCTION PRINCIPALE ------------------------------------------------

function mettreAjour(ville, lat, long) {

    let url;
    // Si on fait une recherche par nom de ville, on va utiliser l'URL avec "q" en paramètre.
    if (ville != null) {
        // Si le nom de ville contient des espaces, on les remplaces par des tirets
        if (ville.includes(' ')) {
            let motsDuchampVille = ville.split(' ');

            let villeAvecTirets = motsDuchampVille[0];

            for (let index = 1; index < motsDuchampVille.length; index++) {
                villeAvecTirets += `-${motsDuchampVille[index]}`;
            }

            url = `https://api.openweathermap.org/data/2.5/weather?q=${villeAvecTirets}&appid=${apiKey}&units=metric&lang=fr`;
        }
        // Sinon, on rentre le nom de ville tel quel
        else {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apiKey}&units=metric&lang=fr`;
        }
    } else {
        // Sinon, c'est qu'on utilise lat et long, et dans ce cas, on va utiliser l'URL avec "lat" et "lon" en paramètres
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric&lang=fr`;
    }

    // Créer la requête
    let requete = new XMLHttpRequest();

    requete.open('GET', url);
    requete.responseType = 'json';
    requete.send();

    // Vérifier que la requête fonctionne
    requete.onload = function () {
        if (requete.readyState === XMLHttpRequest.DONE) {
            if (requete.status === 200) {
                let reponse = requete.response; // On stocke dans une variable le JSON
                console.log(reponse);

                // ----- On récupère les variables -----
                let temperature = reponse.main.temp;
                let feelLike = reponse.main.feels_like;
                let tMin = reponse.main.temp_min;
                let tMax = reponse.main.temp_max;
                let description = reponse.weather[0].description;
                let windSpeed = reponse.wind.speed;
                let windDirection = reponse.wind.deg;
                let sunrise = reponse.sys.sunrise;
                let sunset = reponse.sys.sunset;

                // ----- Rajouter les éléments dans le DOM -----
                champVille.innerHTML = reponse.name;
                champTemperature.innerHTML = temperature;
                champRessenti.innerHTML = feelLike;
                champTMin.innerHTML = tMin;
                champTMax.innerHTML = tMax;
                champDescription.innerHTML = description;
                champVentVitesse.innerHTML = windSpeed;
                champVentDirection.innerHTML = windDirection;
                champSoleilLever.innerHTML = convertir(sunrise);
                champSoleilCoucher.innerHTML = convertir(sunset);


            } else {
                alert(`Il y a eu un problème lors du chargement.`);
            }
        }
    }
}

// ----------------------------------- FONCTION POUR CONVERTIR LE TIMESTAMP EN HEURE -----------------------------------
function convertir(timestamp) {
    timestamp *= 1000; // L'API fournit un timestamp en secondes, il faut le convertir en ms
    timestamp = new Date(timestamp);
    timestamp = timestamp.toLocaleTimeString();

    return timestamp;
}

// ------------------------------ FONCTION D'APPEL DE LA MÉTÉO EN FONCTION DU NOM DE VILLE ----------------------------
function erreur() {
    villeChoisie = "Paris";
    let lat = null;
    let long = null;
    mettreAjour(villeChoisie, lat, long);
}

// ----------------------------------------- OPTIONS POUR L'APPEL DE LA MÉTÉO ------------------------------------------
var options = {
    enableHighAccuracy: true
}