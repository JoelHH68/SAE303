

// Carte du monde


const CouleurPays = (rate) => {
    if (rate > 35) return '#800026';
    if (rate > 25) return '#BD0026';
    if (rate > 15) return '#FD8D3C';
    return '#FED976';
};

const Carte = async () => {
    const response = await fetch('../Data/donnees.json');
    const obesityData = await response.json();

    Object.entries(obesityData).forEach(([nomPays, stats]) => {
        

        const donneeValide = stats.find(annee => annee.AllAdults_Obesity !== null);


        if (donneeValide) {
            const rate = donneeValide.AllAdults_Obesity;

            const selector = `path[name="${nomPays}"], path[id="${nomPays}"], path[class="${nomPays}"]`;
            const targets = document.querySelectorAll(selector);

            targets.forEach(path => {
                path.style.fill = CouleurPays(rate);
            });
        }
    });
};

document.addEventListener('DOMContentLoaded', Carte);





// Bouteilles


let data = [];
const chart = document.getElementById("chart");
const select = document.getElementById("choixPays");

async function chargerData() {
    const response = await fetch("../Data/child-adolescent-obesity.json");
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
        <div class="percentage-label">${value}%</div>
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