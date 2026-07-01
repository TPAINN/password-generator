# Password Generator

> Generate strong, random passwords — dark glassmorphism UI, zero tracking, zero backend.

[![Live](https://img.shields.io/badge/live-demo-8b5cf6?style=flat-square)](https://password-generator-two-ruddy-16.vercel.app/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)

<!-- ![Password Generator screenshot](docs/screenshot.jpg) -->

---

Client-side password generator built with real cryptographic randomness (`crypto.getRandomValues`, not `Math.random`), with a strength meter, configurable character sets, and in-session history — all wrapped in a premium dark-glassmorphism interface.

## Features

- Cryptographically secure generation (`crypto.getRandomValues`)
- Adjustable length (4–64 characters)
- Toggle uppercase / lowercase / numbers / symbols
- Optional exclusion of look-alike characters (`l`, `1`, `I`, `O`, `0`)
- Live strength meter (weak → very strong)
- One-click copy with confirmation
- Session history of the last 5 generated passwords
- Fully responsive (mobile / tablet / desktop)

## Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + Vite |
| Styling | Plain CSS, custom properties, glassmorphism |
| Randomness | Web Crypto API |
| Hosting | Vercel |

## Run locally

```bash
npm install
npm run dev
```

## License

MIT
