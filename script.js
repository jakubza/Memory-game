const get = id => document.getElementById(id);
const main = get("main"), slider = get("difficulty"), labels = get("labels"), startBtn = get("START_b");

const items = [
    "arrow","boat","bookshelf","bow","bread","cake","carrot","compass","creeperhead",
    "diamond","diamondpickaxe","diamondshovel","diamondsword","emerald","emptybottle",
    "endermite","enderpearl","enchantedbook","enchanttable","flintandsteel","gold",
    "goldenapple","goldpickaxe","grass","gunpowder","halfheart","heart","charcoal",
    "ironore","ironpickaxe","ironsword","lavabucket","leaves","minidog","netherite",
    "ocelot","potion","redapple","redflower","silverfish","spawner","stonebrick",
    "stonepickaxe","sugarcane","wheat","wither","witherstar","xp","bedrock","bakedpotato"
];

["mousedown", "touchstart"].forEach(e => slider.addEventListener(e, () => labels.classList.add("show")));
["mouseup", "touchend"].forEach(e => slider.addEventListener(e, () => labels.classList.remove("show")));

let state = { first: null, lock: false, scores: [0, 0], turn: 0, size: 0, matched: 0 };

startBtn.onclick = () => {
    state.size = parseInt(slider.value);
    [startBtn, main.querySelector("h1"), main.querySelector(".slider-container")].forEach(el => el.style.display = "none");
    initGame();
};

function initGame() {
    state = { first: null, lock: false, scores: [0, 0], turn: 0, size: state.size, matched: 0 };
    const total = state.size * state.size;
    get("game-area")?.remove();

    const pairs = Array.from({ length: Math.floor(total / 2) }, (_, i) => items[i % items.length]).flatMap(i => [i, i]);
    if (total % 2 !== 0) pairs.push(items[Math.floor(Math.random() * items.length)]);
    pairs.sort(() => Math.random() - 0.5);

    const gameArea = document.createElement("div");
    gameArea.id = "game-area";
    gameArea.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; max-width:800px; margin:20px auto; font-family: sans-serif;">
            <div style="display:flex; justify-content:space-between; width:100%; font-size:30px; font-weight:bold;">
                <div id="p0" style="color:#FF4500">Player 1: 0</div>
                <div id="p1" style="color:#1E90FF">Player 2: 0</div>
            </div>
            <div id="win-msg" style="margin-top:10px; font-size:28px; font-weight:bold; color:white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);"></div>
        </div>
        <div id="grid" style="grid-template-columns:repeat(${state.size}, 1fr);"></div>
    `;
    main.appendChild(gameArea);

    pairs.forEach(val => {
        const card = document.createElement("div");
        card.className = "card";
        card.dataset.val = val;
        card.onclick = () => flipCard(card);
        get("grid").appendChild(card);
    });
}

function flipCard(card) {
    if (state.lock || card === state.first || card.classList.contains("matched")) return;

    const colors = ["#FF6347", "#00BFFF"]; 
    const activeColors = ["#B22222", "#0000CD"];   
    
    card.innerHTML = `<img src="${card.dataset.val}.png">`;
    card.style.backgroundColor = colors[state.turn];

    if (!state.first) return (state.first = card);

    state.lock = true;
    setTimeout(() => {
        if (state.first.dataset.val === card.dataset.val) {
            [state.first, card].forEach(c => {
                c.style.backgroundColor = activeColors[state.turn];
                c.classList.add("matched");
            });
            state.scores[state.turn]++;
            get(`p${state.turn}`).textContent = `Player ${state.turn + 1}: ${state.scores[state.turn]}`;
            state.matched += 2;
            
            if (state.matched >= state.size * state.size - (state.size % 2)) {
                const [s1, s2] = state.scores;
                get("win-msg").textContent = s1 > s2 ? "Player 1 Wins!" : s2 > s1 ? "Player 2 Wins!" : "It's a Tie!";
            }
        } else {
            [state.first, card].forEach(c => {
                c.innerHTML = "";
                c.style.backgroundColor = "#8B4513";
            });
            state.turn = 1 - state.turn;
        }
        state.first = null;
        state.lock = false;
    }, 1000);
}
