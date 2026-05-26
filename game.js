// ============================================================
//  ELAMANKAARI – game.js
//  Tutkimukseen perustuvat arvot + opettavat selitykset
// ============================================================

// ============================================================
//  IKARYHMIEN MAARITTELY
// ============================================================
const LIFE_STAGES = [
    {
        name: "Varhaislapsuus", charName: "Pikkuinen", cssClass: "child",
        minAge: 0, maxAge: 6,
        defaults: { health: 95, energy: 100, social: 40, knowledge: 0, spirituality: 20, documents: 10, home: 60 },
        intro: "Varhaislapsuus (0-6 v): Perusliikuntatottumukset ja kiintymyssuhteet muotoutuvat - ne vaikuttavat koko loppuelamaan."
    },
    {
        name: "Lapsuus", charName: "Lapsi", cssClass: "child",
        minAge: 7, maxAge: 12,
        defaults: { health: 92, energy: 95, social: 50, knowledge: 10, spirituality: 30, documents: 15, home: 60 },
        intro: "Lapsuus (7-12 v): Liikunta- ja ravintotottumukset vakiintuvat. Aktiiviset lapset kasvavat aktiivisiksi aikuisiksi."
    },
    {
        name: "Nuoruus", charName: "Nuori", cssClass: "teenager",
        minAge: 13, maxAge: 19,
        defaults: { health: 88, energy: 90, social: 55, knowledge: 20, spirituality: 35, documents: 20, home: 55 },
        intro: "Nuoruus (13-19 v): Kriittinen ajanjakso - elamantatvat, jotka muotoutuvat nyt, seuraavat pitkan aikuisuuteen."
    },
    {
        name: "Varhainen aikuisuus", charName: "Nuori aikuinen", cssClass: "adult",
        minAge: 20, maxAge: 35,
        defaults: { health: 82, energy: 85, social: 60, knowledge: 35, spirituality: 40, documents: 35, home: 45 },
        intro: "Varhainen aikuisuus (20-35 v): Paras aika rakentaa terveystottumuksia - keho on joustava ja tottumukset juurtuvat."
    },
    {
        name: "Keski-ikaisyys", charName: "Aikuinen", cssClass: "adult",
        minAge: 36, maxAge: 50,
        defaults: { health: 72, energy: 75, social: 60, knowledge: 55, spirituality: 50, documents: 55, home: 60 },
        intro: "Keski-ikaisyys (36-50 v): Puolet sydansairauksien riskitekijoista muodostuu tassa vaiheessa - nyt on hyva aika muuttaa tapoja."
    },
    {
        name: "Myohainен aikuisuus", charName: "Aikuinen", cssClass: "adult",
        minAge: 51, maxAge: 64,
        defaults: { health: 62, energy: 65, social: 55, knowledge: 65, spirituality: 55, documents: 65, home: 65 },
        intro: "Myohainen aikuisuus (51-64 v): Stressin hallinta ja sosiaaliset suhteet nousevat tarkeimmiksi pitkaikaisyyden tekijoiksi."
    },
    {
        name: "Varhainen vanhuus", charName: "Vanhus", cssClass: "elderly",
        minAge: 65, maxAge: 79,
        defaults: { health: 52, energy: 55, social: 50, knowledge: 70, spirituality: 60, documents: 70, home: 70 },
        intro: "Varhainen vanhuus (65-79 v): Sosiaaliset suhteet ovat tarkein pitkaikaisyyden tekija. Liike yllapitaa toimintakykya."
    },
    {
        name: "Myohainen vanhuus", charName: "Ikaihminen", cssClass: "elderly",
        minAge: 80, maxAge: 100,
        defaults: { health: 40, energy: 45, social: 45, knowledge: 72, spirituality: 65, documents: 75, home: 70 },
        intro: "Myohainen vanhuus (80+ v): Tarkoituksentunne ja laheiset ihmissuhteet suojaavat kognitiiviselta heikentymiselta."
    }
];

function getLifeStage(age) {
    for (const stage of LIFE_STAGES) {
        if (age >= stage.minAge && age <= stage.maxAge) return stage;
    }
    return LIFE_STAGES[LIFE_STAGES.length - 1];
}

function getStageCategory(age) {
    if (age < 7)  return "Varhaislapsuus";
    if (age < 13) return "Lapsuus";
    if (age < 20) return "Nuoruus";
    if (age < 36) return "Varhainen aikuisuus";
    if (age < 51) return "Keski-ikaisyys";
    if (age < 65) return "Myohainen aikuisuus";
    if (age < 80) return "Varhainen vanhuus";
    return "Myohainen vanhuus";
}

// ============================================================
//  IKASPECIFISET VIISAUDET
// ============================================================
const STAGE_WISDOM = {
    "Varhaislapsuus": [
        "Varhaislapsuus: Kiintymyssuhteet vanhempiin ennustavat aikuisian sosiaalista hyvinvointia ja stressinsietokykya.",
        "Varhaislapsuus: Leikki on tassa iassa paras liikuntamuoto - se kehittaa motorisia taitoja ja sosiaalista alykkyyttа.",
        "Varhaislapsuus: Unirytmi on kriittinen - pienet lapset tarvitsevat 10-13 tuntia unta vuorokaudessa aivojen kehitykseen."
    ],
    "Lapsuus": [
        "Lapsuus: Liikunnalliset tottumukset lapsuudessa kantavat lapi koko elaman - aktiiviset lapset kasvavat aktiivisiksi aikuisiksi.",
        "Lapsuus: Sosiaaliset taidot opitaan varhain. Vahvat kaverisuhteet nyt rakentavat sosiaalista paaomaa tulevaisuuteen.",
        "Lapsuus: Terveellinen ravinto kasvuvuosina vaikuttaa kehitykseen ja myohempaan terveyteen pitkan aikuisuuteen."
    ],
    "Nuoruus": [
        "Nuoruus: Tupakoinnin aloittaminen nuorena luo vahvan riippuvuuden - 80 % elinikaisisista tupakoijista aloitti alle 18-vuotiaana.",
        "Nuoruus: Tama on elaman paras aika rakentaa liikunta- ja ravintotottumuksia - ne muotoutuvat pysyviksi.",
        "Nuoruus: Uni on nuoruudessa erityisen tarkeaa - kasvuhormoni erittyy paasiassa syvan unen aikana.",
        "Nuoruus: Alkoholi vaikuttaa kehittyvaan aivoihin eri tavalla kuin aikuisilla - riskit ovat suuremmat."
    ],
    "Varhainen aikuisuus": [
        "Varhainen aikuisuus: Keho on parhaimmillaan - nyt luodut terveystottumukset kantavat vuosikymmenia.",
        "Varhainen aikuisuus: Sosiaalinen verkosto rakentuu aktiivisesti - panostaminen ystavyyssuhteisiin maksaa itsensa takaisin.",
        "Varhainen aikuisuus: Stressi on tassa vaiheessa yleista - jo 10 min paivittainen mindfulness vahentaa kortisolitasoja mitattavasti."
    ],
    "Keski-ikaisyys": [
        "Keski-ikaisyys: Stressin hallinta on kriittista - krooninen stressi kiihdyttaa biologista ikaantymista.",
        "Keski-ikaisyys: Sosiaaliset verkostot kutistuvat helposti kiireisessa arjessa - ihmissuhteet ovat terveysteko.",
        "Keski-ikaisyys: Liikunta hidastaa lihaskatoa (sarkopeniaa), joka alkaa 3-8 % per vuosikymmen ilman harjoittelua.",
        "Keski-ikaisyys: Puolet sydansairauksien riskitekijoista muodostuu 36-50 ikaevuosien valilla - paras aika muuttaa tapoja."
    ],
    "Myohainen aikuisuus": [
        "Myohainen aikuisuus: Saannollinen terveystarkastus on erityisen tarkeaa - monet sairaudet ovat oireettomia pitkan.",
        "Myohainen aikuisuus: Uni muuttuu rakenteeltaan - syvan unen osuus vahenee, mika vaikuttaa palautumiseen ja muistiin.",
        "Myohainen aikuisuus: Elakkeelle siirtymisen suunnittelu kannattaa aloittaa ajoissa - tarkoituksentunne suojaa mielenterveytta.",
        "Myohainen aikuisuus: Lihasvoiman yllapito on keskeista - kaatuminen on suurin vammojen aiheuttaja yli 50-vuotiailla."
    ],
    "Varhainen vanhuus": [
        "Varhainen vanhuus: Sosiaaliset suhteet ovat tarkein pitkaikaisyyden tekija yli 65-vuotiailla. Yksinaisyys lisaa dementiaa.",
        "Varhainen vanhuus: Kevytkin liikunta (kavely 30 min/pv) vahentaa kaatumisriskia ja parantaa kognitiota.",
        "Varhainen vanhuus: Tarkoituksentunne ja merkityksellisyys hidastavat kognitiivista heikentymista tutkitusti.",
        "Varhainen vanhuus: D-vitamiini ja omega-3 voivat olla tarkeampaa nyt - imeytyminen heikkenee ian myota."
    ],
    "Myohainen vanhuus": [
        "Myohainen vanhuus: Laheiset ihmissuhteet suojaavat eniten - yksinkin pienet saannolliset sosiaaliset kontaktit merkitsevat.",
        "Myohainen vanhuus: Tasapainoharjoittelu on tarkeampaa kuin kestavyys - kaatumisten ehkaisy on prioriteetti.",
        "Myohainen vanhuus: Elamankatsomukselliset asiat ja omien arvojen mukainen elama ennustavat psyykkista hyvinvointia.",
        "Myohainen vanhuus: Aivojen neuroplastisuus sailyy - uuden oppiminen hidastaa kognitiivista heikentymista myos 80+ iassa."
    ]
};

// ============================================================
//  CHARACTER CLASS
// ============================================================
class Character {
    constructor(age = 0, wellbeing = null, energy = null, social = null, spirituality = null, documents = null, home = null) {
        const stage = getLifeStage(age);

        this.age           = age;
        this.bioAge        = age;
        this.money         = age * 500;
        this.knowledge     = stage.defaults.knowledge;
        this.alive         = true;
        this.achievements  = [];
        this.previousLifeStage  = "";
        this.totalBioAgeGained  = 0;

        this.health       = stage.defaults.health;
        this.wellbeing    = (wellbeing    !== null) ? wellbeing    : stage.defaults.health - 5;
        this.energy       = (energy       !== null) ? energy       : stage.defaults.energy;
        this.social       = (social       !== null) ? social       : stage.defaults.social;
        this.spirituality = (spirituality !== null) ? spirituality : stage.defaults.spirituality;
        this.documents    = (documents    !== null) ? documents    : stage.defaults.documents;
        this.home         = (home         !== null) ? home         : stage.defaults.home;

        this.lifeStage     = stage.name;
        this.characterName = stage.charName;
    }

    isUnder18() { return this.age < 18; }

    updateLifeStage() {
        this.previousLifeStage = this.lifeStage;
        const stage = getLifeStage(this.age);
        this.lifeStage     = stage.name;
        this.characterName = stage.charName;
        this.updateCharacterDisplay();
    }

    updateCharacterDisplay() {
        const cc   = document.getElementById("characterContainer");
        const info = document.getElementById("characterInfo");
        if (cc) {
            cc.classList.remove("child", "teenager", "adult", "elderly");
            const stage = getLifeStage(this.age);
            cc.classList.add(stage.cssClass);
        }
        if (info) {
            const diff     = this.age - this.bioAge;
            const diffAbs  = Math.abs(diff).toFixed(1);
            const chipCls  = diff > 0.5 ? "good" : diff < -0.5 ? "bad" : "neutral";
            const chipText = diff > 0.5
                ? diffAbs + " v nuorempi biologisesti"
                : diff < -0.5
                    ? diffAbs + " v vanhempi biologisesti"
                    : "Biologinen ika normaali";
            info.innerHTML =
                "<div>" + this.characterName + " &middot; <strong>" + this.lifeStage + "</strong></div>" +
                "<div style='color:var(--text-muted);font-size:0.78rem;margin-top:2px;'>" +
                "Fyysinen ika: <strong style='color:var(--text)'>" + this.age + " v</strong> &nbsp;|&nbsp; " +
                "Biologinen: <strong style='color:var(--text)'>" + this.bioAge.toFixed(1) + " v</strong>" +
                "</div>" +
                "<span class='bioAge-delta " + chipCls + "'>" + chipText + "</span>";
        }
    }

    ageCharacter() {
        this.age++;
        let agingRate = 1.0;

        if (this.health      > 70) agingRate -= 0.20;
        if (this.wellbeing   > 70) agingRate -= 0.15;
        if (this.knowledge   > 50) agingRate -= 0.10;
        if (this.social      > 60) agingRate -= 0.20;
        if (this.spirituality> 70) agingRate -= 0.10;
        if (this.documents   > 70) agingRate -= 0.05;
        if (this.home        > 70) agingRate -= 0.10;

        if (this.health    < 40)   agingRate += 0.30;
        if (this.wellbeing < 30)   agingRate += 0.25;
        if (this.money     < 20)   agingRate += 0.20;
        if (this.social    < 30)   agingRate += 0.25;
        if (this.spirituality < 30)agingRate += 0.15;
        if (this.documents < 30)   agingRate += 0.10;
        if (this.home      < 30)   agingRate += 0.15;

        this.totalBioAgeGained += (agingRate - 1.0);
        this.bioAge = Math.max(0, this.bioAge + agingRate);
        this.updateLifeStage();

        if (this.age > 40) this.health -= Math.random() * 1.5 + 0.5;
        if (this.age > 60) this.health -= Math.random() * 2.0 + 1.0;

        if (this.bioAge >= 100 || this.health <= 0 || this.wellbeing <= 0) {
            this.alive = false;
        }
    }
}

// ============================================================
//  TOIMINNOT
// ============================================================
function getActions(character) {
    return {
        "Terveystarkastus": {
            cost: character.isUnder18() ? 0 : 30, energy: -10,
            health: 15, wellbeing: 5, bioAge: -0.3,
            animation: "medical", visual: "medical",
            effects: "Terveys +15, Hyvinvointi +5",
            tag: "health",
            tip: "Saannolliset terveystarkastukset auttavat havaitsemaan sairaudet ajoissa - yksi tehokkaimmista ennaltaehkaisyn keinoista."
        },
        "Liikunta": {
            cost: 0, energy: -20,
            health: 10, wellbeing: 8, bioAge: -0.4,
            animation: "exercise", visual: "exercise",
            effects: "Terveys +10, Hyvinvointi +8",
            tag: "health",
            tip: "Tutkimus: Saannollinen liikunta lisaa elinajanodotetta jopa 7 vuotta. Yli 40 min/pv voi lisata tervetta elinikaa jopa 9 vuotta. (NIH, Live Science 2026)"
        },
        "Terveellinen ruokavalio": {
            cost: character.isUnder18() ? 0 : 15, energy: -5,
            health: 10, wellbeing: 5, bioAge: -0.3,
            animation: "eat",
            effects: "Terveys +10, Hyvinvointi +5",
            tag: "health",
            tip: "Valimeren ruokavalio pienentaa kuolleisuusriskia jopa 23 % - 25 vuoden seurannassa se suojasi syovalta ja sydansairauksilta. (Harvard Gazette, 2024)"
        },
        "Laakkeet": {
            cost: 25, energy: -5,
            health: 12, wellbeing: 3, bioAge: -0.25,
            animation: "medical",
            effects: "Terveys +12, Hyvinvointi +3",
            tag: "health",
            tip: "Oikea laakehoito on osa terveydenhuoltoa - mutta laakkeet eivat korvaa liikuntaa tai ravintoa pitkaikaisvaikutuksiltaan."
        },
        "Laaketieteellinen tutkimus": {
            cost: 80, energy: -30,
            health: 20, bioAge: -0.8,
            animation: "medical",
            effects: "Terveys +20",
            tag: "health",
            tip: "Erikoisselvitykset voivat paljastaa piilevat sairaudet ennen oireita - varhaishoito parantaa ennustetta merkittavasti."
        },
        "Meditaatio": {
            cost: 0, energy: -15,
            health: 5, wellbeing: 12, spirituality: 15, bioAge: -0.15,
            animation: "rest",
            effects: "Terveys +5, Hyvinvointi +12, Hengellisyys +15",
            tag: "mind",
            tip: "Pitkaaikaismeditaatio on yhteydessa pidempiin telomeereihin - solujen ikaantymisen biomarkkeri. Vahentaa stressia ja tulehdusta. (Nature Scientific Reports, 2020)"
        },
        "Opiskelu": {
            cost: character.isUnder18() ? 0 : 20, energy: -25,
            knowledge: 15, wellbeing: -5, bioAge: -0.1,
            animation: "study", visual: "study",
            effects: "Tietamys +15, Hyvinvointi -5",
            tag: "mind",
            tip: "Kognitiivinen aktiivisuus rakentaa kognitiivista reservia, joka suojaa muistisairauksilta iakkaana."
        },
        "Rukous": {
            cost: 0, energy: -10,
            spirituality: 20, wellbeing: 10, bioAge: -0.2,
            animation: "rest",
            effects: "Hengellisyys +20, Hyvinvointi +10",
            tag: "mind",
            tip: "Uskonnolliseen yhteisoon kuuluminen on yhteydessa pienempaan kuolleisuusriskiin - mekanismina tarkoituksentunne ja sosiaalinen tuki. (NCBI, 2023)"
        },
        "Harrastukset": {
            cost: 15, energy: -20,
            wellbeing: 18, bioAge: -0.1,
            animation: "hobby",
            effects: "Hyvinvointi +18",
            tag: "mind",
            tip: "Mielekkat harrastukset yllapitavat tarkoituksentunnetta - elamantarkoituksen puute kasvattaa kuolleisuusriskia 2,4-kertaiseksi. (Mind and Brain Institute)"
        },
        "Ystavaen tapaaminen": {
            cost: 10, energy: -15,
            social: 15, wellbeing: 12, bioAge: -0.45,
            animation: "social",
            effects: "Sosiaaliset siteet +15, Hyvinvointi +12",
            tag: "social",
            tip: "Hyvat sosiaaliset suhteet nostavat selviytymistodennakoisyyttа 50 %. Yksinaisyys on yhta vaarallista kuin 15 savukkeen polttaminen paivassa. (Holt-Lunstad, Surgeon General USA)"
        },
        "Perheen kanssa": {
            cost: 0, energy: -10,
            social: 10, wellbeing: 15, home: 5, bioAge: -0.50,
            animation: "family",
            effects: "Sosiaaliset siteet +10, Hyvinvointi +15, Koti +5",
            tag: "social",
            tip: "Laheiset perhesuhteet ovat yksi vahvimmista pitkaikaisyyden ennustajista - erityisesti yli 65-vuotiailla. (Lancet Healthy Longevity, 2024)"
        },
        "Tyo": {
            cost: 0, energy: -30,
            money: 50, wellbeing: -10, bioAge: 0.1,
            animation: "work", visual: "work",
            effects: "Raha +50, Hyvinvointi -10",
            tag: "work",
            tip: "Krooninen tyokuormitus kiihdyttaa biologista ikaantymista. Tasapaino tyon ja levon valilla on keskeista pitkaikaisyydelle."
        },
        "Loma": {
            cost: 40, energy: 20,
            wellbeing: 20, home: 10, bioAge: -0.2,
            animation: "rest",
            effects: "Energia +20, Hyvinvointi +20, Koti +10",
            tag: "lifestyle",
            tip: "Saannollinen palautuminen suojaa sydanta ja parantaa immunijaarjestelmaa. Stressi nostaa kortisolia, joka kiihdyttaa solujen ikaantymista."
        },
        "Asiakirjojen jarjestaminen": {
            cost: 0, energy: -15,
            documents: 20, wellbeing: 5, bioAge: -0.1,
            animation: "study",
            effects: "Asiakirjat +20, Hyvinvointi +5",
            tag: "lifestyle",
            tip: "Elamanhallinta ja varautuminen tulevaan vahentavat stressia - krooninen stressi on yksi keskeisista biologisen ikaantymisen kiihdyttajista."
        },
        "Kunnostaminen": {
            cost: 100, energy: -30,
            home: 25, wellbeing: 15, bioAge: -0.2,
            animation: "work",
            effects: "Koti +25, Hyvinvointi +15",
            tag: "lifestyle",
            tip: "Laadukas asuinymparisto tukee fyysista ja psyykkista hyvinvointia - arjen elinymparisto vaikuttaa paivittaisiin terveystottumuksiin."
        },
        "Geeniterapia": {
            cost: 200, energy: -40,
            health: 30, bioAge: -1.5,
            animation: "special",
            effects: "Terveys +30",
            tag: "special",
            tip: "Geeniterapia on nopeasti kehittyva ala - jo nyt kokeillaan interventioita, jotka voivat hidastaa solujen ikaantymista suoraan DNA-tasolla."
        },
        "Nuoruuden lahde": {
            cost: 500, energy: -20,
            health: 25, bioAge: -2.0,
            achievement: "Nuoruuden lahde loydetty!",
            animation: "special",
            effects: "Terveys +25, Saavutus!",
            tag: "special",
            tip: "Viitteellinen: edustaa tulevaisuuden longevity-interventioita kuten senolyytit, NAD+ ja telomeraasi-tutkimus."
        },
        "Tupakointi": {
            cost: 5, energy: 5,
            health: -18, wellbeing: -8, bioAge: 1.2,
            animation: "bad",
            effects: "Terveys -18, Hyvinvointi -8",
            tag: "harmful",
            tip: "VAROITUS: Jokainen savuke vie 17-22 minuuttia elinajasta. Tupakointi lyhentaa elinikaa keskimaarin 7-10 vuotta. Lopettaminen ennen 40 v palauttaa lahes tayden elinajanodotteen. (CNN, 2025)"
        },
        "Alkoholi": {
            cost: 10, energy: -5,
            health: -12, wellbeing: -3, bioAge: 0.6,
            animation: "bad",
            effects: "Terveys -12, Hyvinvointi -3",
            tag: "harmful",
            tip: "VAROITUS: Ei ole olemassa turvallista alkoholin kayttotasoa terveyden kannalta. Uusin tutkimus kumoaa 'kohtuukaytto on terveeellista' -myytин. (BMC Medicine, 2023)"
        },
        "Junk food": {
            cost: 5, energy: 5,
            health: -10, wellbeing: 5, bioAge: 0.3,
            animation: "eat",
            effects: "Terveys -10, Hyvinvointi +5",
            tag: "harmful",
            tip: "VAROITUS: Ultraprosessoitu ruoka lisaa tulehdusta, hairitsee suolistomikrobiomia ja on yhteydessa lyhyempiin telomeereihin. Lyhytaikainen hyvа olo, pitkaikainen haitta."
        }
    };
}

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

        if (startButton)    startButton.addEventListener("click",   () => this.showCharacterSetup());
        if (setupForm)      setupForm.addEventListener("submit",    (e) => { e.preventDefault(); this.handleCharacterSetup(e); });
        if (nextYearButton) nextYearButton.addEventListener("click", () => this.nextYear());
        if (restartButton)  restartButton.addEventListener("click",  () => this.restart());

        if (ageInput) {
            ageInput.addEventListener("input", (e) => {
                const age = parseInt(e.target.value) || 0;
                const el  = document.getElementById("startingMoney");
                if (el) el.textContent = (age * 500).toLocaleString("fi-FI");

                // Nayta tunnistettu ikaryhmа reaaliajassa
                const preview = document.getElementById("stagePreview");
                if (preview) {
                    const s = getLifeStage(age);
                    preview.textContent = "Tunnistettu ikaryhmа: " + s.name;
                }
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
        sliders.forEach(function(s) {
            const input = document.getElementById(s.id);
            const val   = document.getElementById(s.valueId);
            if (input && val) {
                input.addEventListener("input", function(e) { val.textContent = e.target.value; });
            }
        });
    }

    showCharacterSetup() {
        document.getElementById("instructions").classList.add("hidden");
        document.getElementById("characterSetup").classList.remove("hidden");
        const age = parseInt(document.getElementById("playerAge").value) || 0;
        const el  = document.getElementById("startingMoney");
        if (el) el.textContent = (age * 500).toLocaleString("fi-FI");
        // Nakyta ikaryhmа heti
        const preview = document.getElementById("stagePreview");
        if (preview) {
            const s = getLifeStage(age);
            preview.textContent = "Tunnistettu ikaryhmа: " + s.name;
        }
    }

    handleCharacterSetup(e) {
        e.preventDefault();
        const age          = parseInt(document.getElementById("playerAge").value)          || 0;
        const wellbeing    = parseInt(document.getElementById("playerWellbeing").value)    || null;
        const energy       = parseInt(document.getElementById("playerEnergy").value)       || null;
        const social       = parseInt(document.getElementById("playerSocial").value)       || null;
        const spirituality = parseInt(document.getElementById("playerSpirituality").value) || null;
        const documents    = parseInt(document.getElementById("playerDocuments").value)    || null;
        const home         = parseInt(document.getElementById("playerHome").value)         || null;

        this.character       = new Character(age, wellbeing, energy, social, spirituality, documents, home);
        this.year            = 0;
        this.selectedActions = {};

        document.getElementById("characterSetup").classList.add("hidden");
        document.getElementById("gameArea").classList.remove("hidden");

        this.character.updateCharacterDisplay();
        this.updateStatus();
        this.renderActions();

        const stage = getLifeStage(age);
        this.addLogEntry("Peli alkaa! Olet " + age + "-vuotias. Rahaa: " + this.character.money.toLocaleString("fi-FI") + " e", "success");
        this.addLogEntry("Tunnistettu ikaryhmа: " + stage.name + " (" + stage.minAge + "-" + stage.maxAge + " v)", "stage");
        this.addLogEntry(stage.intro, "stage");
    }

    // ── Elinaika-ennuste ────────────────────────────────────
    // Perustaso: suomalainen elinajanodote ~82 v (THL)
    estimateLifeExpectancy() {
        const c   = this.character;
        let base  = 82;

        // Terveys: +-6 v
        base += (c.health - 70) / 100 * 6;
        // Sosiaaliset suhteet: +-5 v (Holt-Lunstad: 50 % selviytymisbonus)
        base += (c.social - 50) / 100 * 5;
        // Hyvinvointi / mielenterveys: +-4 v
        base += (c.wellbeing - 60) / 100 * 4;
        // Hengellisyys / tarkoituksentunne: +-3 v (MIDUS-tutkimus)
        base += (c.spirituality - 50) / 100 * 3;
        // Kognitiivinen aktiivisuus: +-2 v
        base += (c.knowledge - 40) / 100 * 2;
        // Taloudellinen turvallisuus: +-3 v
        const moneyScore = Math.min(100, c.money / 200);
        base += (moneyScore - 50) / 100 * 3;
        // Biologinen ika -korjaus
        const bioCorrection = c.age - c.bioAge;
        base += bioCorrection * 0.5;

        return Math.min(105, Math.max(c.age + 1, Math.round(base)));
    }

    // ── Statuspaneeli ───────────────────────────────────────
    updateStatus() {
        const statusInfo = document.getElementById("statusInfo");
        if (!statusInfo) return;

        const c           = this.character;
        const diff        = c.age - c.bioAge;
        const years       = Math.abs(diff).toFixed(1);
        const yearChipCls = diff > 0 ? "gained" : "lost";
        const yearChipTxt = diff > 0 ? ("+" + years + " v voitettu") : ("-" + years + " v havitty");

        const items = [
            { label: "Pelin vuosi",        icon: "Vuosi",    value: this.year,    bar: false },
            { label: "Elamavaihe",         icon: "Vaihe",    value: c.lifeStage,  bar: false },
            { label: "Terveys",            icon: "Terveys",  value: c.health,     cls: "healthBar",       max: 100 },
            { label: "Hyvinvointi",        icon: "Hyvoinv",  value: c.wellbeing,  cls: "wellbeingBar",    max: 100 },
            { label: "Rahat",              icon: "Raha",     value: c.money.toLocaleString("fi-FI") + " e", bar: false },
            { label: "Energia",            icon: "Energia",  value: c.energy,     cls: "energyBar",       max: 100 },
            { label: "Tietamys",           icon: "Tieto",    value: c.knowledge,  cls: "knowledgeBar",    max: 100 },
            { label: "Sosiaaliset siteet", icon: "Sos",      value: c.social,     cls: "socialBar",       max: 100 },
            { label: "Hengellisyys",       icon: "Heng",     value: c.spirituality,cls: "spiritualityBar", max: 100 },
            { label: "Asiakirjat",         icon: "Asiak",    value: c.documents,  cls: "documentsBar",    max: 100 },
            { label: "Koti",               icon: "Koti",     value: c.home,       cls: "homeBar",         max: 100 }
        ];

        statusInfo.innerHTML = items.map(function(item) {
            if (item.bar === false) {
                return "<div class='statusItem'>" +
                    "<strong>" + item.label + "</strong>" +
                    "<span style='color:var(--text);font-weight:700;'>" + item.value + "</span>" +
                    "</div>";
            }
            const pct = Math.min(100, Math.max(0, item.value));
            return "<div class='statusItem'>" +
                "<strong>" + item.label +
                "<span class='statusValue'>" + parseFloat(item.value).toFixed(1) + "/100</span></strong>" +
                "<div class='statusBar'><div class='statusBarFill " + item.cls + "' style='width:" + pct + "%'></div></div>" +
                "</div>";
        }).join("");

        // Biologinen ika + elinaika-ennuste
        const lifeExp   = this.estimateLifeExpectancy();
        const yearsLeft = Math.max(0, lifeExp - c.age);
        const expColor  = lifeExp >= 85 ? "var(--green)" : lifeExp >= 75 ? "var(--yellow)" : "var(--red)";
        const expBar    = Math.min(100, Math.round((lifeExp / 105) * 100));

        statusInfo.innerHTML +=
            "<div class='statusItem' style='grid-column:1/-1; border-color:var(--accent);'>" +
            "<strong>Biologinen ika vs. fyysinen ika</strong>" +
            "<div style='display:flex;align-items:center;gap:10px;margin-top:4px;'>" +
            "<span style='font-size:0.82rem;color:var(--text-muted);'>Fyysinen: <strong style='color:var(--text)'>" + c.age + " v</strong></span>" +
            "<span style='font-size:0.82rem;color:var(--text-muted);'>Biologinen: <strong style='color:var(--text)'>" + c.bioAge.toFixed(1) + " v</strong></span>" +
            "<span class='years-chip " + yearChipCls + "'>" + yearChipTxt + "</span>" +
            "</div></div>" +

            "<div class='statusItem' style='grid-column:1/-1; border-color:" + expColor + ";'>" +
            "<strong>Elinaika-ennuste" +
            "<span style='margin-left:auto;font-size:0.85rem;color:" + expColor + ";font-weight:700;'>" + lifeExp + " vuotta</span></strong>" +
            "<div class='statusBar' style='margin-top:6px;'>" +
            "<div class='statusBarFill' style='width:" + expBar + "%;background:linear-gradient(90deg," + expColor + "," + expColor + "88);'></div></div>" +
            "<div style='display:flex;justify-content:space-between;margin-top:4px;font-size:0.75rem;color:var(--text-muted);'>" +
            "<span>Nyt: " + c.age + " v</span>" +
            "<span>Arviolta <strong style='color:" + expColor + "'>" + yearsLeft + " vuotta</strong> jaljelла</span>" +
            "<span>Ennuste: " + lifeExp + " v</span>" +
            "</div></div>";

        if (c.achievements.length > 0) {
            statusInfo.innerHTML += "<div class='statusItem achievement' style='grid-column:1/-1'>" +
                "<strong>Saavutukset</strong>" + c.achievements.join(" / ") + "</div>";
        }

        if (c.bioAge < c.age - 10) this.addLogEntry("Biologinen ikasi on paljon alhaisempi - loistavia valintoja!", "success");
        if (c.wellbeing < 20)       this.addLogEntry("VAROITUS: Hyvinvointisi on kriittisen alhainen!", "warning");
        if (c.health < 30)          this.addLogEntry("VAROITUS: Terveytesi on heikko - hakeudu hoitoon!", "warning");
        if (c.social < 20)          this.addLogEntry("VAROITUS: Olet eristynyt - yksinaisyys on yhtа vaarallista kuin tupakointi!", "warning");
    }

    // ── Toimintojen renderainti ─────────────────────────────
    renderActions() {
        const actionsList = document.getElementById("actionsList");
        if (!actionsList) return;
        actionsList.innerHTML = "";

        const actions = getActions(this.character);
        const self    = this;

        for (const name in actions) {
            const d     = actions[name];
            const count = self.selectedActions[name] || 0;
            const disabled = self.character.money < (d.cost || 0) ||
                             self.character.energy < Math.abs(d.energy || 0);

            const container = document.createElement("div");
            container.className = "actionContainer";

            const btn = document.createElement("button");
            btn.className = "actionButton";
            if      (count >= 3) btn.classList.add("selected-thrice");
            else if (count >= 2) btn.classList.add("selected-twice");
            else if (count >= 1) btn.classList.add("selected-once");
            btn.disabled = disabled;

            const tagLabel = self.tagLabel(d.tag);
            const costLabel = (d.cost || 0) + "e / " + (d.energy || 0) + " E";
            let labelHtml = "<span class='action-tag tag-" + d.tag + "'>" + tagLabel + "</span><br>" + name;
            if (self.character.isUnder18() && ["Terveellinen ruokavalio","Opiskelu","Terveystarkastus"].includes(name)) {
                labelHtml += " <span style='color:var(--green);font-size:0.7rem'>(ILMAINEN)</span>";
            }
            if (count > 0) labelHtml += " <span class='actionCounter'>" + count + "</span>";

            btn.innerHTML = "<span class='btn-label'>" + labelHtml + "</span>" +
                            "<span class='btn-cost'>" + costLabel + "</span>";

            btn.addEventListener("click", (function(n, anim, vis) {
                return function() { self.toggleAction(n, anim, vis); };
            })(name, d.animation, d.visual));

            const effects = document.createElement("div");
            effects.className = "actionEffects";
            effects.textContent = d.effects;

            const tip = document.createElement("div");
            tip.className = "actionTooltip";
            tip.textContent = d.tip;

            container.append(btn, effects, tip);
            actionsList.appendChild(container);
        }
    }

    tagLabel(tag) {
        const map = {
            health: "Terveys", social: "Sosiaalisuus", mind: "Mieli",
            work: "Tyo", lifestyle: "Elamantapa", harmful: "Haitallinen", special: "Erikois"
        };
        return map[tag] || tag;
    }

    toggleAction(actionName, animation, visual) {
        if (!this.selectedActions[actionName]) this.selectedActions[actionName] = 0;
        this.selectedActions[actionName]++;
        this.addLogEntry("Valittu: " + actionName + " (" + this.selectedActions[actionName] + "x)");
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
        cc.classList.add("character-" + type);
        if (visual) cc.classList.add("show-" + visual);
        setTimeout(function() {
            cc.classList.remove("character-" + type);
            if (visual) cc.classList.remove("show-" + visual);
        }, 800);
    }

    forceClearActionSelection() {
        document.querySelectorAll(".actionButton").forEach(function(btn) {
            btn.classList.remove("selected-once","selected-twice","selected-thrice");
            const counter = btn.querySelector(".actionCounter");
            if (counter) counter.remove();
        });
        const cc = document.getElementById("characterContainer");
        if (cc) cc.classList.remove("show-medical","show-exercise","show-study","show-work");
    }

    // ── Satunnaiset tapahtumat ──────────────────────────────
    randomEvent() {
        const events = [
            { name: "Sairastuminen",        health: -15, wellbeing: -10, bioAge: 0.2 },
            { name: "Tapaturma",            health: -20, wellbeing: -15, money: -50 },
            { name: "Perinto",              money: 150, wellbeing: 10 },
            { name: "Uusi ystavа",          social: 20, wellbeing: 15 },
            { name: "Tyotarjous",           money: 100, energy: -20 },
            { name: "Laheisen menetys",     social: -25, wellbeing: -20, bioAge: 0.3 },
            { name: "Merkittava loyto",     money: 50, knowledge: 15 },
            { name: "Henkinen heratys",     spirituality: 25, wellbeing: 20, bioAge: -0.2 },
            { name: "Kotivarkaus",          home: -30, wellbeing: -20 },
            { name: "Lottovoitto",          money: 300, wellbeing: 25 },
            { name: "Urakehitys",           money: 200, energy: -30 },
            { name: "Matka ulkomaille",     wellbeing: 30, money: -120, knowledge: 10 },
            { name: "Uusi harrastus",       wellbeing: 20, money: -50 },
            { name: "Perhejuhla",           social: 30, wellbeing: 25, home: 15 },
            { name: "Henkinen kriisi",      spirituality: -30, wellbeing: -25 },
            { name: "Verenpainetauti",      health: -25, wellbeing: -15, bioAge: 0.3 },
            { name: "Meditaatio-retreatti", spirituality: 30, wellbeing: 20, money: -100, bioAge: -0.3 },
            { name: "Kodin remontti",       home: 30, money: -200 },
            { name: "Ystavа muuttaa pois",  social: -20, wellbeing: -15 },
            { name: "Tyonmenetys",          money: -150, wellbeing: -25 },
            { name: "Henkinen valaistuminen", spirituality: 40, wellbeing: 30, bioAge: -0.5 },
            { name: "Uusi perheenjasen",    social: 25, wellbeing: 20, money: -100 },
            { name: "Vapaaehtoistoiminta",  social: 20, wellbeing: 25, spirituality: 10 },
            { name: "Digitaalinen detox",   wellbeing: 15, social: -5 },
            { name: "Liikuntavamma",        health: -15, energy: -20 }
        ];

        if (Math.random() < 0.4) {
            const ev = events[Math.floor(Math.random() * events.length)];
            this.addLogEntry("TAPAHTUMA: " + ev.name, "event");
            for (const k in ev) {
                if (k !== "name" && k in this.character) {
                    this.character[k] += ev[k];
                }
            }
        }
    }

    // ── Ikaspecifinen viisaus ───────────────────────────────
    showStageWisdom() {
        const category = getStageCategory(this.character.age);
        const wisdoms  = STAGE_WISDOM[category];
        if (!wisdoms) return;
        const w = wisdoms[Math.floor(Math.random() * wisdoms.length)];
        this.addLogEntry(w, "stage");
    }

    // ── Seuraava vuosi ──────────────────────────────────────
    nextYear() {
        const actions = getActions(this.character);
        for (const name in this.selectedActions) {
            const count = this.selectedActions[name];
            const a     = actions[name];
            if (!a) continue;
            for (let i = 0; i < count; i++) {
                this.character.money        -= (a.cost         || 0);
                this.character.energy       += (a.energy       || 0);
                this.character.health       += (a.health       || 0);
                this.character.wellbeing    += (a.wellbeing    || 0);
                this.character.knowledge    += (a.knowledge    || 0);
                this.character.social       += (a.social       || 0);
                this.character.spirituality += (a.spirituality || 0);
                this.character.documents    += (a.documents    || 0);
                this.character.home         += (a.home         || 0);
                this.character.bioAge       += (a.bioAge       || 0);
                if (a.achievement) {
                    this.character.achievements.push(a.achievement);
                    this.addLogEntry("Saavutus: " + a.achievement, "success");
                }
            }
        }

        this.selectedActions = {};
        this.forceClearActionSelection();
        this.randomEvent();

        const prevStage = this.character.lifeStage;
        this.character.ageCharacter();
        this.year++;

        this.character.energy = Math.min(100, this.character.energy + 30);

        const clamp = function(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
        this.character.wellbeing    = clamp(this.character.wellbeing,    0, 100);
        this.character.health       = clamp(this.character.health,       0, 100);
        this.character.energy       = clamp(this.character.energy,       0, 100);
        this.character.social       = clamp(this.character.social,       0, 100);
        this.character.knowledge    = Math.max(0, this.character.knowledge);
        this.character.spirituality = clamp(this.character.spirituality, 0, 100);
        this.character.documents    = clamp(this.character.documents,    0, 100);
        this.character.home         = clamp(this.character.home,         0, 100);

        if (this.character.lifeStage !== prevStage) {
            this.addLogEntry("Siirryt elamavaiheeseen: " + this.character.lifeStage, "stage");
            this.showStageWisdom();
        } else if (this.year % 5 === 0) {
            this.showStageWisdom();
        }

        this.updateStatus();
        this.renderActions();

        if (!this.character.alive) this.gameOver();
    }

    addLogEntry(message, type) {
        const log = document.getElementById("logContent");
        if (!log) return;
        const entry = document.createElement("div");
        entry.className = "logEntry" + (type ? (" " + type) : "");
        entry.textContent = "[Vuosi " + this.year + "] " + message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    // ── Peli paattyy ───────────────────────────────────────
    gameOver() {
        document.getElementById("gameArea").classList.add("hidden");
        document.getElementById("gameOverScreen").classList.remove("hidden");

        const c    = this.character;
        const diff = (c.age - c.bioAge).toFixed(1);
        const bio  = c.bioAge.toFixed(1);

        let msgClass = "poor";
        let msg      = "";
        if      (c.age > 90) { msgClass = "great"; msg = "Loistava suoritus! Elit pitkan ja tayden elaman!"; }
        else if (c.age > 75) { msgClass = "good";  msg = "Hyva suoritus! Saavutit korkean ian!"; }
        else if (c.age > 55) { msgClass = "ok";    msg = "Kohtalainen suoritus - ensi kerralla terveellisempian valintoja!"; }
        else                  {                      msg = "Elamasi oli lyhyt. Muista: sosiaalisuus, liikunta ja hyva ravinto ovat tarkeimpian."; }

        const bioNote = parseFloat(diff) > 0
            ? "Tekemasi valinnat hidastivat biologista ikaantymista - biologinen ikasi oli " + diff + " vuotta fyysista ikaaasi alhaisempi!"
            : "Biologinen ikasi oli " + Math.abs(parseFloat(diff)).toFixed(1) + " vuotta fyysista ikaaasi korkeampi - haitalliset valinnat kiihdyttivat ikaantymista.";

        document.getElementById("finalStats").innerHTML =
            "<p><strong>Kuolit " + c.age + " vuotiaana</strong> (biologinen ika " + bio + " v)</p>" +
            "<p>Peli kesti <strong>" + this.year + " vuotta</strong></p>" +
            "<p>" + bioNote + "</p>" +
            "<p>Loppu hyvinvointi: <strong>" + c.wellbeing.toFixed(1) + "/100</strong></p>" +
            "<p>Loppu terveys: <strong>" + c.health.toFixed(1) + "/100</strong></p>" +
            "<p>Loppu sosiaaliset siteet: <strong>" + c.social.toFixed(1) + "/100</strong></p>" +
            "<p>Loppu rahat: <strong>" + c.money.toLocaleString("fi-FI") + " e</strong></p>" +
            (c.achievements.length ? "<p>Saavutukset: <strong>" + c.achievements.join(", ") + "</strong></p>" : "") +
            "<div class='final-message " + msgClass + "'>" + msg + "</div>" +
            "<p style='margin-top:14px;font-size:0.75rem;color:var(--text-dim);'>" +
            "Huom: Tama on pelisimulaatio. Luvut perustuvat julkaistuun tutkimukseen, mutta ovat yksinkertaistettuja." +
            "</p>";
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

// ── Kaynnistys ─────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", function() { new Game(); });
            { name: "Digitaalinen detox",   wellbeing: 15, social: -5 },
            { name: "Liikuntavamma",        health: -15, energy: -20 }
        ];

        if (Math.random() < 0.4) {
            const ev = events[Math.floor(Math.random() * events.length)];
            this.addLogEntry("TAPAHTUMA: " + ev.name, "event");
            for (const k in ev) {
                if (k !== "name" && k in this.character) {
                    this.character[k] += ev[k];
                }
            }
        }
    }

    showStageWisdom() {
        const category = getStageCategory(this.character.age);
        const wisdoms  = STAGE_WISDOM[category];
        if (!wisdoms) return;
        const w = wisdoms[Math.floor(Math.random() * wisdoms.length)];
        this.addLogEntry(w, "stage");
    }

    nextYear() {
        const actions = getActions(this.character);
        for (const name in this.selectedActions) {
            const count = this.selectedActions[name];
            const a     = actions[name];
            if (!a) continue;
            for (let i = 0; i < count; i++) {
                this.character.money        -= (a.cost         || 0);
                this.character.energy       += (a.energy       || 0);
                this.character.health       += (a.health       || 0);
                this.character.wellbeing    += (a.wellbeing    || 0);
                this.character.knowledge    += (a.knowledge    || 0);
                this.character.social       += (a.social       || 0);
                this.character.spirituality += (a.spirituality || 0);
                this.character.documents    += (a.documents    || 0);
                this.character.home         += (a.home         || 0);
                this.character.bioAge       += (a.bioAge       || 0);
                if (a.achievement) {
                    this.character.achievements.push(a.achievement);
                    this.addLogEntry("Saavutus: " + a.achievement, "success");
                }
            }
        }
        this.selectedActions = {};
        this.forceClearActionSelection();
        this.randomEvent();

        const prevStage = this.character.lifeStage;
        this.character.ageCharacter();
        this.year++;

        this.character.energy = Math.min(100, this.character.energy + 30);

        const clamp = function(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
        this.character.wellbeing    = clamp(this.character.wellbeing,    0, 100);
        this.character.health       = clamp(this.character.health,       0, 100);
        this.character.energy       = clamp(this.character.energy,       0, 100);
        this.character.social       = clamp(this.character.social,       0, 100);
        this.character.knowledge    = Math.max(0, this.character.knowledge);
        this.character.spirituality = clamp(this.character.spirituality, 0, 100);
        this.character.documents    = clamp(this.character.documents,    0, 100);
        this.character.home         = clamp(this.character.home,         0, 100);

        if (this.character.lifeStage !== prevStage) {
            this.addLogEntry("Siirryt elamavaiheeseen: " + this.character.lifeStage, "stage");
            this.showStageWisdom();
        } else if (this.year % 5 === 0) {
            this.showStageWisdom();
        }

        this.updateStatus();
        this.renderActions();
        if (!this.character.alive) this.gameOver();
    }

    addLogEntry(message, type) {
        const log = document.getElementById("logContent");
        if (!log) return;
        const entry = document.createElement("div");
        entry.className = "logEntry" + (type ? (" " + type) : "");
        entry.textContent = "[Vuosi " + this.year + "] " + message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    gameOver() {
        document.getElementById("gameArea").classList.add("hidden");
        document.getElementById("gameOverScreen").classList.remove("hidden");

        const c    = this.character;
        const diff = (c.age - c.bioAge).toFixed(1);
        const bio  = c.bioAge.toFixed(1);

        let msgClass = "poor";
        let msg      = "";
        if      (c.age > 90) { msgClass = "great"; msg = "Loistava suoritus! Elit pitkan ja tayden elaman!"; }
        else if (c.age > 75) { msgClass = "good";  msg = "Hyva suoritus! Saavutit korkean ian!"; }
        else if (c.age > 55) { msgClass = "ok";    msg = "Kohtalainen suoritus - ensi kerralla terveellisempian valintoja!"; }
        else                  {                      msg = "Elamasi oli lyhyt. Muista: sosiaalisuus, liikunta ja hyva ravinto ovat tarkeimpian."; }

        const bioNote = parseFloat(diff) > 0
            ? "Tekemasi valinnat hidastivat biologista ikaantymista - biologinen ikasi oli " + diff + " vuotta fyysista alempi!"
            : "Biologinen ikasi oli " + Math.abs(parseFloat(diff)).toFixed(1) + " vuotta fyysista korkeampi - haitalliset valinnat kiihdyttivat ikaantymista.";

        document.getElementById("finalStats").innerHTML =
            "<p><strong>Kuolit " + c.age + " vuotiaana</strong> (biologinen ika " + bio + " v)</p>" +
            "<p>Peli kesti <strong>" + this.year + " vuotta</strong></p>" +
            "<p>" + bioNote + "</p>" +
            "<p>Loppu hyvinvointi: <strong>" + c.wellbeing.toFixed(1) + "/100</strong></p>" +
            "<p>Loppu terveys: <strong>" + c.health.toFixed(1) + "/100</strong></p>" +
            "<p>Loppu sosiaaliset siteet: <strong>" + c.social.toFixed(1) + "/100</strong></p>" +
            "<p>Loppu rahat: <strong>" + c.money.toLocaleString("fi-FI") + " e</strong></p>" +
            (c.achievements.length ? "<p>Saavutukset: <strong>" + c.achievements.join(", ") + "</strong></p>" : "") +
            "<div class='final-message " + msgClass + "'>" + msg + "</div>" +
            "<p style='margin-top:14px;font-size:0.75rem;color:var(--text-dim);'>" +
            "Huom: Tama on pelisimulaatio. Luvut perustuvat julkaistuun tutkimukseen, mutta ovat yksinkertaistettuja." +
            "</p>";
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

window.addEventListener("DOMContentLoaded", function() { new Game(); });
nt.getElementById("instructions").classList.remove("hidden");
        document.getElementById("characterSetup").classList.add("hidden");
        document.getElementById("logContent").innerHTML = "";
        this.character       = new Character();
        this.year            = 0;
        this.selectedActions = {};
    }
}

window.addEventListener("DOMContentLoaded", function() { new Game(); });
