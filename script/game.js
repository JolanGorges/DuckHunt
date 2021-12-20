// vitesse de déplacement du canard
const speed = 10;

// intervalle en ms utilisé avec setInterval() pour le déplacement du canard
const interval = 20;

// élément HTML affichant le canard
const duckEl = document.getElementById('duck');

// élément HTML de la zone de déplacement du canard
const movementAreaEl = document.getElementById('movement_area');

// élément HTML affichant les points du chasseur
const hunterPointsEl = document.getElementById('hunter');

// élément HTML affichant le résultat en fin de partie
const resultEl = document.getElementById('result');

// objet contenant les directions dans lesquelles le canard peut se déplacer
const directions = {
    Up: false,
    Down: false,
    Left: false,
    Right: false,
};

// position x et y du canard
let x, y;

// état de la partie (devient true quand elle est terminée)
let gameOver = false;

// points du chasseur
let hunterPoints = 0;

// compte à rebours utilisé avec setInterval()
let countdownTimer = 0;

/**
 * Démarre une nouvelle partie
 */
function newGame() {
    // élément HTML affichant les points du canard
    const duckPointsEl = document.getElementById('duck_points');

    // élément HTML affichant le compte à rebours
    const countdownTimerEl = document.getElementById('countdown_timer');

    // enlève le résultat de la partie
    resultEl.style.display = 'none';

    // 2 minutes
    let timeLeft = 120;

    // points du canard
    let duckPoints = 0;

    // points du chasseur
    hunterPoints = 0;

    // gameOver est à true si la partie est terminée donc on remet à false pour être sûr
    gameOver = false;

    // redémarre l'animation du canard si elle a été arrêtée
    duckEl.style.animationPlayState = 'running';

    // reset le compte à rebours, les points du canard et les points du chasseur à l'écran
    countdownTimerEl.innerText = '2:00';
    duckPointsEl.innerText = duckPoints;
    hunterPointsEl.innerText = '0';

    // position aléatoire du canard dans la zone de déplacement
    x = Math.floor(Math.random() * (movementAreaEl.offsetWidth - duckEl.offsetWidth + 1));
    y = Math.floor(Math.random() * (movementAreaEl.offsetHeight - duckEl.offsetHeight + 1));
    duckEl.style.left = x + 'px';
    duckEl.style.top = y + 'px';

    // symétrie verticale aléatoire du canard
    duckEl.style.transform = 'scaleX(' + (Math.round(Math.random()) * 2 - 1) + ')';

    // si countdownTimer a déjà été utilisée avec setInterval() on l'arrête avec clearInterval() (se produit seulement si on clique sur nouvelle partie avant que la partie soit terminée)
    if (countdownTimer !== 0) {
        // arrête countdownTimer
        clearInterval(countdownTimer);
        countdownTimer = 0;
    }
    countdownTimer = setInterval(() => {
        // décrémente timeLeft et vérifie si c'est supérieur à 0 sinon on arrête la partie
        if (--timeLeft > 0) {
            // si c'est un multiple de 10 on augmente les points du canard
            if (timeLeft % 10 === 0) {
                duckPoints += 10;
                duckPointsEl.innerText = duckPoints;
            }

            // récupère les minutes et les secondes de timeLeft et met à jour le compte à rebours à l'écran
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft - minutes * 60;
            countdownTimerEl.innerText = minutes + ':' + String(seconds).padStart(2, '0');
        } else {
            // arrête countdownTimer
            clearInterval(countdownTimer);
            countdownTimer = 0;

            // arrête la partie
            gameOver = true;

            // arrête l'animation du canard
            duckEl.style.animationPlayState = 'paused';

            // le canard ne doit plus pouvoir se déplacer donc on met toutes les directions à false
            resetDirections();

            // met le compte à rebours à 0
            countdownTimerEl.innerText = '0:00';

            // affiche le résultat à l'écran
            if (duckPoints > hunterPoints) resultEl.innerText = 'LE CANARD A GAGNÉ';
            else if (duckPoints < hunterPoints) resultEl.innerText = 'LE CHASSEUR A GAGNÉ';
            else resultEl.innerText = 'ÉGALITÉ';
            resultEl.style.display = 'inline';
        }
    }, 1000);
}

// détecte un clic sur le canard (mousedown est utilisé à la place de click car click attend qu'on relâche le bouton et le canard va trop vite pour ça)
duckEl.addEventListener('mousedown', (e) => {
    // si la partie n'est pas terminée et que c'est un clic gauche on augmente les points du chasseur
    if (!gameOver && e.button === 0) hunterPointsEl.innerText = String(++hunterPoints);

    // désactive le glisser-déposer de l'image
    e.preventDefault();
});

// démarre une nouvelle partie dès que la page est chargée
newGame();

/**
 * Reset les directions pour que le canard arrête de se déplacer
 */
function resetDirections() {
    directions.Up = false;
    directions.Down = false;
    directions.Left = false;
    directions.Right = false;
}

/**
 * l'événement blur se procure quand le focus clavier est supprimé
 * si on clique ailleurs que sur la page le canard continue à se déplacer tout seul même si on relâche les touches de déplacement
 * donc on détecte si l'événement se procure et on arrête le déplacement du canard
 */
window.addEventListener('blur', () => {
    resetDirections();
});

// supprime le menu contextuel si on fait un clic droit pour éviter de perdre le focus clavier
window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// détecte un clic sur le bouton nouvelle partie et démarre une nouvelle partie
document.getElementById('new_game').addEventListener('click', () => {
    newGame();
});

/**
 * Met à jour les directions dans lesquelles le canard peut se déplacer
 * @param {String} key touche pressée
 * @param {Boolean} enabled activer ou non la direction
 */
function updateDirections(key, enabled) {
    // si la partie est terminée on ignore
    if (gameOver) return;

    if (key.toLowerCase() === 'z' || key === 'ArrowUp') directions.Up = enabled;
    else if (key.toLowerCase() === 's' || key === 'ArrowDown') directions.Down = enabled;

    if (key.toLowerCase() === 'q' || key === 'ArrowLeft') directions.Left = enabled;
    else if (key.toLowerCase() === 'd' || key === 'ArrowRight') directions.Right = enabled;
}

// met à jour les directions dans lesquelles le canard peut se déplacer si on presse une touche
document.addEventListener('keydown', (e) => {
    updateDirections(e.key, true);
});

// met à jour les directions dans lesquelles le canard peut se déplacer si on relâche une touche
document.addEventListener('keyup', (e) => {
    updateDirections(e.key, false);
});

// démarre l'appel des fonctions de déplacement du canard quand on appuie sur une touche pour se déplacer
setInterval(() => {
    if (directions.Up) moveUp();
    else if (directions.Down) moveDown();

    if (directions.Left) moveLeft();
    else if (directions.Right) moveRight();
}, interval);

// corrige la position du canard pour qu'il reste dans la zone de déplacement en cas de redimensionnement de la page
window.addEventListener('resize', () => {
    // corrige la position x si elle est supérieure à la largeur de la zone de déplacement
    if (x + speed > movementAreaEl.offsetWidth - duckEl.offsetWidth) {
        // si la largeur de la zone de déplacement est inférieure à la largeur du canard on met x à 0 pour éviter un nombre négatif
        if (movementAreaEl.offsetWidth - duckEl.offsetWidth < 0) x = 0;
        else x = movementAreaEl.offsetWidth - duckEl.offsetWidth;
        duckEl.style.left = x + 'px';
    }
    // corrige la position y si elle est supérieure à la largeur de la zone de déplacement
    if (y + speed > movementAreaEl.offsetHeight - duckEl.offsetHeight) {
        // si la hauteur de la zone de déplacement est inférieure à la hauteur du canard on met y à 0 pour éviter un nombre négatif
        if (movementAreaEl.offsetHeight - duckEl.offsetHeight < 0) y = 0;
        else y = movementAreaEl.offsetHeight - duckEl.offsetHeight;
        duckEl.style.top = y + 'px';
    }
});

/**
 * Déplace le canard vers le haut
 */
function moveUp() {
    // déplace vers le haut seulement si la position y est supérieure à 0 et si aucune touche de direction pour aller vers le bas est pressée
    if (y > 0 && !directions.Down) {
        // si la position y - le nombre de pixels du déplacement est inférieure 0 alors on définit la position y à 0
        if (y - speed < 0) y = 0;
        // sinon on change normalement la position y du canard
        else y -= speed;
        duckEl.style.top = y + 'px';
    }
}

/**
 * Déplace le canard vers le bas
 */
function moveDown() {
    // déplace vers le bas seulement si la position y est inférieure à la hauteur de la zone de déplacement - la hauteur du canard et si aucune touche de direction pour aller vers le haut est pressée
    if (y < movementAreaEl.offsetHeight - duckEl.offsetHeight && !directions.Up) {
        // si la position y + le nombre de pixels du déplacement est supérieure à la hauteur de la zone de déplacement - la hauteur du canard alors on définit la position y à la hauteur de la zone de déplacement - la hauteur du canard
        if (y + speed > movementAreaEl.offsetHeight - duckEl.offsetHeight) duckEl.style.top = String(movementAreaEl.offsetHeight - duckEl.offsetHeight);
        // sinon on change normalement la position y du canard
        else y += speed;
        duckEl.style.top = y + 'px';
    }
}

/**
 * Déplace le canard vers la gauche
 */
function moveLeft() {
    // déplace vers la gauche seulement si la position x est supérieure à 0 et si aucune touche de direction pour aller vers la droite est pressée
    if (x > 0 && !directions.Right) {
        // si la position x - le nombre de pixels du déplacement est inférieure 0 alors on définit la position x à 0
        if (x - speed < 0) x = 0;
        // sinon on change normalement la position x du canard
        else x -= speed;
        duckEl.style.left = x + 'px';
        // symétrie verticale pour que la tête du canard soit vers la gauche
        duckEl.style.transform = 'scaleX(-1)';
    }
}

/**
 * Déplace le canard vers la droite
 */
function moveRight() {
    // déplace vers la droite seulement si la position x est inférieure à la largeur de la zone de déplacement - la largeur du canard et si aucune touche de direction pour aller vers le gauche est pressée
    if (x < movementAreaEl.offsetWidth - duckEl.offsetWidth && !directions.Left) {
        // si la position x + le nombre de pixels du déplacement est supérieure à la largeur de la zone de déplacement - la largeur du canard alors on définit la position x à la largeur de la zone de déplacement - la largeur du canard
        if (x + speed > movementAreaEl.offsetWidth - duckEl.offsetWidth) x = movementAreaEl.offsetWidth - duckEl.offsetWidth;
        // sinon on change normalement la position x du canard
        else x += speed;
        duckEl.style.left = x + 'px';
        // symétrie verticale pour que la tête du canard soit vers la droite
        duckEl.style.transform = 'scaleX(1)';
    }
}
