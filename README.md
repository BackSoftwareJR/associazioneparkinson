# Associazione Parkinsoniani del Canavese

Sito web statico dell'Associazione Parkinsoniani del Canavese ODV ETS.

## Struttura

- `index.html` — Homepage
- `chi-siamo.html`, `attivita.html`, `sedi.html` — Pagine principali
- `progetto-africa.html`, `donazioni.html`, `contatti.html` — Sezioni dedicate
- `css/`, `js/`, `images/` — Asset del sito
- `sedi/` — Pagine delle singole sedi operative

## Sviluppo locale

Apri `index.html` in un browser oppure avvia un server locale:

```bash
python3 -m http.server 8080
```

Poi visita http://localhost:8080

## Deploy automatico (staging)

Il workflow `.github/workflows/deploy-staging.yml` pubblica automaticamente su Hostinger quando si fa push sul branch `staging`.

### Flusso consigliato

1. Sviluppa e committa su `main`
2. Merge o push su `staging` per attivare il deploy

```bash
git checkout staging
git merge main
git push origin staging
```

### Secret GitHub richiesti

Configura in **Settings → Secrets and variables → Actions** del repository:

| Secret | Descrizione |
|--------|-------------|
| `FTP_SERVER` | Host FTP Hostinger (es. `ftp.tuodominio.it`) |
| `FTP_USERNAME` | Username FTP |
| `FTP_PASSWORD` | Password FTP |
| `FTP_SERVER_DIR` | Cartella remota di destinazione (es. `/public_html/` o la cartella staging) |
