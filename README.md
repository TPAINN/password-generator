# Password Generator

Generates random passwords in the browser with `crypto.getRandomValues`. There is no server and no analytics, so a generated password never leaves the tab.

[Live demo](https://password-generator-two-ruddy-16.vercel.app/)

![Password Generator](docs/screenshot.png)

## Features

- Length from 4 to 64 characters
- Toggles for uppercase, lowercase, numbers and symbols
- Option to exclude look-alike characters (`l`, `1`, `I`, `O`, `0`)
- Strength meter from weak to very strong
- Copy to clipboard with confirmation
- History of the last five passwords, kept in memory only
- Responsive layout

## Run

```bash
npm install
npm run dev
npm run build
```

## Stack

React 19, Vite, plain CSS, Web Crypto API. Deployed on Vercel.

## License

MIT