import { typeColors } from './data';

interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

interface PokemonSprites {
  front_default: string;
  other: {
    "official-artwork": {
      front_default: string;
    };
  };
}

interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: PokemonSprites;
}

interface DamageRelation {
  name: string;
  url: string;
}

interface TypeData {
  damage_relations: {
    double_damage_from: DamageRelation[];
    half_damage_from: DamageRelation[];
    no_damage_from: DamageRelation[];
  };
}

interface PokemonListItem {
  name: string;
  url: string;
}

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const PLACEHOLDER = "/pokeball.svg";

const pokemon = document.querySelector<HTMLInputElement>("#input")!;
const button = document.querySelector<HTMLButtonElement>("#search")!;
const errorPoke = document.querySelector<HTMLParagraphElement>("#error")!;
const dropdown = document.querySelector<HTMLDivElement>("#dropdown")!;

const numberPoke = document.querySelector<HTMLParagraphElement>("#number")!;
const namePoke = document.querySelector<HTMLParagraphElement>("#name")!;
const typePoke = document.querySelector<HTMLDivElement>("#types")!;
const weakPoke = document.querySelector<HTMLDivElement>("#weakness")!;
const sprite = document.querySelector<HTMLImageElement>("#sprite")!;

sprite.src = PLACEHOLDER;

let allPokemon: PokemonListItem[] = [];
let dropdownIndex = -1;

loadPokemonList();

async function loadPokemonList(): Promise<void> {
  try {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000");
    const data = await res.json();
    allPokemon = (data.results as PokemonListItem[]).filter(
      p => getIdFromUrl(p.url) <= 1025
    );
  } catch {
    // autocomplete silently unavailable
  }
}

function getIdFromUrl(url: string): number {
  return parseInt(url.split('/').filter(Boolean).pop() ?? '0', 10);
}

function hideDropdown(): void {
  dropdown.classList.add('hidden');
  dropdownIndex = -1;
}

function showDropdown(matches: PokemonListItem[]): void {
  dropdownIndex = -1;
  dropdown.innerHTML = matches.map(p => {
    const id = getIdFromUrl(p.url);
    const name = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return `<div class="dropdown-item flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-yellow-50 transition-colors" data-name="${p.name}">
      <img src="${spriteUrl}" alt="${name}" class="w-10 h-10 object-contain" />
      <span class="font-semibold text-gray-800 flex-1">${name}</span>
      <span class="text-sm text-gray-400">#${String(id).padStart(3, '0')}</span>
    </div>`;
  }).join('');

  dropdown.classList.remove('hidden');

  dropdown.querySelectorAll<HTMLDivElement>('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => selectItem(item.dataset.name!));
  });
}

function updateHighlight(): void {
  const items = dropdown.querySelectorAll<HTMLDivElement>('.dropdown-item');
  items.forEach((item, i) => item.classList.toggle('bg-yellow-50', i === dropdownIndex));
  if (dropdownIndex >= 0) items[dropdownIndex]?.scrollIntoView({ block: 'nearest' });
}

function selectItem(name: string): void {
  pokemon.value = name;
  hideDropdown();
  resetCard();
  getPokemonInfos(API_URL + name);
}

pokemon.addEventListener("input", () => {
  const query = pokemon.value.trim().toLowerCase();
  if (!query) { hideDropdown(); return; }

  const matches = allPokemon.filter(p => p.name.startsWith(query)).slice(0, 8);
  if (matches.length === 0) { hideDropdown(); return; }

  showDropdown(matches);
});

pokemon.addEventListener("keydown", (e: KeyboardEvent) => {
  const isOpen = !dropdown.classList.contains('hidden');
  const items = dropdown.querySelectorAll<HTMLDivElement>('.dropdown-item');

  if (isOpen) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      dropdownIndex = Math.min(dropdownIndex + 1, items.length - 1);
      updateHighlight();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      dropdownIndex = Math.max(dropdownIndex - 1, -1);
      updateHighlight();
      return;
    }
    if (e.key === "Escape") {
      hideDropdown();
      return;
    }
    if (e.key === "Enter" && dropdownIndex >= 0) {
      selectItem(items[dropdownIndex].dataset.name!);
      return;
    }
  }

  if (e.key === "Enter") {
    hideDropdown();
    resetCard();
    getPokemonInfos(API_URL + pokemon.value.trim().toLowerCase());
  }
});

document.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as Node;
  if (!dropdown.contains(target) && target !== pokemon) hideDropdown();
});

button.addEventListener("click", () => {
  hideDropdown();
  resetCard();
  getPokemonInfos(API_URL + pokemon.value.trim().toLowerCase());
});

function resetCard(): void {
  numberPoke.textContent = "Number:";
  namePoke.textContent = "";
  typePoke.innerHTML = "";
  weakPoke.innerHTML = "";
  errorPoke.textContent = "";
  sprite.src = PLACEHOLDER;
}

async function getPokemonInfos(apiKey: string): Promise<void> {
  try {
    if (!pokemon.value.trim()) {
      throw new Error("Please enter a Pokémon name.");
    }

    const response = await fetch(apiKey);

    if (!response.ok) {
      throw new Error("Pokémon not found.");
    }

    const data: Pokemon = await response.json();

    await getWeaknesses(data.types);
    displayInfos(data);
    displaySprite(data);

  } catch (error) {
    errorPoke.textContent = (error as Error).message;
    sprite.src = PLACEHOLDER;
    weakPoke.innerHTML = "";
  }
}

async function getWeaknesses(types: PokemonType[]): Promise<void> {
  try {
    const typeUrls = types.map(t => t.type.url);

    const responses = await Promise.all(typeUrls.map(url => fetch(url)));
    const datas: TypeData[] = await Promise.all(responses.map(res => res.json()));

    const multipliers: Record<string, number> = {};

    for (const typeData of datas) {
      for (const t of typeData.damage_relations.double_damage_from) {
        multipliers[t.name] = (multipliers[t.name] ?? 1) * 2;
      }
      for (const t of typeData.damage_relations.half_damage_from) {
        multipliers[t.name] = (multipliers[t.name] ?? 1) * 0.5;
      }
      for (const t of typeData.damage_relations.no_damage_from) {
        multipliers[t.name] = 0;
      }
    }

    const weaknesses = Object.entries(multipliers)
      .filter(([, mult]) => mult >= 2)
      .map(([type]) => type);

    weakPoke.innerHTML = weaknesses.map(type =>
      `<span class="badge ${typeColors[type] ?? 'bg-gray-400'}">${type}</span>`
    ).join("");
  } catch (error) {
    console.error("Error loading weaknesses:", error);
    weakPoke.textContent = "Weakness: unavailable";
  }
}

function displayInfos(data: Pokemon): void {
  numberPoke.textContent = "Number: #" + data.id;

  namePoke.textContent =
    data.name.charAt(0).toUpperCase() + data.name.slice(1);

  const types = data.types.map(t => t.type.name);

  typePoke.innerHTML = types.map(type =>
    `<span class="badge ${typeColors[type] ?? 'bg-gray-400'}">${type}</span>`
  ).join("");
}

function displaySprite(data: Pokemon): void {
  sprite.src =
    data.sprites.other["official-artwork"].front_default ||
    data.sprites.front_default ||
    PLACEHOLDER;
}
