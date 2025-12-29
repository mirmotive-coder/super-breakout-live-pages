# Super Breakout – Visual Layers (Grafika vizualizācija)

## Mērķis
Uz sveču grafika vizuāli attēlot 3 galvenos stāvokļus:
- COMPRESS (kompresijas kapsula)
- VACUUM (tukšuma zona starp cenām)
- AGGRESSION (agresīvi buy/sell līmeņi)

Un 1 vienmēr aktīvu elementu:
- BREAKOUT koeficients (uzraksts + skaitlis, vienmēr ON)

Vizualizācijai jābūt 1:1 sasaistītai ar cenu skalu (price→pixel).
Procentu "uz aci" overlay nav pieļaujams galarezultātā.

---

## Kritiskā prasība par grafika motoru
TradingView tv.js widget (iframe) NAV piemērots precīzām iekšējām zonām,
jo nav stabilas pieejas:
- cena → y koordināta
- redzamais diapazons
- zoom/scroll stāvoklis
- precīza layer sinhronizācija

Tāpēc grafika kodols tiek būvēts uz:
- lightweight-charts (TradingView open-source)
- ar mūsu pašu Binance Futures Kline WebSocket datiem

Tas nodrošina:
- precīzu cenu skalu
- kontrolētu renderu
- precīzu overlay piesaisti
- stabilitāti TF maiņā un zoom laikā

---

## UI izkārtojums (tas, ko tu prasīji)

### Mobilais (≤768px)
- Augšā: grafiks (70% ekrāna)
- Apakšā: metrikas + slēdži (30% ekrāna)
- TOP10 panelis: atverams/sašaurināms (drawer)

### PC (≥768px)
- Kreisā puse: grafiks (70%)
- Labā puse: metrikas + TOP10 + uzraudzība (30%)

---

## Slēdži (toggle)
- Compress ON/OFF
- Vacuum ON/OFF
- Aggression ON/OFF
- Breakout koeficients: ALWAYS ON

Slēdžu stāvokļi saglabājas localStorage.

---

## Vizualizācijas slāņi (render order)

### L0: Candles + Volume (bāze)
- Candle series
- Volume histogram series (optional)

### L1: Vacuum zones (aiz candle vai virs — atkarīgs no dizaina)
- Parādās kā horizontāls taisnstūris starp diviem cenu līmeņiem
- Caurspīdīgs fons (zaļš ja potenciāls uz augšu, sarkans uz leju)
- Spēcīgākās robežlīnijas (start/end)
- Teksts “VACUUM” puscaurspīdīgs zonā

### L2: Compress capsule
- “Kapsula” (rounded rectangle) kompresijas diapazonā
- Ataino šauru cenu range konkrētā laika logā
- Teksts “COMPRESS” kapsulā
- Optional: biezāka kontūra, ja compress “nobriedis”

### L3: Aggression lines
- Zaļa līnija: agresīvs BUY līmenis
- Sarkana līnija: agresīvs SELL līmenis
- Līnijas biezums = agresijas intensitāte
- Optional: neliels marķieris ar “BUY AGG” / “SELL AGG”

### L4: Breakout HUD (always ON)
- Mazs panelis grafika augšējā labajā stūrī:
  - Breakout Strength: x.xx
  - Potenciāls (%): xx%
  - Status: “Compress”, “Build-up”, “Release”, “Absorption” (vēlāk)

---

## Ko nozīmē “Vacuum” vizuāli (konkrēti)
Vacuum NAV sveču ēnas.
Vacuum ir “tukšums starp cenām”, kur trūkst struktūras/likviditātes.

Tāpēc vacuum zona tiek definēta kā:
- PriceTop (augšējā robeža)
- PriceBottom (apakšējā robeža)
- TimeStart / TimeEnd (vai vismaz sākums)
- Direction bias (UP/DOWN/neutral)
- Strength (0..1)

Vizualizācija:
- Taisnstūris no PriceBottom līdz PriceTop
- Zonas platums laika asī var būt:
  - fiksēts logs (piem. pēdējās N sveces)
  - vai līdz vacuum “aizpildās” (vēlāk)

Teksts:
- “VACUUM” centrā, caurspīdīgs

---

## Ko nozīmē “Compress” vizuāli (konkrēti)
Compress ir šaurs cenu diapazons, kas kļūst “neinteresants”, bet uzkrāj enerģiju.

Vizualizācija:
- Capsule taisnstūris (rounded)
- Vertikāli: no compressLow līdz compressHigh
- Horizontāli: pēdējo N sveču logā (piem. 40 sveces) vai pēc algoritma
- Krāsa: dzintara/dzeltena caurspīdīga
- Nobriedis compress = biezāka mala

---

## Ko nozīmē “Aggression” vizuāli
Aggression līmeņi ir “sargāti” līmeņi (degviela).
Tie palīdz:
- ielikt drošu SL zem “sienas”
- saprast kur notiks korekcijas uzlāde

Vizualizācija:
- horizontāla līnija pie konkrētas cenas
- līnijas biezums = intensitāte
- līnija dzīvo noteiktu laiku (TTL) vai līdz salauzta

---

## Absorption (vizuālā interpretācija)
Absorption nav atsevišķa zona sākumā.
Absorption ir stāvoklis, kas maina aggression interpretāciju:

- ja agresija aug, bet cena neiet (vai pat slīd pretējā virzienā),
  aggression līnija kļūst biezāka un “stingrāka”
  (vizuāli: piesātinātāka + neliels “shield” marķieris)

Tas atbalsta ideju:
- spēcīga agresija bez kustības = uzlāde, ne vājums

---

## Minimālais vizuālais MVP (ko uztaisām pirmais)
1) Candles (kline) + TF switch (1m/5m/15m/1h)
2) Vacuum zone (1 zona testam, bet piesaistīta price→pixel)
3) Compress capsule (1 zona testam, piesaistīta price→pixel)
4) Aggression lines (2 līmeņi testam)
5) Slēdži ON/OFF
6) TOP10 atver “uzraudzības logu” ar izvēlēto monētu

---

## Kāpēc šis ir “izcils rezultāts”
- vizualizācija nav dekorācija; tā ir struktūra
- zonas vienmēr paliek pareizā vietā zoom/scroll laikā
- TF maiņa nepazaudē slāņus
- slēdži iedod “trokšņa kontroli”
- tas atbilst tavai ideoloģijai: patiesība + skaidrība + disciplīna
