import age from './test.js'
console.log(age);

//GET POKEMON URL
const url = "https://pokeapi.co/api/v2/pokemon/";
const urlType = "https://pokeapi.co/api/v2/type/";

//GET INPUT NAME + BUTTON
let pokemon = document.querySelector("#input");
let button = document.querySelector("#search");

//POKEMON INFOS
let numberPoke = document.querySelector("#number");
let namePoke = document.querySelector("#name");
let typePoke = document.querySelector("#type");
let weakPoke = document.querySelector("#weakness");
let sprite = document.querySelector("#sprite");

//CLICK SEARCH POKEMON
button.addEventListener("click", ()=>{
	//Delete input
	numberPoke.textContent = "Number: ";
	namePoke.textContent = "Name: ";
	typePoke.textContent = "Type: ";
	//Add pokemon name to url
	const apiKey = url + pokemon.value;
	getPokemonInfos(apiKey);
});

async function getPokemonInfos(apiKey){
	try{
		const response = await fetch(apiKey);
		if (!response.ok){
			throw new Error("Pokemon not found !");
		}
		const data = await response.json();
		await getWeaknesses(data.types);
		displayInfos(data);
		displaySprite(data);
		console.log(data);
	} catch(error){
		let errorPoke = document.createElement("div");
		errorPoke.classList.add("error");
		errorPoke.textContent = error;
		document.body.append(errorPoke);
	}
}

async function getWeaknesses(types) {
	try {
	const typeUrls = types.map(t => t.type.url); // récupère les URLs des types

	// Lance toutes les requêtes en parallèle
	const responses = await Promise.all(typeUrls.map(url => fetch(url)));
	const datas = await Promise.all(responses.map(res => res.json()));

	// Récupère toutes les faiblesses
	let allWeaknesses = datas.flatMap(typeData =>
		typeData.damage_relations.double_damage_from.map(t => t.name)
	);

	// Supprime les doublons
	const uniqueWeaknesses = [...new Set(allWeaknesses)];

	// Affiche dans la page
	weakPoke.textContent = "Weakness: " + uniqueWeaknesses.join(", ");
	} catch (error) {
	console.error("Erreur lors du chargement des faiblesses :", error);
	}
}


function displayInfos(data){
	numberPoke.textContent += data.id;
	namePoke.textContent += data.name;
	typePoke.textContent += data.types[0].type.name;
	if (data.types[1])
		typePoke.textContent += ", " + data.types[1].type.name;
}

function displaySprite(data){
	sprite.src = data.sprites.front_default;
}

//FETCH
// button.addEventListener("click", ()=>{
// 	let name = nameInput.value;
// 	const apiKey = url + name;
// 	let promise = fetch(apiKey);
// 	promise.then(value => alert("Your value: "+value))
// 	.then(data => console.log("Your data: "+data))
// 	.catch(error => console.log("Error: " + error));
// });


//PROMISES
// let title;
// let promise = new Promise((resolve, reject)=>{
// 	title = document.createElement("h1");
// 	document.body.append(title);
// 	resolve("Your title has been created!");
// });
// promise.then(
// 	value => title.textContent = value,
// 	error => alert(error)
// );

//PROMISES + SETTIMEOUT
// let promise = new Promise((resolve, reject)=>{
// 	setTimeout(() => resolve("Fini!"), 1000);
// });

// promise.then(
// 	value => {
// 		console.log(value);
// 	},
// 	error => {
// 		console.log(error);
// 	}
// );
	