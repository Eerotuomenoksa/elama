class Character {
    constructor() {
        this.age = 0;
        this.bioAge = 0;
        this.wellbeing = 70;
        this.money = 100;
        this.energy = 100;
        this.knowledge = 0;
        this.social = 50;
        this.health = 80;
        this.lifeStage = "Lapsuus";
        this.alive = true;
        this.achievements = [];
    }

    updateLifeStage() {
        if (this.age < 13) {
            this.lifeStage = "Lapsuus";
        } else if (this.age < 20) {
            this.lifeStage = "Nuoruus";
        } else if (this.age < 65) {
            this.lifeStage = "Aikuisuus";
        } else {
            this.lifeStage = "Vanhuus";
        }
    }

    ageCharacter() {
        this.age += 1;
        let agingRate = 1.0;

        if (this.health > 70) agingRate -= 0.2;
        if (this.wellbeing > 70) agingRate -= 0.15;
        if (this.knowledge > 50) agingRate -= 0.1;
        if (this.social > 60) agingRate -= 0.1;

        if (this.health < 40) agingRate += 0.3;
        if (this.wellbeing < 30) agingRate += 0.25;
        if (this.money < 20) agingRate += 0.2;

        this.bioAge += agingRate;
        this.updateLifeStage();

        if (this.age > 40) {
            this.health -= Math.random() * 1.5 + 0.5;
        }
        if (this.age > 60) {
            this.health -= Math.random() * 2 + 1;
        }

        if (this.bioAge >= 100 || this.health <= 0 || this.wellbeing <= 0) {
            this.alive = false;
        }
    }
}

class Game {
    constructor() {
        this.character = new Character();
        this.year = 0;
        this.actions = {
            "Terveystarkastus": { cost: 30, energy: -10, health: 15, wellbeing: 5, bioAge: -0.3 },
            "Liikunta": { cost: 0, energy: -20, health: 10, wellbeing: 8, bioAge: -0.4 },
            "Terveellinen ruokavalio": { cost: 15, energy: -5, health: 8, wellbeing: 5, bioAge: -0.2 },
            "Lääkkeet": { cost: 25, energy: -5, health: 12, wellbeing: 3, bioAge: -0.25 },
            "Meditaatio": { cost: 0, energy: -15, health: 5, wellbeing: 12, bioAge: -0.15 },
            "Opiskelu": { cost: 20, energy: -25, knowledge: 15, wellbeing: -5, bioAge: -0.1 },
            "Työ": { cost: 0, energy: -30, money: 50, wellbeing: -10, bioAge: 0.1 },
            "Loma": { cost: 40, energy: 20, wellbeing: 20, bioAge: -0.2 },
            "Ystävien tapaaminen": { cost: 10, energy: -15, social: 15, wellbeing: 12, bioAge: -0.15 },
            "Perheen kanssa": { cost: 5, energy: -10, social: 10, wellbeing: 15, bioAge: -0.2 },
            "Harrastukset": { cost: 15, energy: -20, wellbeing: 18, bioAge: -0.1 },
            "Lääketieteellinen tutkimus": { cost: 80, energy: -30, health: 20, bioAge: -0.8 },
            "Geeniterapia": { cost: 200, energy: -40, health: 30, bioAge: -1.5 },
            "Nuoruuden lähde": { cost: 500, energy: -20, health: 25, bioAge: -2.0, achievement: "Nuoruuden lähde löydetty!" },
            "Tupakointi": { cost: 5, energy: 5, health: -15, wellbeing: -5, bioAge: 0.5 },
            "Alkoholi": { cost: 10, energy: -5, health: -10, wellbeing: 5, bioAge: 0.3 },
            "Junk food": { cost: 5, energy: 5, health: -8, wellbeing: 8, bioAge: 0.2 }
        };
        this.log = [];
        this.selectedActions = [];
        this.init();
    }

    init() {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.setupEventListeners());
        } else {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        const startButton = document.getElementById("startButton");
        const nextYearButton = document.getElementById("nextYearButton");
        const restartButton = document.getElementById("restartButton");

        if (startButton) {
            startButton.addEventListener("click", () => this.startGame());
        } else {
            console.error("Aloita-painiketta ei löytynyt!");
        }

        if (nextYearButton) {
            nextYearButton.addEventListener("click", () => this.nextYear());
        } else {
            console.error("Seuraava vuosi -painiketta ei löytynyt!");
        }

        if (restartButton) {
            restartButton.addEventListener("click", () => this.restart());
        } else {
            console.error("Uudelleen-painiketta ei löytynyt!");
        }

        console.log("Tapahtumankuuntelijat asennettu onnistuneesti");
    }

    startGame() {
        console.log("Peli käynnistyy...");
        document.getElementById("instructions").classList.add("hidden");
        document.getElementById("gameArea").classList.remove("hidden");
        this.updateStatus();
        this.renderActions();
        this.addLogEntry("Peli alkaa! Tee valintoja elääksesi pitkään ja hyvin.");
    }

    updateStatus() {
        const statusInfo = document.getElementById("statusInfo");
        if (!statusInfo) {
            console.error("Tila-paneelia ei löytynyt!");
            return;
        }

        statusInfo.innerHTML = `
            <div class="statusItem"><strong>Vuosi:</strong> ${this.year}</div>
            <div class="statusItem"><strong>Elämänvaihe:</strong> ${this.character.lifeStage}</div>
            <div class="statusItem"><strong>Fyysinen ikä:</strong> ${this.character.age} vuotta</div>
            <div class="statusItem"><strong>Biologinen ikä:</strong> ${this.character.bioAge.toFixed(1)} vuotta</div>
            <div class="statusItem"><strong>Hyvinvointi:</strong> ${this.character.wellbeing.toFixed(1)}/100</div>
            <div class="statusItem"><strong>Terveys:</strong> ${this.character.health.toFixed(1)}/100</div>
            <div class="statusItem"><strong>Rahat:</strong> ${this.character.money} €</div>
            <div class="statusItem"><strong>Energia:</strong> ${this.character.energy.toFixed(1)}/100</div>
            <div class="statusItem"><strong>Tietämys:</strong> ${this.character.knowledge.toFixed(1)}</div>
            <div class="statusItem"><strong>Sosiaaliset siteet:</strong> ${this.character.social.toFixed(1)}</div>
        `;

        if (this.character.achievements.length > 0) {
            statusInfo.innerHTML += `<div class="statusItem achievement"><strong>Saavutukset:</strong> ${this.character.achievements.join(", ")}</div>`;
        }

        if (this.character.bioAge < this.character.age - 10) {
            this.addLogEntry("Huom! Biologinen ikäsi on paljon alhaisempi kuin fyysinen ikäsi - olet tehnyt hyviä valintoja!", "success");
        }
        if (this.character.wellbeing < 20) {
            this.addLogEntry("Varoitus! Hyvinvointisi on erittäin alhainen - tee jotain parantaaksesi elämänlaatuasi!", "warning");
        }
        if (this.character.health < 30) {
            this.addLogEntry("Varoitus! Terveytesi on heikko - hakeudu hoitoon!", "warning");
        }
    }

    renderActions() {
        const actionsList = document.getElementById("actionsList");
        if (!actionsList) {
            console.error("Toimintalistaa ei löytynyt!");
            return;
        }

        actionsList.innerHTML = "";

        for (const [action, details] of Object.entries(this.actions)) {
            const button = document.createElement("button");
            button.className = "actionButton";
            button.textContent = `${action} (${details.cost}€, ${details.energy} energiaa)`;
            button.disabled = this.character.money < details.cost || this.character.energy < Math.abs(details.energy);
            button.addEventListener("click", () => this.toggleAction(action));
            actionsList.appendChild(button);
        }
    }

    toggleAction(actionName) {
        const index = this.selectedActions.indexOf(actionName);
        if (index > -1) {
            this.selectedActions.splice(index, 1);
        } else {
            this.selectedActions.push(actionName);
        }
        
        const buttons = document.querySelectorAll(".actionButton");
        buttons.forEach(button => {
            if (button.textContent.startsWith(actionName)) {
                button.style.backgroundColor = this.selectedActions.includes(actionName) ? "#28a745" : "";
            }
        });
    }

    randomEvent() {
        const events = [
            { name: "Sairastuminen", health: -15, wellbeing: -10, bioAge: 0.2 },
            { name: "Onnettomuus", health: -20, wellbeing: -15, money: -30 },
            { name: "Perintö", money: 100, wellbeing: 10 },
            { name: "Uusi ystävä", social: 20, wellbeing: 15 },
            { name: "Työtarjous", money: 80, energy: -20 },
            { name: "Läheisen kuolema", social: -25, wellbeing: -20, bioAge: 0.3 },
            { name: "Löytöretki", money: 50, knowledge: 10 },
            { name: "Taidekilpailuvoitto", wellbeing: 25, money: 30 }
        ];

        if (Math.random() < 0.3) {
            const event = events[Math.floor(Math.random() * events.length)];
            this.addLogEntry(`SATUNNAINEN TAPAHTUMA: ${event.name}`);

            for (const [key, value] of Object.entries(event)) {
                if (key !== "name" && this.character.hasOwnProperty(key)) {
                    this.character[key] += value;
                }
            }
        }
    }

    nextYear() {
        for (const actionName of this.selectedActions) {
            const action = this.actions[actionName];
            this.character.money -= action.cost || 0;
            this.character.energy += action.energy || 0;
            this.character.health += action.health || 0;
            this.character.wellbeing += action.wellbeing || 0;
            this.character.knowledge += action.knowledge || 0;
            this.character.social += action.social || 0;
            this.character.bioAge += action.bioAge || 0;

            if (action.achievement) {
                this.character.achievements.push(action.achievement);
                this.addLogEntry(`Saavutus: ${action.achievement}`, "success");
            }

            this.addLogEntry(`Suoritit: ${actionName}`);
        }
        
        this.selectedActions = [];

        this.randomEvent();
        this.character.ageCharacter();
        this.year += 1;
        this.character.energy = Math.min(100, this.character.energy + 30);

        this.character.wellbeing = Math.max(0, Math.min(100, this.character.wellbeing));
        this.character.health = Math.max(0, Math.min(100, this.character.health));
        this.character.energy = Math.max(0, Math.min(100, this.character.energy));
        this.character.social = Math.max(0, Math.min(100, this.character.social));
        this.character.knowledge = Math.max(0, this.character.knowledge);

        this.updateStatus();
        this.renderActions();

        if (!this.character.alive) {
            this.gameOver();
        }
    }

    addLogEntry(message, type = "") {
        const logContent = document.getElementById("logContent");
        if (!logContent) {
            console.error("Lokia ei löytynyt!");
            return;
        }

        const entry = document.createElement("div");
        entry.className = "logEntry";
        if (type) {
            entry.classList.add(type);
        }
        entry.textContent = `[Vuosi ${this.year}] ${message}`;
        logContent.appendChild(entry);
        logContent.scrollTop = logContent.scrollHeight;
    }

    gameOver() {
        document.getElementById("gameArea").classList.add("hidden");
        document.getElementById("gameOverScreen").classList.remove("hidden");

        let message = "";
        if (this.character.age > 90) {
            message = "Loistava suoritus! Elit pitkän ja täyden elämän!";
        } else if (this.character.age > 70) {
            message = "Hyvä suoritus! Saavutit korkean iän!";
        } else if (this.character.age > 50) {
            message = "Kohtalainen suoritus. Voit yrittää uudelleen tehdäksesi parempia valintoja!";
        } else {
            message = "Elämäsi oli lyhyt. Seuraavalla kerralla tee terveellisempiä valintoja!";
        }

        document.getElementById("finalStats").innerHTML = `
            <p><strong>Kuolit ${this.character.age} vuotiaana</strong> (biologinen ikä ${this.character.bioAge.toFixed(1)} vuotta)</p>
            <p>Elit ${this.year} vuotta</p>
            <p>Loppu hyvinvointi: ${this.character.wellbeing.toFixed(1)}/100</p>
            <p>Loppu terveys: ${this.character.health.toFixed(1)}/100</p>
            ${this.character.achievements.length > 0 ? `<p><strong>Saavutukset:</strong> ${this.character.achievements.join(", ")}</p>` : ""}
            <p class="success">${message}</p>
        `;
    }

    restart() {
        document.getElementById("gameOverScreen").classList.add("hidden");
        document.getElementById("instructions").classList.remove("hidden");
        document.getElementById("logContent").innerHTML = "";
        this.character = new Character();
        this.year = 0;
        this.log = [];
        this.selectedActions = [];
    }
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("Sivu latautui, käynnistetään peli...");
    new Game();
});