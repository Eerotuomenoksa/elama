// ============================================================
//  ELÄMÄNKAARIPELI – game.js
//  Tutkimukseen perustuvat arvot + opettavat selitykset
// ============================================================

class Character {
    constructor(age = 0, wellbeing = 70, energy = 100, social = 50, spirituality = 50, documents = 50, home = 50) {
        this.age          = age;
        this.bioAge       = age;
        this.wellbeing    = wellbeing;
        this.money        = age * 500;
        this.energy       = energy;
        this.knowledge    = 0;
        this.social       = social;
        this.health       = 80;
        this.spirituality = spirituality;
        this.documents    = documents;
        this.home         = home;
        this.lifeStage    = "Lapsuus";
        this.alive        = true;
        this.achievements = [];
        this.characterName        = "Hahmo";
        this.previousLifeStage    = "";
        this.totalBioAgeGained    = 0;  // kumulatiivinen biologinen ikä muutos
    }

    isUnder18() { return this.age < 18; }

    updateLifeStage() {
        this.previousLifeStage = this.lifeStage;
        if      (this.age < 13) { this.lifeStage = "Lapsuus";   this.characterName = "Lapsi";   }
        else if (this.age < 20) { this.lifeStage = "Nuoruus";   this.characterName = "Nuori";   }
        else if (this.age < 65) { this.lifeStage = "Aikuisuus"; this.characterName = "Aikuinen";}
        else                    { this.lifeStage = "Vanhuus";   this.characterName = "Vanhus";  }
        this.updateCharacterDisplay();
    }

    updateCharacterDisplay() {
        const cc   = document.getElementById("characterContainer");
        const info = document.getElementById("characterInfo");
        if (cc) {
            cc.classList.remove("child","teenager","adult","elderly");
            if      (this.age < 13) cc.classList.add("child");
            else if (this.age < 20) cc.classList.add("teenager");
            else if (this.age < 65) cc.classList.add("adult");
            else                    cc.classList.add("elderly");
        }
        if (info) {
            const diff      = this.age - this.bioAge;
            const diffAbs   = Math.abs(diff).toFixed(1);
            const chipClass = diff > 0.5 ? "good" : diff < -0.5 ? "bad" : "neutral";
            const chipText  = diff > 0.5
                ? `▼ ${diffAbs} v nuorempi biologisesti`
                : diff < -0.5
                    ? `▲ ${diffAbs} v vanhempi biologisesti`
                    : "Biologinen ikä normaali";

            info.innerHTML = `
                <div>${this.characterName} · <strong>${this.lifeStage}</strong></div>
                <div style="color:var(--text-muted);font-size:0.78rem;margin-top:2px;">
                    Fyysinen ikä: <strong style="color:var(--text)">${this.age} v</strong> &nbsp;|&nbsp;
                    Biologinen: <strong style="color:var(--text)">${this.bioAge.toFixed(1)} v</strong>
                </div>
                <span class="bioAge-delta ${chipClass}">${chipText}</span>
            `;
        }
    }

    ageCharacter() {
        this.age++;
        let agingRate = 1.0;

        // Hidastajat – tutkimusperusteiset painot
        if (this.health     > 70) agingRate -= 0.20;   // sydän-verisuoniterveys
        if (this.wellbeing  > 70) agingRate -= 0.15;   // positiivinen mielentila
        if (this.knowledge  > 50) agingRate -= 0.10;   // kognitiivinen reservi
        if (this.social     > 60) agingRate -= 0.20;   // Holt-Lunstad: +50% selviytyminen
        if (this.spirituality>70) agingRate -= 0.10;   // tarkoituksentunne
        if (this.documents  > 70) agingRate -= 0.05;
        if (this.home       > 70) agingRate -= 0.10;

        // Nopeuttajat
        if (this.health    < 40)  agingRate += 0.30;
        if (this.wellbeing < 30)  agingRate += 0.25;
        if (this.money     < 20)  agingRate += 0.20;
        if (this.social    < 30)  agingRate += 0.25;   // yksinäisyys ≈ 15 savuketta/pv
        if (this.spirituality<30) agingRate += 0.15;
        if (this.documents < 30)  agingRate += 0.10;
        if (this.home      < 30)  agingRate += 0.15;

        const change = agingRate - 1.0;
        this.totalBioAgeGained += change;

        this.bioAge = Math.max(0, this.bioAge + agingRate);
        this.updateLifeStage();

        // Terveyden luonnollinen heikkeneminen iän mukana
        if (this.age > 40) this.health -= Math.random() * 1.5 + 0.5;
        if (this.age > 60) this.health -= Math.random() * 2.0 + 1.0;

        if (this.bioAge >= 100 || this.health <= 0 || this.wellbeing <= 0) {
            this.alive = false;
        }
    }
}

// ============================================================
//  TOIMINTOJEN TIETOPANKKI  – tutkimuslähteet merkitty
// ============================================================
function getActions(character) {
    return {
        // ── TERVEYS ──────────────────────────────────────────
        "Terveystarkastus": {
            cost: character.isUnder18() ? 0 : 30, energy: -10,
            health: 15, wellbeing: 5, bioAge: -0.3,
            animation: "medical", visual: "medical",
            effects: "Terveys +15 · Hyvinvointi +5",
            tag: "health",
            tip: "Säännölliset terveystarkastukset auttavat havaitsemaan sairaudet ajoissa – yksi tehokkaimmista ennaltaehkäisyn keinoista."
        },
        "Liikunta": {
            cost: 0, energy: -20,
            health: 10, wellbeing: 8, bioAge: -0.4,
            animation: "exercise", visual: "exercise",
            effects: "Terveys +10 · Hyvinvointi +8",
            tag: "health",
            tip: "Tutkimus: Säännöllinen liikunta lisää elinajanodotetta jopa 7 vuotta. Yli 40 min/pv voi lisätä tervettä elinikää jopa 9 vuotta. (NIH, Live Science 2026)"
        },
        "Terveellinen ruokavalio": {
            cost: character.isUnder18() ? 0 : 15, energy: -5,
            health: 10, wellbeing: 5, bioAge: -0.3,
            animation: "eat",
            effects: "Terveys +10 · Hyvinvointi +5",
            tag: "health",
            tip: "Välimeren ruokavalio pienentää kuolleisuusriskiä jopa 23 % – 25 vuoden seurannassa se suojasi syövältä ja sydänsairauksilta. (Harvard Gazette, 2024)"
        },
        "Lääkkeet": {
            cost: 25, energy: -5,
            health: 12, wellbeing: 3, bioAge: -0.25,
            animation: "medical",
            effects: "Terveys +12 · Hyvinvointi +3",
            tag: "health",
            tip: "Oikea lääkehoito on osa terveydenhuoltoa – mutta lääkkeet eivät korvaa liikuntaa tai ravintoa pitkäaikaisvaikutuksiltaan."
        },
        "Lääketieteellinen tutkimus": {
            cost: 80, energy: -30,
            health: 20, bioAge: -0.8,
            animation: "medical",
            effects: "Terveys +20",
            tag: "health",
            tip: "Erikoisselvitykset voivat paljastaa piilevät sairaudet ennen oireita – varhaishoito parantaa ennustetta merkittävästi."
        },

        // ── MIELI & SIELU ─────────────────────────────────────
        "Meditaatio": {
            cost: 0, energy: -15,
            health: 5, wellbeing: 12, spirituality: 15, bioAge: -0.15,
            animation: "rest",
            effects: "Terveys +5 · Hyvinvointi +12 · Hengellisyys +15",
            tag: "mind",
            tip: "Pitkäaikaismeditaatio on yhteydessä pidempiin telomeereihin – solujen ikääntymisen biomarkkeri. Vähentää stressiä ja tulehdusta. (Nature Scientific Reports, 2020)"
        },
        "Opiskelu": {
            cost: character.isUnder18() ? 0 : 20, energy: -25,
            knowledge: 15, wellbeing: -5, bioAge: -0.1,
            animation: "study", visual: "study",
            effects: "Tietämys +15 · Hyvinvointi −5",
            tag: "mind",
            tip: "Kognitiivinen aktiivisuus rakentaa 'aivokapasiteettia' eli kognitiivista reserviä, joka suojaa muistisairauksilta iäkkäänä."
        },
        "Rukous": {
            cost: 0, energy: -10,
            spirituality: 20, wellbeing: 10, bioAge: -0.2,
            animation: "rest",
            effects: "Hengellisyys +20 · Hyvinvointi +10",
            tag: "mind",
            tip: "Uskonnolliseen yhteisöön kuuluminen on yhteydessä pienempään kuolleisuusriskiin – mekanismina tarkoituksentunne ja sosiaalinen tuki. (NCBI, 2023)"
        },
        "Harrastukset": {
            cost: 15, energy: -20,
            wellbeing: 18, bioAge: -0.1,
            animation: "hobby",
            effects: "Hyvinvointi +18",
            tag: "mind",
            tip: "Mielekkäät harrastukset ylläpitävät tarkoituksentunnetta – elämäntarkoituksen puute kasvattaa kuolleisuusriskiä 2,4-kertaiseksi. (Mind and Brain Institute)"
        },

        // ── SOSIAALISUUS ──────────────────────────────────────
        "Ystävien tapaaminen": {
            cost: 10, energy: -15,
            social: 15, wellbeing: 12, bioAge: -0.45,
            animation: "social",
            effects: "Sosiaaliset siteet +15 · Hyvinvointi +12",
            tag: "social",
            tip: "Hyvät sosiaaliset suhteet nostavat selviytymistodennäköisyyttä 50 %. Yksinäisyys on yhtä vaarallista kuin 15 savukkeen polttaminen päivässä. (Holt-Lunstad, Surgeon General USA)"
        },
        "Perheen kanssa": {
            cost: 0, energy: -10,
            social: 10, wellbeing: 15, home: 5, bioAge: -0.50,
            animation: "family",
            effects: "Sosiaaliset siteet +10 · Hyvinvointi +15 · Koti +5",
            tag: "social",
            tip: "Läheiset perhesuhteet ovat yksi vahvimmista pitkäikäisyyden ennustajista – erityisesti yli 65-vuotiailla. (Lancet Healthy Longevity, 2024)"
        },

        // ── KÄYTÄNNÖN ASIAT ───────────────────────────────────
        "Työ": {
            cost: 0, energy: -30,
            money: 50, wellbeing: -10, bioAge: 0.1,
            animation: "work", visual: "work",
            effects: "Raha +50 · Hyvinvointi −10",
            tag: "work",
            tip: "Krooninen työkuormitus kiihdyttää biologista ikääntymistä. Tasapaino työn ja levon välillä on keskeistä pitkäikäisyydelle."
        },
        "Loma": {
            cost: 40, energy: 20,
            wellbeing: 20, home: 10, bioAge: -0.2,
            animation: "rest",
            effects: "Energia +20 · Hyvinvointi +20 · Koti +10",
            tag: "lifestyle",
            tip: "Säännöllinen palautuminen suojaa sydäntä ja parantaa immuunijärjestelmää. Stressi nostaa kortisolipitoisuutta, joka kiihdyttää solujen ikääntymistä."
        },
        "Asiakirjojen järjestäminen": {
            cost: 0, energy: -15,
            documents: 20, wellbeing: 5, bioAge: -0.1,
            animation: "study",
            effects: "Asiakirjat +20 · Hyvinvointi +5",
            tag: "lifestyle",
            tip: "Elämänhallinta ja varautuminen tulevaan vähentävät stressiä – krooninen stressi on yksi keskeisistä biologisen ikääntymisen kiihdyttäjistä."
        },
        "Kunnostaminen": {
            cost: 100, energy: -30,
            home: 25, wellbeing: 15, bioAge: -0.2,
            animation: "work",
            effects: "Koti +25 · Hyvinvointi +15",
            tag: "lifestyle",
            tip: "Laadukas asuinympäristö tukee fyysistä ja psyykkistä hyvinvointia. Koti on keskeinen elinympäristö, joka vaikuttaa päivittäiseen terveystottumuksiin."
        },

        // ── ERITYISET ────────────────────────────────────────
        "Geeniterapia": {
            cost: 200, energy: -40,
            health: 30, bioAge: -1.5,
            animation: "special",
            effects: "Terveys +30",
            tag: "special",
            tip: "Geeniterapia on nopeasti kehittyvä ala – jo nyt kokeillaan interventioita, jotka voivat hidastaa solujen ikääntymistä suoraan DNA-tasolla."
        },
        "Nuoruuden lähde": {
            cost: 500, energy: -20,
            health: 25, bioAge: -2.0,
            achievement: "Nuoruuden lähde löydetty!",
            animation: "special",
            effects: "Terveys +25 · Saavutus!",
            tag: "special",
            tip: "Viitteellinen: edustaa tulevaisuuden seniluokan longevity-interventioita (senolyytit, NAD+, telomeraasi). Tiedettä seurataan aktiivisesti."
        },

        // ── HAITALLISET ───────────────────────────────────────
        "Tupakointi": {
            cost: 5, energy: 5,
            health: -18, wellbeing: -8, bioAge: 1.2,
            animation: "bad",
            effects: "Terveys −18 · Hyvinvointi −8",
            tag: "harmful",
            tip: "⚠ Jokainen savuke vie 17–22 minuuttia elinajasta. Tupakointi lyhentää elinikää keskimäärin 7–10 vuotta. Lopettaminen ennen 40 v palauttaa lähes täyden elinajanodotteen. (CNN, 2025)"
        },
        "Alkoholi": {
            cost: 10, energy: -5,
            health: -12, wellbeing: -3, bioAge: 0.6,
            animation: "bad",
            effects: "Terveys −12 · Hyvinvointi −3",
            tag: "harmful",
            tip: "⚠ Ei ole olemassa turvallista alkoholin käyttötasoa terveyden kannalta. Edes kohtuullinen käyttö ei pidennä elinikää – uusin tutkimus kumoaa vanhan 'viinilasi on terveellistä' -myyttin. (BMC Medicine, 2023)"
        },
        "Junk food": {
            cost: 5, energy: 5,
            health: -10, wellbeing: 5, bioAge: 0.3,
            animation: "eat",
            effects: "Terveys −10 · Hyvinvointi +5",
            tag: "harmful",
            tip: "⚠ Ultraprosessoitu ruoka lisää tulehdusta, häiritsee suolistomikrobiomia ja on yhteydessä lyhyempiin telomeereihin. Lyhytaikainen hyvä olo, pitkäaikainen haitta."
        }
    };
}

// ============================================================
//  IKÄSPESIFISET VIISAUDET
// ============================================================
const STAGE_WISDOM = {
    "Lapsuus": [
        "🌱 Lapsuus: Liikunnalliset tottumukset lapsuudessa kantavat läpi koko elämän – aktiiviset lapset kasvavat aktiivisiksi aikuisiksi.",
        "🌱 Lapsuus: Sosiaaliset taidot opitaan varhain. Vahvat kaverisuhteet nyt rakentavat sosiaalista pääomaa tulevaisuuteen.",
        "🌱 Lapsuus: Terveellinen ravinto kasvuvuosina vaikuttaa kehitykseen ja myöhempään terveyteen pitkälle aikuisuuteen."
    ],
    "Nuoruus": [
        "🔥 Nuoruus: Tupakoinnin aloittaminen nuorena luo vahvan riippuvuuden – 80 % elinikäisistä tupakoijista aloitti alle 18-vuotiaana.",
        "🔥 Nuoruus: Tämä on elämän paras aika rakentaa liikunta- ja ravintotottumuksia – ne muotoutuvat pysyviksi.",
        "🔥 Nuoruus: Uni on nuoruudessa erityisen tärkeää – kasvuhormoni erittyy pääasiassa syvän unen aikana.",
        "🔥 Nuoruus: Alkoholi vaikuttaa kehittyvään aivoihin eri tavalla kuin aikuisten – riskit ovat suuremmat kuin myöhemmin aloitettuna."
    ],
    "Aikuisuus": [
        "💼 Aikuisuus: Stressin hallinta tässä vaiheessa on kriittistä. Krooninen stressi nostaa kortisolia, joka kiihdyttää biologista ikääntymistä.",
        "💼 Aikuisuus: Sosiaaliset verkostot kutistuvat helposti kiireisessä arjessa – panostaminen ihmissuhteisiin on terveysteko.",
        "💼 Aikuisuus: Liikunta yli 40-vuotiaana hidastaa lihaskatoa (sarkopeniaa), joka alkaa 3–8 % vuosikymmenessä ilman harjoittelua.",
        "💼 Aikuisuus: Puolet sydänsairauksien riskitekijöistä muodostuu 30–50 ikävuosien välillä – se on paras aika muuttaa tapoja."
    ],
    "Vanhuus": [
        "🌿 Vanhuus: Sosiaaliset suhteet ovat tärkein pitkäikäisyyden tekijä yli 65-vuotiailla. Yksinäisyys lisää dementiaa, masennusta ja sydänsairauksia.",
        "🌿 Vanhuus: Kevytkin liikunta (kävely 30 min/pv) vähentää iäkkäillä kaatumisriskiä ja parantaa kognitiota.",
        "🌿 Vanhuus: Tarkoituksentunne ja merkityksellisyys ovat tutkitusti yhteydessä hitaampaan kognitiiviseen heikentymiseen.",
        "🌿 Vanhuus: Ravintolisät (D-vitamiini, omega-3) voivat olla tärkeämpiä iäkkäänä, koska imeytyminen heikkenee iän myötä."
    ]
};

// ============================================================
//  GAME CLASS
// ============================================================
class Game {
    constructor() {
        this.character       = new Character();
        this.year            = 0;
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
        const startButton    = document.getElementById("startButton");
        const nextYearButton = document.getElementById("nextYearButton");
        const restartButton  = document.getElementById("restartButton");
        const setupForm      = document.getElementById("setupForm");
        const ageInput       = document.getElementById("playerAge");

        if (startButton)    startButton.addEventListener("click",  () => this.showCharacterSetup());
        if (setupForm)      setupForm.addEventListener("submit",   (e) => { e.preventDefault(); this.handleCharacterSetup(e); });
        if (nextYearButton) nextYearButton.addEventListener("click",() => this.nextYear());
        if (restartButton)  restartButton.addEventListener("click", () => this.restart());

        if (ageInput) {
            ageInput.addEventListener("input", (e) => {
                const age = parseInt(e.target.value) || 0;
                const el  = document.getElementById("startingMoney");
                if (el) el.textContent = (age * 500).toLocaleString('fi-FI');
            });
        }

        const sliders = [
            { id: "playerWellbeing",    valueId: "wellbeingValue"    },
            { id: "playerEnergy",       valueId: "energyValue"       },
            { id: "playerSocial",       valueId: "socialValue"       },
            { id: "playerSpirituality", valueId: "spiritualityValue" },
            { id: "playerDocuments",    valueId: "documentsValue"    },
            { id: "playerHome",         valueId: "homeValue"         }
        ];
        sliders.forEach(({ id, valueId }) => {
            const input = document.getElementById(id);
            const val   = document.getElementById(valueId);
            if (input && val) input.addEventListener("input", (e) => { val.textContent = e.target.value; });
        });
    }

    showCharacterSetup() {
        document.getElementById("instructions").classList.add("hidden");
        document.getElementById("characterSetup").classList.remove("hidden");
        const age = parseInt(document.getElementById("playerAge").value) || 0;
        const el  = document.getElementById("startingMoney");
        if (el) el.textContent = (age * 500).toLocaleString('fi-FI');
    }

    handleCharacterSetup(e) {
        e.preventDefault();
        const age          = parseInt(document.getElementById("playerAge").value)          || 0;
        const wellbeing    = parseInt(document.getElementById("playerWellbeing").value)    || 70;
        const energy       = parseInt(document.getElementById("playerEnergy").value)       || 100;
        const social       = parseInt(document.getElementById("playerSocial").value)       || 50;
        const spirituality = parseInt(document.getElementById("playerSpirituality").value) || 50;
        const documents    = parseInt(document.getElementById("playerDocuments").value)    || 50;
        const home         = parseInt(document.getElementById("playerHome").value)         || 50;

        this.character       = new Character(age, wellbeing, energy, social, spirituality, documents, home);
        this.year            = 0;
        this.selectedActions = {};

        document.getElementById("characterSetup").classList.add("hidden");
        document.getElementById("gameArea").classList.remove("hidden");

        this.character.updateCharacterDisplay();
        this.updateStatus();
        this.renderActions();
        this.addLogEntry(`Peli alkaa! Olet ${age}-vuotias · ${this.character.money.toLocaleString('fi-FI')} €`, "success");

        // Ensimmäinen ikäspesifinen vihje
        this.showStageWisdom(this.character.lifeStage);
    }

    // ── Tila-paneelin päivitys ──────────────────────────────
    updateStatus() {
        const statusInfo = document.getElementById("statusInfo");
        if (!statusInfo) return;

        const c     = this.character;
        const diff  = c.age - c.bioAge;
        const years = Math.abs(diff).toFixed(1);
        const yearChipClass = diff > 0 ? "gained" : "lost";
        const yearChipText  = diff > 0
            ? `+${years} v voitettu`
            : `-${years} v hävitty`;

        const items = [
            { label: "Pelin vuosi",         icon: "📅", value: this.year,                  bar: false },
            { label: "Elämänvaihe",         icon: "🎭", value: c.lifeStage,                bar: false },
            { label: "Terveys",             icon: "❤️",  value: c.health,    cls: "healthBar",       max: 100 },
            { label: "Hyvinvointi",         icon: "😊", value: c.wellbeing,  cls: "wellbeingBar",    max: 100 },
            { label: "Rahat",               icon: "💶", value: `${c.money.toLocaleString('fi-FI')} €`, bar: false },
            { label: "Energia",             icon: "⚡", value: c.energy,     cls: "energyBar",       max: 100 },
            { label: "Tietämys",            icon: "📚", value: c.knowledge,  cls: "knowledgeBar",    max: 100 },
            { label: "Sosiaaliset siteet",  icon: "🤝", value: c.social,     cls: "socialBar",       max: 100 },
            { label: "Hengellisyys",        icon: "✨", value: c.spirituality,cls:"spiritualityBar",  max: 100 },
            { label: "Asiakirjat",          icon: "📄", value: c.documents,  cls: "documentsBar",    max: 100 },
            { label: "Koti",                icon: "🏠", value: c.home,       cls: "homeBar",         max: 100 },
        ];

        statusInfo.innerHTML = items.map(item => {
            if (item.bar === false) {
                return `
                  <div class="statusItem">
                    <strong><span class="stat-icon">${item.icon}</span>${item.label}</strong>
                    <span style="color:var(--text);font-weight:700;">${item.value}</span>
                  </div>`;
            }
            const pct = Math.min(100, Math.max(0, item.value));
            return `
              <div class="statusItem">
                <strong><span class="stat-icon">${item.icon}</span>${item.label}
                  <span class="statusValue">${parseFloat(item.value).toFixed(1)}/100</span>
                </strong>
                <div class="statusBar">
                  <div class="statusBarFill ${item.cls}" style="width:${pct}%"></div>
                </div>
              </div>`;
        }).join('');

        // Biologinen ikä -kortti
        statusInfo.innerHTML += `
          <div class="statusItem" style="grid-column:1/-1; border-color:var(--accent);">
            <strong><span class="stat-icon">🧬</span>Biologinen ikä vs. fyysinen ikä</strong>
            <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
              <span style="font-size:0.82rem;color:var(--text-muted);">Fyysinen: <strong style="color:var(--text)">${c.age} v</strong></span>
              <span style="font-size:0.82rem;color:var(--text-muted);">Biologinen: <strong style="color:var(--text)">${c.bioAge.toFixed(1)} v</strong></span>
              <span class="years-chip ${yearChipClass}">${yearChipText}</span>
            </div>
          </div>`;

        if (c.achievements.length > 0) {
            statusInfo.innerHTML += `<div class="statusItem achievement" style="grid-column:1/-1"><strong>🏆 Saavutukset</strong>${c.achievements.join(" · ")}</div>`;
        }

        // Varoitukset
        if (c.bioAge < c.age - 10) this.addLogEntry("🌟 Biologinen ikäsi on paljon alhaisempi – loistavia valintoja!", "success");
        if (c.wellbeing < 20)       this.addLogEntry("⚠️ Hyvinvointisi on kriittisen alhainen – tee jotain heti!", "warning");
        if (c.health < 30)          this.addLogEntry("⚠️ Terveytesi on heikko – hakeudu hoitoon!", "warning");
        if (c.social < 20)          this.addLogEntry("⚠️ Olet yhä eristyneempi – yksinäisyys on yhtä vaarallista kuin tupakointi!", "warning");
    }

    // ── Toimintojen renderöinti ─────────────────────────────
    renderActions() {
        const actionsList = document.getElementById("actionsList");
        if (!actionsList) return;
        actionsList.innerHTML = "";

        const actions = getActions(this.character);

        for (const [name, d] of Object.entries(actions)) {
            const count = this.selectedActions[name] || 0;
            const disabled = this.character.money < d.cost || this.character.energy < Math.abs(d.energy || 0);

            const tagHtml = `<span class="action-tag tag-${d.tag}">${this.tagLabel(d.tag)}</span>`;

            let btnLabel = name;
            if (this.character.isUnder18() && ["Terveellinen ruokavalio","Opiskelu","Terveystarkastus"].includes(name)) {
                btnLabel += " <span style='color:var(--green);font-size:0.7rem'>(ILMAINEN)</span>";
            }

            const costLabel = `${d.cost || 0}€ · ${d.energy || 0} E`;

            const container = document.createElement("div");
            container.className = "actionContainer";

            const btn = document.createElement("button");
            btn.className = "actionButton";
            if (count >= 3) btn.classList.add("selected-thrice");
            else if (count >= 2) btn.classList.add("selected-twice");
            else if (count >= 1) btn.classList.add("selected-once");
            btn.disabled = disabled;
            btn.innerHTML = `
              <span class="btn-label">${tagHtml}<br>${btnLabel}${count > 0 ? ` <span class="actionCounter">${count}</span>` : ''}</span>
              <span class="btn-cost">${costLabel}</span>`;
            btn.addEventListener("click", () => this.toggleAction(name, d.animation, d.visual));

            const effects = document.createElement("div");
            effects.className = "actionEffects";
            effects.textContent = d.effects;

            const tip = document.createElement("div");
            tip.className = "actionTooltip";
            tip.textContent = `💡 ${d.tip}`;

            container.append(btn, effects, tip);
            actionsList.appendChild(container);
        }
    }

    tagLabel(tag) {
        const map = { health:"Terveys", social:"Sosiaalisuus", mind:"Mieli", work:"Työ", lifestyle:"Elämäntapa", harmful:"Haitallinen", special:"Erikois" };
        return map[tag] || tag;
    }

    toggleAction(actionName, animation, visual) {
        if (!this.selectedActions[actionName]) this.selectedActions[actionName] = 0;
        this.selectedActions[actionName]++;
        this.addLogEntry(`Valittu: ${actionName} (${this.selectedActions[actionName]}×)`);
        this.showCharacterAnimation(animation, visual);
        this.renderActions();
    }

    showCharacterAnimation(type, visual) {
        const cc = document.getElementById("characterContainer");
        if (!cc) return;
        cc.classList.remove(
            "character-exercise","character-eat","character-study","character-work",
            "character-rest","character-social","character-medical","character-family",
            "character-hobby","character-special","character-bad",
            "show-medical","show-exercise","show-study","show-work"
        );
        cc.classList.add(`character-${type}`);
        if (visual) cc.classList.add(`show-${visual}`);
        setTimeout(() => {
            cc.classList.remove(`character-${type}`);
            if (visual) cc.classList.remove(`show-${visual}`);
        }, 800);
    }

    forceClearActionSelection() {
        document.querySelectorAll('.actionButton').forEach(btn => {
            btn.classList.remove('selected-once','selected-twice','selected-thrice');
            btn.querySelector('.actionCounter')?.remove();
        });
        document.getElementById("characterContainer")
            ?.classList.remove("show-medical","show-exercise","show-study","show-work");
    }

    // ── Satunnaiset tapahtumat ──────────────────────────────
    randomEvent() {
        const events = [
            { name: "Sairastuminen 🤒",          health: -15, wellbeing: -10, bioAge: 0.2 },
            { name: "Tapaturma 🚑",               health: -20, wellbeing: -15, money: -50 },
            { name: "Perintö 💰",                 money: 150, wellbeing: 10 },
            { name: "Uusi ystävä 🤝",             social: 20, wellbeing: 15 },
            { name: "Työtarjous 💼",              money: 100, energy: -20 },
            { name: "Läheisen menetys 💔",        social: -25, wellbeing: -20, bioAge: 0.3 },
            { name: "Merkittävä löytö 🔭",        money: 50,  knowledge: 15 },
            { name: "Henkinen herätys 🕊️",       spirituality: 25, wellbeing: 20, bioAge: -0.2 },
            { name: "Kotivarkaus 🔓",             home: -30, wellbeing: -20 },
            { name: "Lottovoitto 🎰",             money: 300, wellbeing: 25 },
            { name: "Urakehitys 📈",              money: 200, energy: -30 },
            { name: "Matka ulkomaille ✈️",        wellbeing: 30, money: -120, knowledge: 10 },
            { name: "Uusi harrastus 🎨",          wellbeing: 20, money: -50 },
            { name: "Perhejuhla 🎉",              social: 30, wellbeing: 25, home: 15 },
            { name: "Henkinen kriisi 😔",         spirituality: -30, wellbeing: -25 },
            { name: "Verenpainetauti ❤️‍🩹",      health: -25, wellbeing: -15, bioAge: 0.3 },
            { name: "Meditaatio-retreatti 🧘",    spirituality: 30, wellbeing: 20, money: -100, bioAge: -0.3 },
            { name: "Kodin remontti 🔨",          home: 30, money: -200 },
            { name: "Ystävä muuttaa pois 😢",     social: -20, wellbeing: -15 },
            { name: "Työnmenetys 📉",             money: -150, wellbeing: -25 },
            { name: "Henkinen valaistuminen ✨",   spirituality: 40, wellbeing: 30, bioAge: -0.5 },
            { name: "Uusi perheenjäsen 👶",       social: 25, wellbeing: 20, money: -100 },
            { name: "Vapaaehtoistoiminta 🙌",     social: 20, wellbeing: 25, spirituality: 10 },
            { name: "Digitaalinen detox 📵",      wellbeing: 15, social: -5 },
            { name: "Liikuntavamma 🦵",           health: -15, energy: -20 }
        ];

        if (Math.random() < 0.4) {
            const ev = events[Math.floor(Math.random() * events.length)];
            this.addLogEntry(`TAPAHTUMA: ${ev.name}`, "event");
            for (const [k, v] of Object.entries(ev)) {
                if (k !== "name" && k in this.character) this.character[k] += v;
            }
        }
    }

    // ── Ikäspesifinen viisaus ───────────────────────────────
    showStageWisdom(stage) {
        const wisdoms = STAGE_WISDOM[stage];
        if (!wisdoms) return;
        const w = wisdoms[Math.floor(Math.random() * wisdoms.length)];
        this.addLogEntry(w, "stage");
    }

    // ── Seuraava vuosi ──────────────────────────────────────
    nextYear() {
        const actions = getActions(this.character);
        for (const [name, count] of Object.entries(this.selectedActions)) {
            const a = actions[name];
            if (!a) continue;
            for (let i = 0; i < count; i++) {
                this.character.money       -= a.cost      || 0;
                this.character.energy      += a.energy    || 0;
                this.character.health      += a.health    || 0;
                this.character.wellbeing   += a.wellbeing || 0;
                this.character.knowledge   += a.knowledge || 0;
                this.character.social      += a.social    || 0;
                this.character.spirituality+= a.spirituality || 0;
                this.character.documents   += a.documents || 0;
                this.character.home        += a.home      || 0;
                this.character.bioAge      += a.bioAge    || 0;
                if (a.achievement) {
                    this.character.achievements.push(a.achievement);
                    this.addLogEntry(`🏆 Saavutus: ${a.achievement}`, "success");
                }
            }
        }

        this.selectedActions = {};
        this.forceClearActionSelection();
        this.randomEvent();

        const prevStage = this.character.lifeStage;
        this.character.ageCharacter();
        this.year++;

        // Energia regeneroituu osittain joka vuosi
        this.character.energy = Math.min(100, this.character.energy + 30);

        // Clamp
        const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
        this.character.wellbeing   = clamp(this.character.wellbeing,    0, 100);
        this.character.health      = clamp(this.character.health,       0, 100);
        this.character.energy      = clamp(this.character.energy,       0, 100);
        this.character.social      = clamp(this.character.social,       0, 100);
        this.character.knowledge   = Math.max(0, this.character.knowledge);
        this.character.spirituality= clamp(this.character.spirituality, 0, 100);
        this.character.documents   = clamp(this.character.documents,    0, 100);
        this.character.home        = clamp(this.character.home,         0, 100);

        // Ilmoitus elämänvaiheen vaihdosta
        if (this.character.lifeStage !== prevStage) {
            this.addLogEntry(`🎭 Siirryt elämänvaiheeseen: ${this.character.lifeStage}`, "stage");
            this.showStageWisdom(this.character.lifeStage);
        } else if (this.year % 5 === 0) {
            // Joka 5. vuosi muistutetaan viisaudella
            this.showStageWisdom(this.character.lifeStage);
        }

        this.updateStatus();
        this.renderActions();

        if (!this.character.alive) this.gameOver();
    }

    addLogEntry(message, type = "") {
        const log = document.getElementById("logContent");
        if (!log) return;
        const entry = document.createElement("div");
        entry.className = "logEntry" + (type ? ` ${type}` : "");
        entry.textContent = `[Vuosi ${this.year}] ${message}`;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    // ── Peli päättyy ───────────────────────────────────────
    gameOver() {
        document.getElementById("gameArea").classList.add("hidden");
        document.getElementById("gameOverScreen").classList.remove("hidden");

        const c    = this.character;
        const diff = (c.age - c.bioAge).toFixed(1);
        const bio  = c.bioAge.toFixed(1);

        let msgClass = "poor", msg = "";
        if      (c.age > 90) { msgClass = "great";  msg = "🏆 Loistava suoritus! Elit pitkän ja täyden elämän!"; }
        else if (c.age > 75) { msgClass = "good";   msg = "🌟 Hyvä suoritus! Saavutit korkean iän!"; }
        else if (c.age > 55) { msgClass = "ok";     msg = "📘 Kohtalainen suoritus – ensi kerralla terveellisempiä valintoja!"; }
        else                  {                       msg = "💡 Elämäsi oli lyhyt. Muista: sosiaalisuus, liikunta ja hyvä ravinto ovat tärkeimpiä."; }

        // Biologisen iän selitys
        const bioNote = parseFloat(diff) > 0
            ? `Tekemäsi valinnat hidastivat biologista ikääntymistä – biologinen ikäsi oli ${diff} vuotta fyysistä ikääsi alhaisempi!`
            : `Biologinen ikäsi oli ${Math.abs(parseFloat(diff)).toFixed(1)} vuotta fyysistä ikääsi korkeampi – haitalliset valinnat kiihdyttivät ikääntymistä.`;

        document.getElementById("finalStats").innerHTML = `
          <p><strong>Kuolit ${c.age} vuotiaana</strong> (biologinen ikä ${bio} vuotta)</p>
          <p>Peli kesti <strong>${this.year} vuotta</strong></p>
          <p>🧬 ${bioNote}</p>
          <p>Loppu hyvinvointi: <strong>${c.wellbeing.toFixed(1)}/100</strong></p>
          <p>Loppu terveys: <strong>${c.health.toFixed(1)}/100</strong></p>
          <p>Loppu sosiaaliset siteet: <strong>${c.social.toFixed(1)}/100</strong></p>
          <p>Loppu rahat: <strong>${c.money.toLocaleString('fi-FI')} €</strong></p>
          ${c.achievements.length ? `<p>🏆 Saavutukset: <strong>${c.achievements.join(", ")}</strong></p>` : ""}
          <div class="final-message ${msgClass}">${msg}</div>
        `;
    }

    restart() {
        document.getElementById("gameOverScreen").classList.add("hidden");
        document.getElementById("instructions").classList.remove("hidden");
        document.getElementById("characterSetup").classList.add("hidden");
        document.getElementById("logContent").innerHTML = "";
        this.character       = new Character();
        this.year            = 0;
        this.selectedActions = {};
    }
}

// ── Käynnistys ────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => { new Game(); });
