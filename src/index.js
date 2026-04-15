
import {typeColors} from './data.js';
const url = "https://pokeapi.co/api/v2/pokemon/";

let pokemon = document.querySelector("#input");
let button = document.querySelector("#search");
let errorPoke = document.querySelector("#error");

let numberPoke = document.querySelector("#number");
let namePoke = document.querySelector("#name");
let typePoke = document.querySelector("#types");
let weakPoke = document.querySelector("#weakness");
let sprite = document.querySelector("#sprite");

button.addEventListener("click", () => {
  resetCard();
  const apiKey = url + pokemon.value.trim().toLowerCase();
  getPokemonInfos(apiKey);
});

pokemon.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
	resetCard();
	const apiKey = url + pokemon.value.trim().toLowerCase();
	getPokemonInfos(apiKey);
  }
});

function resetCard() {
  numberPoke.textContent = "Number:";
  namePoke.textContent = "";
  typePoke.innerHTML = "";
  weakPoke.innerHTML = "";
  errorPoke.textContent = "";
  sprite.src = "";
}

async function getPokemonInfos(apiKey) {
  try {
	if (!pokemon.value.trim()) {
	  throw new Error("Please enter a Pokémon name.");
	}

	const response = await fetch(apiKey);

	if (!response.ok) {
	  throw new Error("Pokémon not found.");
	}

	const data = await response.json();

	await getWeaknesses(data.types);
	displayInfos(data);
	displaySprite(data);

  } catch (error) {
	errorPoke.textContent = error.message;
	sprite.src = "";
	weakPoke.textContent = "Weakness:";
  }
}

async function getWeaknesses(types) {
  try {
	const typeUrls = types.map(t => t.type.url);

	const responses = await Promise.all(typeUrls.map(url => fetch(url)));
	const datas = await Promise.all(responses.map(res => res.json()));

	const allWeaknesses = datas.flatMap(typeData =>
	  typeData.damage_relations.double_damage_from.map(t => t.name)
	);

	const uniqueWeaknesses = [...new Set(allWeaknesses)];

	weakPoke.innerHTML = uniqueWeaknesses.map(type =>
  `<span class="badge ${typeColors[type] || 'bg-gray-400'}">${type}</span>`
		).join("");
  } catch (error) {
	console.error("Error loading weaknesses:", error);
	weakPoke.textContent = "Weakness: unavailable";
  }
}

function displayInfos(data){
  numberPoke.textContent = "Number: #" + data.id;

  namePoke.textContent =
	data.name.charAt(0).toUpperCase() + data.name.slice(1);

  const types = data.types.map(t => t.type.name);

	typePoke.innerHTML = types.map(type =>
  `<span class="badge ${typeColors[type] || 'bg-gray-400'}">${type}</span>`
	).join("");
}

function displaySprite(data) {
  sprite.src =
	data.sprites.other["official-artwork"].front_default ||
	data.sprites.front_default;
}