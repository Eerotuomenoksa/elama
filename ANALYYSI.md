# Elämänkaaripeli – Analyysi ja kehitysehdotukset

## Pelin nykytila

Peli on selainpohjainen JavaScript-elämänsimulaattori, jossa pelaaja tekee vuosittaisia valintoja ja seuraa biologisen ikänsä kehittymistä. Peli on jo hyvä pohja, mutta siinä on merkittäviä puutteita opettavaisuuden kannalta.

---

## 1. Mitä tutkimus sanoo – ja kuinka hyvin peli vastaa todellisuutta

### Liikunta

**Tutkimusnäyttö:**  
Säännöllinen liikunta lisää elinajanodotetta 0,4–6,9 vuotta. Erittäin aktiiviset henkilöt (kuten huippu-urheilijat) voivat elää jopa 5 vuotta pidempään kuin väestö keskimäärin. Pienetkin muutokset – lisäämällä 40 minuuttia liikuntaa päivässä – voivat lisätä tervettä elinajanodotetta jopa 9 vuotta (Live Science, 2026).

**Pelin arvo:** `bioAge: -0.4` per liikuntavalinta → realistinen suuruusluokaltaan, mutta pelistä puuttuu tieto *miksi* liikunta auttaa (sydän-verisuoniterveys, solujen korjaus, matala tulehdus).

---

### Tupakointi

**Tutkimusnäyttö:**  
Tupakointi lyhentää elinikää keskimäärin 6,8–10 vuotta. Jokainen savuke vie 17–22 minuuttia elinajasta. Lopettaminen ennen 40 ikävuotta palauttaa lähes täyden elinajanodotteen (CNN, 2025; Journal of Japan, PMC).

**Pelin arvo:** `bioAge: +0.5` – biologinen ikä kasvaa vain 0,5 vuotta per vuosi tupakointia. Tämä on **liian lievä** – tutkimuksen mukaan vaikutus pitäisi olla selvästi suurempi (esim. +1–2 vuotta biologisesti per tupakointi vuosi), ja pelin tulisi näyttää, että nuorena lopettaminen on tehokas keino.

---

### Alkoholi

**Tutkimusnäyttö:**  
Uusin tutkimus (BMC Medicine, Springer) osoittaa, että ei ole olemassa turvallista alkoholin käyttötasoa terveyden kannalta. Edes kohtuullinen käyttö ei pidennä elinikää, ja raskas käyttö kasvattaa merkittävästi syövän ja sydänsairauksien riskiä.

**Pelin arvo:** `health: -10, wellbeing: +5` – **epärealistinen!** Peli kuvaa alkoholin antavan hyvinvointia (+5) ja vain kohtuullisen terveysvaikutuksen. Modernin tutkimuksen valossa alkoholin pitäisi olla selvästi haitallisempi, eikä sille pitäisi antaa positiivista hyvinvointibonusta pitkällä aikavälillä.

---

### Sosiaaliset suhteet

**Tutkimusnäyttö:**  
Holt-Lunstadin meta-analyysi (148 tutkimusta) osoittaa, että hyvät sosiaaliset suhteet nostavat selviytymistodennäköisyyttä 50 % verrattuna eristäytyneisiin. Yksinäisyys on yhtä vaarallista kuin 15 savukkeen polttaminen päivässä (U.S. Surgeon General). Lancet Healthy Longevity -tutkimus (2024) vahvistaa vaikutuksen globaalisti.

**Pelin arvo:** `bioAge: -0.15` – **liian varovainen**. Sosiaalisten suhteiden pitäisi olla yksi pelin tehokkaimmista tekijöistä, ei marginaalinen. Suositus: `bioAge: -0.5` tai enemmän.

---

### Meditaatio / Mindfulness

**Tutkimusnäyttö:**  
Pitkäaikaismeditaatio on yhteydessä pidempiin telomeereihin (solujen ikääntymisen biomarkkeri). Meditaatio vähentää stressiä ja tulehdusta. Vaikutus on todellinen mutta vaatii pitkäjänteisyyttä – tulokset eivät ole välittömiä (Nature Scientific Reports, 2020; Frontiers in Psychology, 2023).

**Pelin arvo:** Kohtuullisen realistinen. Meditaation vaikutus biologiseen ikään (`bioAge: -0.15`) on maltillinen, mikä vastaa tutkimusta.

---

### Terveellinen ruokavalio

**Tutkimusnäyttö:**  
Välimeren ruokavalio pienentää kuolleisuusriskiä jopa 23 % (Harvard Gazette, 2024; 25 vuoden seuranta). Se on yhteydessä pidempiin telomeereihin. Yhdistys sydänsairauksiin, syöpään ja neurodegeneratiivisiin sairauksiin on vahva (NCBI, 2021).

**Pelin arvo:** `bioAge: -0.2` – hieman vaatimaton, voisi olla `bioAge: -0.3` ja terveysbonus isompi.

---

### Elämäntarkoitus / Hengellisyys

**Tutkimusnäyttö:**  
Elämäntarkoituksen puute kasvattaa kuolleisuusriskiä 2,43-kertaiseksi verrattuna merkityksellisyyden kokeviin henkilöihin (Mind and Brain Institute). Uskonnollisuus ja hengellisyys ovat yhteydessä pienempään kuolleisuusriskiin välittäjinä toimivat tarkoituksentunne ja sosiaalinen tuki (NCBI, 2023).

**Pelin arvo:** Hengellisyys on mukana, mutta sen vaikutus on hajautettu monille mekanismeille. Peli ei selitä *miksi* hengellisyys auttaa – tarkoituksentunne on ydinmekanismi.

---

## 2. Pelin suurimmat puutteet opettavaisuuden kannalta

### A) Ei selityksiä valintojen takana
Toimintopainikkeet näyttävät vain numeeriset muutokset (`Terveys +10, Hyvinvointi +8`). Käyttäjä ei opi, *miksi* liikunta auttaa tai *miten* tupakointi vahingoittaa.

### B) Alkoholi on väärin mallinnettu
Peli antaa alkoholille positiivisen hyvinvointibonuksen – tämä voi opettaa vääriä asioita.

### C) Sosiaaliset suhteet aliarvioidaan
Tutkimuksen mukaan sosiaalisuus on yksi voimakkaimmista pitkäikäisyyden tekijöistä, mutta pelissä sen vaikutus (`bioAge: -0.15`) on yhtä pieni kuin meditaatiolla.

### D) Ei palautetta valintojen kumulatiivisista vaikutuksista
Pelaaja ei näe, kuinka monta vuotta hän on voittanut tai hävinnyt yhteensä tietyillä valinnoilla.

### E) Nuoruuden valinnat eivät vaikuta tarpeeksi
Tutkimus osoittaa, että nuoruuden valinnoilla (liikunta, ravinto, tupakointi) on elinikäinen vaikutus. Tätä ei mallinneta riittävästi.

---

## 3. Kehitysehdotukset

### 3.1 Lisää tietopaneelit toimintoihin (korkein prioriteetti)

Jokaisen toiminnon kohdalle voisi lisätä pienen "Tiesitkö?"-tekstin. Esimerkiksi:

```
Liikunta – "Tutkimus: Säännöllinen liikunta lisää elinajanodotetta jopa 7 vuotta (Lähteet: NIH, 2024)"
Tupakointi – "Jokainen savuke vie 20 minuuttia elinajasta (CNN, 2025)"
Ystävien tapaaminen – "Yksinäisyys on yhtä vaarallista kuin 15 savukkeen polttaminen päivässä"
```

### 3.2 Korjaa alkoholin mallinnus

Muuta:
```js
"Alkoholi": { health: -10, wellbeing: +5, bioAge: +0.3 }
```
→ Realistisempi:
```js
"Alkoholi": { health: -12, wellbeing: +2, bioAge: +0.5 }
// Ei pitkäaikaista hyvinvointibonusta – tai lisää "Vieroitusoireet" -mekaniikka
```

### 3.3 Vahvista sosiaalisten suhteiden vaikutus

Muuta:
```js
"Ystävien tapaaminen": { bioAge: -0.15 }
"Perheen kanssa": { bioAge: -0.2 }
```
→ Realistisempi (vastaa 50% paremman selviytymistodennäköisyyden tutkimustulosta):
```js
"Ystävien tapaaminen": { bioAge: -0.4 }
"Perheen kanssa": { bioAge: -0.45 }
```

### 3.4 Lisää "Elämänvuodet voitettu/hävitty" -mittari

Näytä pelaajalle yhteenveto, kuinka monta biologista vuotta he ovat voittaneet tai hävinneet tekemillään valinnoilla.

### 3.5 Ikäspesifinen oppiminen

Lisää vaihekohtaisia viestejä:
- Lapsuus: "Liikunnalliset tottumukset lapsuudessa kantavat läpi elämän"
- Nuoruus: "Tupakoinnin aloittaminen nuorena kasvattaa riippuvuusriskiä merkittävästi"
- Aikuisuus: "Stressin hallinta tässä vaiheessa on kriittistä biologisen ikääntymisen kannalta"
- Vanhuus: "Sosiaaliset suhteet ovat tärkeimpiä tekijöitä 65+ iässä"

### 3.6 Lopputilaston parantaminen

Lisää pelin lopussa vertailu: "Tekemilläsi valinnoilla biologinen ikäsi on X vuotta fyysistä ikääsi alhaisempi/korkeampi – tämä vastaa tutkimuksissa havaittua vaikutusta [liikunta/tupakointi/sosiaalisuus]."

---

## 4. Tutkimuslähteet

- [Does Exercise Support Longevity? – Research for Life](https://researchforlife.org/blog/does-exercise-support-longevity/)
- [Tiny improvements in sleep, nutrition and exercise – Live Science](https://www.livescience.com/health/tiny-improvements-in-sleep-nutrition-and-exercise-could-significantly-extend-lifespan-study-suggests)
- [A single cigarette can cut 20 minutes off your life – CNN](https://www.cnn.com/2025/01/01/health/cigarette-smoking-life-expectancy-study-wellness)
- [Social Ties Boost Survival by 50 Percent – Scientific American](https://www.scientificamerican.com/article/relationships-boost-survival/)
- [Loneliness poses health risks as deadly as smoking – PBS News](https://www.pbs.org/newshour/health/loneliness-poses-health-risks-as-deadly-as-smoking-u-s-surgeon-general-says)
- [Telomere length correlates with mindfulness – Nature Scientific Reports](https://www.nature.com/articles/s41598-020-61241-6)
- [Mediterranean diet and mortality – Harvard Gazette](https://news.harvard.edu/gazette/story/2024/06/women-who-follow-mediterranean-diet-live-longer/)
- [Alcohol and longevity – Medical News Today](https://www.medicalnewstoday.com/articles/moderate-drinking-does-not-boost-longevity-new-evidence-warns)
- [Purpose in Life and Longevity – Mind and Brain Institute](https://www.mind-and-brain.institute/spirituality/purpose-in-life-and-longevity/)
- [Spirituality and longevity – Springer Nature (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC10859326/)
- [Alcohol consumption and all-cause mortality – BMC Medicine](https://link.springer.com/article/10.1186/s12916-023-02907-6)
