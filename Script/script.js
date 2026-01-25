// Page de chargement

const startTime = Date.now();
    const minTime = 3000; // 3 secondes minimum

    window.addEventListener("load", () => {
      const loader = document.getElementById("loader");
      const content = document.querySelectorAll("body > *:not(#loader)");

      const elapsed = Date.now() - startTime;
      const remaining = minTime - elapsed;

      setTimeout(() => {
        loader.style.display = "none";
        content.forEach(el => {
          el.style.display = "block";
          setTimeout(() => {
            el.style.opacity = "1";
          }, 50); // petit delay pour fade
        });
      }, Math.max(0, remaining));
    });




// Burger Menu pour header 

const burger = document.querySelector(".menu-burger");

    burger.addEventListener("click", () => {
        burger.classList.toggle("open");
    });



// Carte du monde

const CouleurPays = (rate) => {
    if (rate > 35) return '#800026';
    if (rate > 25) return '#BD0026';
    if (rate > 15) return '#FD8D3C';
    return '#FED976';
};

const Carte = async () => {
    const response = await fetch('Data/donnees.json');
    const obesityData = await response.json();
    const tooltip = document.getElementById('tooltip');

    Object.entries(obesityData).forEach(([nomPays, stats]) => {

        const donneeValide = stats.find(
            annee => annee.AllAdults_Obesity !== null
        );

        if (!donneeValide) return;

        const rate = donneeValide.AllAdults_Obesity;

        const selector = `path[name="${nomPays}"], path[id="${nomPays}"], path[class="${nomPays}"]`;
        const targets = document.querySelectorAll(selector);

        targets.forEach(path => {
            path.style.fill = CouleurPays(rate);

            /* SURVOL */
            path.addEventListener('mouseenter', () => {
                tooltip.innerHTML = `
                    <strong>${nomPays}</strong><br>
                    ${rate} % d’obésité
                `;
                tooltip.classList.add('visible');
            });

            path.addEventListener('mousemove', (e) => {
                tooltip.style.left = e.offsetX + 15 + 'px';
                tooltip.style.top = e.offsetY + 15 + 'px';
            });

            path.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });
        });
    });
};

document.addEventListener('DOMContentLoaded', Carte);





// Bouteilles


let data = [];
const chart = document.getElementById("chart");
const select = document.getElementById("choixPays");

async function chargerData() {
    const response = await fetch("Data/child-adolescent-obesity.json");
    data = await response.json();
    initialisationPays();
}

function initialisationPays() {
    const liste_pays = [...new Set(data.map(item => item.Entity))].sort();

    liste_pays.forEach(pays => {
        select.add(new Option(pays, pays));
    });

    select.addEventListener("change", () => {
        majBouteille(select.value);
    });

    majBouteille(liste_pays[0]);
}


function creationBouteille(year, value) {
    const bottle = document.createElement("div");
    bottle.className = "bloc_bouteille";

    bottle.innerHTML = `
        <div class="pourcentage-label">${value}%</div>
        <div class="container_bouteille">
            <div class="liquide"></div>
        </div>
        <div class="year-label">${year}</div>
    `;

    const liquide = bottle.querySelector(".liquide");

    setTimeout(() => {
        liquide.style.height = value + "%";
    }, 100);

    return bottle;
}


function majBouteille(pays) {
    chart.innerHTML = "";

    const filtreData = data.filter(
        item => item.Entity === pays && item.Year % 5 === 0
    );

    filtreData.forEach(item => {
        const value = Math.round(item.pourc);
        const bottle = creationBouteille(item.Year, value);
        chart.appendChild(bottle);
    });
}

chargerData();



// BURGER

let donneesBurger = {};

async function chargerDonneesBurger() {
    const response = await fetch("Data/donnees.json");
    donneesBurger = await response.json();

    initialiserPaysBurger();
}

function initialiserPaysBurger() {
    const select = document.getElementById("choixPaysBurger");

    const pays = Object.keys(donneesBurger).sort();

    pays.forEach(nomPays => {
        select.add(new Option(nomPays, nomPays));
    });

    select.addEventListener("change", () => {
        majBurger(select.value);
    });

    // premier affichage
    majBurger(pays[0]);
}

function calculerNbSteaks(pourcentage) {
    if (pourcentage < 5) return 1;
    if (pourcentage < 10) return 2;
    if (pourcentage < 15) return 3;
    if (pourcentage < 20) return 4;
    if (pourcentage < 25) return 5;
    if (pourcentage < 30) return 6;
    return 7;
}

function afficherBurgerHommes(pourcentageHommes) {
    const container = document.querySelector(".steaks-container-h");
    container.innerHTML = "";

    const nbSteaks = calculerNbSteaks(pourcentageHommes);

    for (let i = 0; i < nbSteaks; i++) {
        const steak = document.createElement("div");
        steak.className = "steak";
        container.appendChild(steak);
    }
}


function afficherBurgerFemmes(pourcentageFemmes) {
    const container = document.querySelector(".steaks-container-f");
    container.innerHTML = "";

    const nbSteaks = calculerNbSteaks(pourcentageFemmes);

    for (let i = 0; i < nbSteaks; i++) {
        const steak = document.createElement("div");
        steak.className = "steak";
        container.appendChild(steak);
    }
}


function majBurger(pays) {
    const dataPays = donneesBurger[pays];
    if (!dataPays || dataPays.length === 0) return;

    const d = dataPays[dataPays.length - 1];

    const pourcentageHommes = Number(d.Males_Obesity ?? 0);
    const pourcentageFemmes = Number(d.Females_Obesity ?? 0);

    afficherBurgerHommes(pourcentageHommes);
    afficherBurgerFemmes(pourcentageFemmes);
}

chargerDonneesBurger();
