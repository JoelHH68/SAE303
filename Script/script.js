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
            if (targets.length === 0) console.warn("Pas trouvé dans le SVG :", nomPays);

            targets.forEach(path => {
                path.style.fill = CouleurPays(rate);
            });
        }
    });
};

document.addEventListener('DOMContentLoaded', Carte);