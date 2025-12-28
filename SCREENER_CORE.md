# Super Breakout Screener – CORE Specification

## Mērķis
Šī dokumenta uzdevums ir precīzi definēt,
kā tiek identificēti instrumenti ar augstu izlādes potenciālu.

Šis dokuments ir augstāks par jebkuru kodu vai vizualizāciju.
Ja kods neatbilst šim dokumentam – kods ir nepareizs.

---

## Analīzes universs

- Tikai Binance Futures
- Visi aktīvie tirdzniecības pāri
- Nav manuālas atlases
- Screeneris strādā tikai ar reāllaika datiem

---

## Pamatstāvokļi (nemainīgi)

### 1. COMPRESS
Stāvoklis, kurā:
- cenas range samazinās
- volatilitāte krītas
- long un short pozīcijas uzkrājas vienlaikus
- tirgus kļūst “klusš”

Compress NAV indikators.
Tas ir tirgus līdzsvara stāvoklis.

---

### 2. VACUUM
Vakuums ir cenu zona, kurā:
- vēsturiski ir zema tirdzniecības aktivitāte
- trūkst pretējās puses orderu
- cena spēj pārvietoties strauji bez pretestības

Vakuums var atrasties:
- virs cenas
- zem cenas
- abās pusēs no compress zonas

---

### 3. AGGRESSION
Agresija ir iniciatīva, nevis virziens.

- BUY aggression: pircēji aktīvi uzņem likviditāti
- SELL aggression: pārdevēji aktīvi spiež cenu

Svarīgi:
Agresija var eksistēt bez cenas kustības (absorbcija).

---

### 4. ABSORPTION
Absorbcija notiek, ja:
- agresija pieaug
- cena nekustas proporcionāli
- pretējā puse uzņem spiedienu

Absorbcija bieži ir:
- nākamā uzlādes fāze
- signāls, ka sienas var tikt salauztas

---

### 5. BREAKOUT
Izlādes moments, kad:
- tiek pamests compress diapazons
- cena ieiet vakuuma zonā
- kustība kļūst strauja un vienvirziena

Izlaušanās var būt:
- patiesa
- viltus (false breakout)

---

## Screener scoring loģika

Katram instrumentam tiek aprēķināts SCORE,
balstoties uz sekojošiem faktoriem:

- Compress intensitāte
- Compress ilgums
- Vakuuma lielums (%)
- Agresijas klātbūtne
- Agresijas absorbcijas pazīmes
- Izlaušanās koeficients

Screeneris NEprognozē cenu.
Tas prognozē potenciālu.

---

## TOP 10 atlase

TOP 10:
- instrumenti ar augstāko SCORE
- neatkarīgi no cenas virziena
- paredzēti manuālai analīzei

TOP 10 nav signāli.
Tie ir fokusa punkti.

---

## Vizualizācijas princips

Uz grafika:
- vizuālais = aprēķins
- nekā dekoratīva
- nekā “skaistumam”

Ja stāvoklis nav aprēķināts,
tas nedrīkst parādīties grafikā.

---

## Autotrading statuss

- Autotrading ir IZSLĒGTS
- Tiks pievienots tikai pēc ilgstošas testēšanas
- Trailing TP balstīsies uz:
  - izlādes spēka mazināšanos
  - absorbcijas pieaugumu

---

## Statuss

CORE loģika: LOCKED  
Paplašinājumi: aizliegti bez korekcijas šajā dokumentā
