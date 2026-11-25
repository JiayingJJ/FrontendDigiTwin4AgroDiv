# Frontend DigiTwin4AgroDiv

Frontend unter: http://localhost:5173/

## Starten

Nachdem das **Setup** abgeschlossen ist:
```bash
npm run dev
```

## Setup

Es muss installiert sein:
- **NodeJS** (z.B. Version v26.12.1)

Das Frontend ist in **TypeScript** mit *React* entwickelt wurden. *Vite* dient dem Hotreloading der Seite während der Entwicklung, *Redux* wird für das State-Management verwendet und *ChakraUI* für die UI Komponenten. Genaueres ergibt sich aus den Packages und dem Quellcode.

Um diese Dependencies alle zu installieren wird dieser Befehl ausgeführt:
```bash
npm install
```

Die Address und der Port des Backends liest das Frontend vom Environment aus. Lege eine ```.env``` Datei an, die so aussehen sollte.

```
VITE_API_URL="http://localhost:9090"
```

Nachdem alles installiert kann es gestartet werden:
```bash
npm run dev
```
(Weiteres zu den npm-Skripten ist im packages.json zu finden.)

Das Frontend sollte nun im Browser aufrufbar sein. Die genaue Addresse sollte in der Konsole angegeben sein. Nicht vergessen, das Backend zu starten und sicherzustellen, dass das Frontend die richtige Addresse im Environment hat.

