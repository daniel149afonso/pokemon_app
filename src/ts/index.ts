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
  };
}

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const pokemon = document.querySelector<HTMLInputElement>("#input")!;
const button = document.querySelector<HTMLButtonElement>("#search")!;
const errorPoke = document.querySelector<HTMLParagraphElement>("#error")!;

const numberPoke = document.querySelector<HTMLParagraphElement>("#number")!;
const namePoke = document.querySelector<HTMLParagraphElement>("#name")!;
const typePoke = document.querySelector<HTMLDivElement>("#types")!;
const weakPoke = document.querySelector<HTMLDivElement>("#weakness")!;
const sprite = document.querySelector<HTMLImageElement>("#sprite")!;

button.addEventListener("click", () => {
  resetCard();
  const apiKey = API_URL + pokemon.value.trim().toLowerCase();
  getPokemonInfos(apiKey);
});

pokemon.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") {
    resetCard();
    const apiKey = API_URL + pokemon.value.trim().toLowerCase();
    getPokemonInfos(apiKey);
  }
});

function resetCard(): void {
  numberPoke.textContent = "Number:";
  namePoke.textContent = "";
  typePoke.innerHTML = "";
  weakPoke.innerHTML = "";
  errorPoke.textContent = "";
  sprite.src = "";
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
    sprite.src = "";
    weakPoke.textContent = "Weakness:";
  }
}

async function getWeaknesses(types: PokemonType[]): Promise<void> {
  try {
    const typeUrls = types.map(t => t.type.url);

    const responses = await Promise.all(typeUrls.map(url => fetch(url)));
    const datas: TypeData[] = await Promise.all(responses.map(res => res.json()));

    const allWeaknesses = datas.flatMap(typeData =>
      typeData.damage_relations.double_damage_from.map(t => t.name)
    );

    const uniqueWeaknesses = [...new Set(allWeaknesses)];

    weakPoke.innerHTML = uniqueWeaknesses.map(type =>
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
    data.sprites.front_default;
}
