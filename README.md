<div align="center">

<img src="docs/banner.svg" alt="Password Generator — cryptographically secure, zero tracking, zero backend" width="100%">

<br>

[![Live demo](https://img.shields.io/badge/%E2%96%B6_live_demo-open_the_app-22d3ee?style=for-the-badge&labelColor=06121a)](https://password-generator-two-ruddy-16.vercel.app/)

![React 19](https://img.shields.io/badge/React_19-06121a?style=flat-square&logo=react&logoColor=22d3ee)
![Vite](https://img.shields.io/badge/Vite-06121a?style=flat-square&logo=vite&logoColor=a78bfa)
![Web Crypto](https://img.shields.io/badge/Web_Crypto-getRandomValues-06121a?style=flat-square&labelColor=06121a&color=22d3ee)
![Zero tracking](https://img.shields.io/badge/tracking-none-06121a?style=flat-square&labelColor=06121a&color=22d3ee)
![License](https://img.shields.io/badge/license-MIT-06121a?style=flat-square&labelColor=06121a&color=a78bfa)

</div>

<br>

![Password Generator screenshot](docs/screenshot.png)

Passwords are generated in your browser with `crypto.getRandomValues`, never `Math.random`. There is no server, no analytics and no network call: the password never leaves the tab.

## Features

- **Cryptographically secure** generation via the Web Crypto API
- Length from 4 to 64, toggles for uppercase, lowercase, numbers and symbols
- Optional exclusion of look-alike characters (`l`, `1`, `I`, `O`, `0`)
- Live strength meter, weak to very strong
- One-click copy with confirmation
- Session history of the last 5 passwords (memory only, gone on refresh)
- Dark glassmorphism UI, fully responsive

## Run locally

```bash
npm install
npm run dev
```

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite |
| Styling | Plain CSS, custom properties, glassmorphism |
| Randomness | Web Crypto API |
| Hosting | Vercel |

## License

MIT

<div align="center"><sub>Built by <a href="https://github.com/TPAINN">Apostolos Peiniris</a></sub></div>