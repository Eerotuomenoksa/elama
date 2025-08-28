class Character {
    constructor() {
        this.age = 0;
        this.bioAge = 0;
        this.wellbeing = 70;
        this.money = 200; // Lisätty lähtösaldo
        this.energy = 100;
        this.knowledge = 0;
        this.social = 50;
        this.health = 80;
        this.lifeStage = "Lapsuus";
        this.alive = true;
        this.achievements = [];
        this.characterName = "Hahmo";
        this.previousLifeStage = "";
    }

    isUnder18() {
        return this.age < 18;
    }

    updateLifeStage() {
        this.previousLifeStage = this.lifeStage;
        
        if (this.age < 13) {
            this.lifeStage = "Lapsuus";
            this.characterName = "Lapsi";
        } else if (this.age < 20) {
            this.lifeStage = "Nuoruus";
            this.characterName = "Nuori";
        } else if (this.age < 65) {
            this.lifeStage = "Aikuisuus";
            this.characterName = "Aikuinen";
        } else {
            this.lifeStage = "Vanhuus";
            this.characterName = "Vanhus";
        }
        
        this.updateCharacterDisplay();
    }

    updateCharacterDisplay() {
        const characterContainer = document.getElementById("characterContainer");
        const characterInfo = document.getElementById("characterInfo");
        
        if (characterContainer) {
            // Poista kaikki elämänvaihe-luokat
            characterContainer.classList.remove("child", "teenager", "adult", "elderly");
            
            // Lisää oikea elämänvaihe-luokka
            if (this.age < 13) {
                characterContainer.classList.add("child");
            } else if (this.age < 20) {
                characterContainer.classList.add("teenager");
            } else if (this.age < 65) {
                characterContainer.classList.add("adult");
            } else {
                characterContainer.classList.add("elderly");
            }
        }
        
        if (characterInfo) {
            characterInfo.innerHTML = `
                <div>${this.characterName} - ${this.lifeStage}</div>
                <div>Fyysinen ikä: ${this.age} vuotta</div>
                <div>Biologinen ikä: ${this.bioAge.toFixed(1)} vuotta</div>
            `;
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
        this.selectedActions = {};
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

    getActions() {
        const baseActions = {
            "Terveystarkastus": { 
                cost: 30, energy: -10, health: 15, wellbeing: 5, bioAge: -0.3,
                animation: "medical", effects: "Terveys +15, Hyvinvointi +5"
            },
            "Liikunta": { 
                cost: 0, energy: -20, health: 10, wellbeing: 8, bioAge: -0.4,
                animation: "exercise", effects: "Terveys +10, Hyvinvointi +8"
            },
            "Terveellinen ruokavalio": { 
                cost: this.character.isUnder18() ? 0 : 15, energy: -5, health: 8, wellbeing: 5, bioAge: -0.2,
                animation: "eat", effects: "Terveys +8, Hyvinvointi +5"
            },
            "Lääkkeet": { 
                cost: 25, energy: -5, health: 12, wellbeing: 3, bioAge: -0.25,
                animation: "medical", effects: "Terveys +12, Hyvinvointi +3"
            },
            "Meditaatio": { 
                cost: 0, energy: -15, health: 5, wellbeing: 12, bioAge: -0.15,
                animation: "rest", effects: "Terveys +5, Hyvinvointi +12"
            },
            "Opiskelu": { 
                cost: this.character.isUnder18() ? 0 : 20, energy: -25, knowledge: 15, wellbeing: -5, bioAge: -0.1,
                animation: "study", effects: "Tietämys +15, Hyvinvointi -5"
            },
            "Työ": { 
                cost: 0, energy: -30, money: 50, wellbeing: -10, bioAge: 0.1,
                animation: "work", effects: "Raha +50, Hyvinvointi -10"
            },
            "Loma": { 
                cost: 40, energy: 20, wellbeing: 20, bioAge: -0.2,
                animation: "rest", effects: "Energia +20, Hyvinvointi +20"
            },
            "Ystävien tapaaminen": { 
                cost: 10, energy: -15, social: 15, wellbeing: 12, bioAge: -0.15,
                animation: "social", effects: "Sosiaaliset siteet +15, Hyvinvointi +12"
            },
            "Perheen kanssa": { 
                cost: 0, energy: -10, social: 10, wellbeing: 15, bioAge: -0.2,
                animation: "family", effects: "Sosiaaliset siteet +10, Hyvinvointi +15"
            },
            "Harrastukset": { 
                cost: 15, energy: -20, wellbeing: 18, bioAge: -0.1,
                animation: "hobby", effects: "Hyvinvointi +18"
            },
            "Lääketieteellinen tutkimus": { 
                cost: 80, energy: -30, health: 20, bioAge: -0.8,
                animation: "medical", effects: "Terveys +20"
            },
            "Geeniterapia": { 
                cost: 200, energy: -40, health: 30, bioAge: -1.5,
                animation: "special", effects: "Terveys +30"
            },
            "Nuoruuden lähde": { 
                cost: 500, energy: -20, health: 25, bioAge: -2.0, achievement: "Nuoruuden lähde löydetty!",
                animation: "special", effects: "Terveys +25, Saavutus!"
            },
            "Tupakointi": { 
                cost: 5, energy: 5, health: -15, wellbeing: -5, bioAge: 0.5,
                animation: "bad", effects: "Terveys -15, Hyvinvointi -5"
            },
            "Alkoholi": { 
                cost: 10, energy: -5, health: -10, wellbeing: 5, bioAge: 0.3,
                animation: "bad", effects: "Terveys -10, Hyvinvointi +5"
            },
            "Junk food": { 
                cost: 5, energy: 5, health: -8, wellbeing: 8, bioAge: 0.2,
                animation: "eat", effects: "Terveys -8, Hyvinvointi +8"
            }
        };
        
        return baseActions;
    }

    startGame() {
        console.log("Peli käynnistyy...");
        document.getElementById("instructions").classList.add("hidden");
        document.getElementById("gameArea").classList.remove("hidden");
        
        this.character.updateCharacterDisplay();
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
            <div class="statusItem">
                <strong>Vuosi:</strong> ${this.year}
            </div>
            <div class="statusItem">
                <strong>Elämänvaihe:</strong> ${this.character.lifeStage}
            </div>
            <div class="statusItem">
                <strong>Terveys:</strong>
                <div class="statusBar">
                    <div class="statusBarFill healthBar" style="width: ${this.character.health}%"></div>
                </div>
                <span class="statusValue">${this.character.health.toFixed(1)}/100</span>
            </div>
            <div class="statusItem">
                <strong>Hyvinvointi:</strong>
                <div class="statusBar">
                    <div class="statusBarFill wellbeingBar" style="width: ${this.character.wellbeing}%"></div>
                </div>
                <span class="statusValue">${this.character.wellbeing.toFixed(1)}/100</span>
            </div>
            <div class="statusItem">
                <strong>Rahat:</strong>
                <div class="statusBar">
                    <div class="statusBarFill moneyBar" style="width: ${Math.min(100, this.character.money / 5)}%"></div>
                </div>
                <span class="statusValue">${this.character.money} €</span>
            </div>
            <div class="statusItem">
                <strong>Energia:</strong>
                <div class="statusBar">
                    <div class="statusBarFill energyBar" style="width: ${this.character.energy}%"></div>
                </div>
                <span class="statusValue">${this.character.energy.toFixed(1)}/100</span>
            </div>
            <div class="statusItem">
                <strong>Tietämys:</strong>
                <div class="statusBar">
                    <div class="statusBarFill knowledgeBar" style="width: ${Math.min(100, this.character.knowledge)}%"></div>
                </div>
                <span class="statusValue">${this.character.knowledge.toFixed(1)}</span>
            </div>
            <div class="statusItem">
                <strong>Sosiaaliset siteet:</strong>
                <div class="statusBar">
                    <div class="statusBarFill socialBar" style="width: ${this.character.social}%"></div>
                </div>
                <span class="statusValue">${this.character.social.toFixed(1)}/100</span>
            </div>
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
        const actions = this.getActions();

        for (const [actionName, actionDetails] of Object.entries(actions)) {
            const actionContainer = document.createElement("div");
            actionContainer.className = "actionContainer";

            const actionButton = document.createElement("button");
            actionButton.className = "actionButton";
            
            // Lisää valintatila
            const count = this.selectedActions[actionName] || 0;
            if (count >= 3) {
                actionButton.classList.add("selected-thrice");
            } else if (count >= 2) {
                actionButton.classList.add("selected-twice");
            } else if (count >= 1) {
                actionButton.classList.add("selected-once");
            }
            
            actionButton.disabled = this.character.money < actionDetails.cost || this.character.energy < Math.abs(actionDetails.energy);
            actionButton.innerHTML = `
                <span>${actionName} (${actionDetails.cost}€, ${actionDetails.energy} energiaa)</span>
                ${count > 0 ? `<span class="actionCounter">${count}</span>` : ""}
            `;
            
            actionButton.addEventListener("click", () => this.toggleAction(actionName, actionDetails.animation));
            
            const actionEffects = document.createElement("div");
            actionEffects.className = "actionEffects";
            actionEffects.innerHTML = actionDetails.effects;
            
            actionContainer.appendChild(actionButton);
            actionContainer.appendChild(actionEffects);
            actionsList.appendChild(actionContainer);
        }
    }

    toggleAction(actionName, animation) {
        if (!this.selectedActions[actionName]) {
            this.selectedActions[actionName] = 0;
        }
        
        this.selectedActions[actionName]++;
        
        // Näytä animaatio
        this.showCharacterAnimation(animation);
        
        this.renderActions();
    }

    showCharacterAnimation(animationType) {
        const characterContainer = document.getElementById("characterContainer");
        if (!characterContainer) return;
        
        // Poista kaikki aiemmat animaatioluokat
        characterContainer.classList.remove(
            "character-exercise", "character-eat", "character-study", 
            "character-work", "character-rest", "character-social", 
            "character-medical", "character-family", "character-hobby", 
            "character-special", "character-bad"
        );
        
        // Lisää uusi animaatioluokka
        characterContainer.classList.add(`character-${animationType}`);
        
        // Poista animaatio luokka kun animaatio on päättynyt
        setTimeout(() => {
            characterContainer.classList.remove(`character-${animationType}`);
        }, 800);
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
        // Suorita valitut toimenpiteet
        for (const [actionName, count] of Object.entries(this.selectedActions)) {
            const action = this.getActions()[actionName];
            
            for (let i = 0; i < count; i++) {
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
        }
        
        this.selectedActions = {};

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
        this.selectedActions = {};
    }
}

window.addEventListener("DOMContentLoaded", () => {
    console.log("Sivu latautui, käynnistetään peli...");
    new Game();
});