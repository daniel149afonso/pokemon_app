# 🔍 Pokemon Finder

A simple web app to search for Pokemon and display their information using the [PokeAPI](https://pokeapi.co/).  
Built with **TypeScript**, styled using **Tailwind CSS**, and includes **autocomplete** search functionality.

<img width="1382" height="1193" alt="image" src="https://github.com/user-attachments/assets/d28ce9a0-e9f8-4df0-802e-d882bedbdab2" />

---

## 🌐 Features

- 🔎 Search for any Pokemon by name
- 🧠 Autocomplete suggestions as you type
- 📸 Display official Pokemon artwork
- 📊 Show Pokemon types and weaknesses
- ⚠️ Handle errors (e.g. invalid name)
- 🎨 Responsive and clean UI with Tailwind CSS

---

## 📦 Technologies Used

- **TypeScript** (no framework)
- **Tailwind CSS** (via CDN)
- **PokéAPI** – for Pokemon data

---

## 🚀 How to Use

1. Clone or download the repository:

   ```bash
   git clone https://github.com/daniel149afonso/pokemon_app.git
   cd pokemon_app
   ```

## Tree

```bash
 pokemon_app/
  ├── src/                    ← tout le code source
  │   ├── index.html          ← la page web
  │   ├── css/style.css       ← les styles custom
  │   ├── ts/                 ← le code TypeScript (logique de l'app)
  │   │   ├── index.ts        ← logique principale
  │   │   └── data.ts         ← données statiques (couleurs des types)
  │   └── public/
  │       └── pokeball.svg    ← image par défaut
  │
  ├── dist/                   ← version finale compilée (générée par `npm run build`)
  ├── node_modules/           ← dépendances installées (ignoré par git)
  │
  ├── package.json            ← liste les dépendances et les commandes
  ├── tsconfig.json           ← configuration TypeScript
  └── vite.config.ts          ← configuration Vite (le bundler)
  ```
