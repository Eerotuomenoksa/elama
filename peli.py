import random
import time

class Character:
    def __init__(self):
        self.age = 0  # Fyysinen ikä
        self.bio_age = 0  # Biologinen ikä
        self.wellbeing = 70  # Hyvinvointi (0-100)
        self.money = 100  # Rahat
        self.energy = 100  # Energia
        self.knowledge = 0  # Tietämys
        self.social = 50  # Sosiaaliset siteet
        self.health = 80  # Terveys
        self.life_stage = "Lapsuus"
        self.alive = True
        self.achievements = []
        
    def update_life_stage(self):
        if self.age < 13:
            self.life_stage = "Lapsuus"
        elif self.age < 20:
            self.life_stage = "Nuoruus"
        elif self.age < 65:
            self.life_stage = "Aikuisuus"
        else:
            self.life_stage = "Vanhuus"
    
    def age_character(self):
        self.age += 1
        # Biologinen ikääntyminen (perusnopeus)
        aging_rate = 1.0
        
        # Ikääntymistä hidastavat tekijät
        if self.health > 70:
            aging_rate -= 0.2
        if self.wellbeing > 70:
            aging_rate -= 0.15
        if self.knowledge > 50:
            aging_rate -= 0.1
        if self.social > 60:
            aging_rate -= 0.1
        
        # Ikääntymistä nopeuttavat tekijät
        if self.health < 40:
            aging_rate += 0.3
        if self.wellbeing < 30:
            aging_rate += 0.25
        if self.money < 20:
            aging_rate += 0.2
            
        self.bio_age += aging_rate
        self.update_life_stage()
        
        # Terveys heikkenee iän myötä
        if self.age > 40:
            self.health -= random.uniform(0.5, 2.0)
        if self.age > 60:
            self.health -= random.uniform(1.0, 3.0)
            
        # Tarkista kuolema
        if self.bio_age >= 100 or self.health <= 0 or self.wellbeing <= 0:
            self.alive = False

class Game:
    def __init__(self):
        self.character = Character()
        self.year = 0
        self.actions = {
            "Terveystarkastus": {"cost": 30, "energy": -10, "health": 15, "wellbeing": 5, "bio_age": -0.3},
            "Liikunta": {"cost": 0, "energy": -20, "health": 10, "wellbeing": 8, "bio_age": -0.4},
            "Terveellinen ruokavalio": {"cost": 15, "energy": -5, "health": 8, "wellbeing": 5, "bio_age": -0.2},
            "Lääkkeet": {"cost": 25, "energy": -5, "health": 12, "wellbeing": 3, "bio_age": -0.25},
            "Meditaatio": {"cost": 0, "energy": -15, "health": 5, "wellbeing": 12, "bio_age": -0.15},
            "Opiskelu": {"cost": 20, "energy": -25, "knowledge": 15, "wellbeing": -5, "bio_age": -0.1},
            "Työ": {"cost": 0, "energy": -30, "money": 50, "wellbeing": -10, "bio_age": 0.1},
            "Loma": {"cost": 40, "energy": 20, "wellbeing": 20, "bio_age": -0.2},
            "Ystävien tapaaminen": {"cost": 10, "energy": -15, "social": 15, "wellbeing": 12, "bio_age": -0.15},
            "Perheen kanssa": {"cost": 5, "energy": -10, "social": 10, "wellbeing": 15, "bio_age": -0.2},
            "Harrastukset": {"cost": 15, "energy": -20, "wellbeing": 18, "bio_age": -0.1},
            "Lääketieteellinen tutkimus": {"cost": 80, "energy": -30, "health": 20, "bio_age": -0.8},
            "Geeniterapia": {"cost": 200, "energy": -40, "health": 30, "bio_age": -1.5},
            "Nuoruuden lähde": {"cost": 500, "energy": -20, "health": 25, "bio_age": -2.0, "achievement": "Nuoruuden lähde löydetty!"},
            "Tupakointi": {"cost": 5, "energy": 5, "health": -15, "wellbeing": -5, "bio_age": 0.5},
            "Alkoholi": {"cost": 10, "energy": -5, "health": -10, "wellbeing": 5, "bio_age": 0.3},
            "Junk food": {"cost": 5, "energy": 5, "health": -8, "wellbeing": 8, "bio_age": 0.2}
        }
        
    def display_status(self):
        print("\n" + "="*50)
        print(f"VUOSI {self.year} | Elämänvaihe: {self.character.life_stage}")
        print(f"Fyysinen ikä: {self.character.age} vuotta | Biologinen ikä: {self.character.bio_age:.1f} vuotta")
        print(f"Hyvinvointi: {self.character.wellbeing:.1f}/100 | Terveys: {self.character.health:.1f}/100")
        print(f"Rahat: {self.character.money} € | Energia: {self.character.energy:.1f}/100")
        print(f"Tietämys: {self.character.knowledge:.1f} | Sosiaaliset siteet: {self.character.social:.1f}")
        if self.character.achievements:
            print(f"Saavutukset: {', '.join(self.character.achievements)}")
        print("="*50)
        
    def random_event(self):
        events = [
            {"name": "Sairastuminen", "health": -15, "wellbeing": -10, "bio_age": 0.2},
            {"name": "Onnettomuus", "health": -20, "wellbeing": -15, "money": -30},
            {"name": "Perintö", "money": 100, "wellbeing": 10},
            {"name": "Uusi ystävä", "social": 20, "wellbeing": 15},
            {"name": "Työtarjous", "money": 80, "energy": -20},
            {"name": "Läheisen kuolema", "social": -25, "wellbeing": -20, "bio_age": 0.3},
            {"name": "Löytöretki", "money": 50, "knowledge": 10},
            {"name": "Taidekilpailuvoitto", "wellbeing": 25, "money": 30}
        ]
        
        if random.random() < 0.3:  # 30% mahdollisuus satunnaiselle tapahtumalle
            event = random.choice(events)
            print(f"\nSATUNNAinen TAPAHTUMA: {event['name']}!")
            
            for key, value in event.items():
                if key != "name":
                    if hasattr(self.character, key):
                        setattr(self.character, key, getattr(self.character, key) + value)
            
            time.sleep(1.5)
    
    def choose_actions(self):
        available_actions = []
        
        # Näytä saatavilla olevat toiminnot
        print("\nSaatavilla olevat toiminnot:")
        for i, (action, details) in enumerate(self.actions.items()):
            if self.character.money >= details.get("cost", 0) and self.character.energy >= abs(details.get("energy", 0)):
                available_actions.append(action)
                print(f"{i+1}. {action} (Kustannus: {details.get('cost', 0)}€, Energia: {details.get('energy', 0)})")
        
        if not available_actions:
            print("Ei tarpeeksi resursseja mihinkään toimenpiteeseen!")
            return
        
        # Pelaajan valinnat
        selected_actions = []
        while True:
            try:
                choice = input(f"\nValitse toimenpide (1-{len(available_actions)}) tai lopeta valinta (0): ")
                if choice == "0":
                    break
                choice = int(choice) - 1
                if 0 <= choice < len(available_actions):
                    action = available_actions[choice]
                    selected_actions.append(action)
                    print(f"Lisätty: {action}")
                else:
                    print("Virheellinen valinta!")
            except ValueError:
                print("Syötä numero!")
        
        # Suorita valitut toimenpiteet
        for action in selected_actions:
            details = self.actions[action]
            self.character.money -= details.get("cost", 0)
            self.character.energy += details.get("energy", 0)
            self.character.health += details.get("health", 0)
            self.character.wellbeing += details.get("wellbeing", 0)
            self.character.knowledge += details.get("knowledge", 0)
            self.character.social += details.get("social", 0)
            self.character.bio_age += details.get("bio_age", 0)
            
            if "achievement" in details:
                self.character.achievements.append(details["achievement"])
            
            print(f"\nSuoritit: {action}")
            time.sleep(0.5)
        
        # Varmista, että arvot pysyvät rajoissa
        self.character.wellbeing = max(0, min(100, self.character.wellbeing))
        self.character.health = max(0, min(100, self.character.health))
        self.character.energy = max(0, min(100, self.character.energy))
        self.character.social = max(0, min(100, self.character.social))
        self.character.knowledge = max(0, self.character.knowledge)
    
    def play(self):
        print("Elämänkaaripeli: Ajan Kiertäjä")
        print("Tavoitteesi on elää mahdollisimman pitkään ja hyvässä kunnossa!")
        print("Tee viisaita valintoja hidastaaksesi ikääntymistä ja parantaaksesi hyvinvointiasi.")
        
        while self.character.alive:
            self.display_status()
            self.random_event()
            self.choose_actions()
            
            # Päivitä hahmo vuoden lopussa
            self.character.age_character()
            self.year += 1
            
            # Lisää energiaa vuoden vaihtuessa
            self.character.energy = min(100, self.character.energy + 30)
            
            # Tarkista erikoistilanteet
            if self.character.bio_age < self.character.age - 10:
                print("\nHuom! Biologinen ikäsi on paljon alhaisempi kuin fyysinen ikäsi - olet tehnyt hyviä valintoja!")
            if self.character.wellbeing < 20:
                print("\nVaroitus! Hyvinvointisi on erittäin alhainen - tee jotain parantaaksesi elämänlaatuasi!")
            if self.character.health < 30:
                print("\nVaroitus! Terveytesi on heikko - hakeudu hoitoon!")
            
            time.sleep(1)
        
        # Peli päättyi
        print("\n" + "="*50)
        print("PELI PÄÄTTYI")
        print(f"Kuolit {self.character.age} vuotiaana (biologinen ikä {self.character.bio_age:.1f} vuotta)")
        print(f"Elit {self.year} vuotta")
        print(f"Loppu hyvinvointi: {self.character.wellbeing:.1f}/100")
        print(f"Loppu terveys: {self.character.health:.1f}/100")
        if self.character.achievements:
            print(f"Saavutukset: {', '.join(self.character.achievements)}")
        
        # Arvioi suoritus
        if self.character.age > 90:
            print("\nLoistava suoritus! Elit pitkän ja täyden elämän!")
        elif self.character.age > 70:
            print("\nHyvä suoritus! Saavutit korkean iän!")
        elif self.character.age > 50:
            print("\nKohtalainen suoritus. Voit yrittää uudelleen tehdäksesi parempia valintoja!")
        else:
            print("\nElämäsi oli lyhyt. Seuraavalla kerralla tee terveellisempiä valintoja!")

if __name__ == "__main__":
    game = Game()
    game.play()