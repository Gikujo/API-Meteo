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

// ----- Affichage de la ville par déafut -----
let villeChoisie = 'Aix en Provence';
mettreAjour(villeChoisie);

// ---------- Écouteur d'évènements ----------
button.addEventListener('click', () => {
    villeChoisie = prompt('Veuillez entrer un nom de ville');
    mettreAjour(villeChoisie);
});

// ------------------------------------------------- FONCTION PRINCIPALE ------------------------------------------------

function mettreAjour(ville) {

    let url;

    // Si le nom de ville contient des espaces, on les remplaces par des tirets
    if (ville.includes(' ')) {
        let motsDuchampVille = ville.split(' ');
        console.log(motsDuchampVille);

        let villeAvecTirets = motsDuchampVille[0];

        for (let index = 1; index < motsDuchampVille.length; index++) {
            villeAvecTirets += `-${motsDuchampVille[index]}`;
        }

        console.log(villeAvecTirets);

        url = `https://api.openweathermap.org/data/2.5/weather?q=${villeAvecTirets}&appid=${apiKey}&units=metric&lang=fr`;
    }
    // Sinon, on rentre le nom de ville tel que
    else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${apiKey}&units=metric&lang=fr`;
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
                champVille.innerHTML = ville;
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