//GET POKEMON URL
const url = "https://pokeapi.co/api/v2/pokemon/";

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
		displayInfos(data);
		displaySprite(data);
		console.log(data);
	} catch(error){
		console.log(error);
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
	
	sprite.src = data.sprites.back_default;

}


// button.addEventListener("click", ()=>{
// 	let name = nameInput.value;
// 	const apiKey = url + name;
// 	let promise = fetch(apiKey);
// 	promise.then(value => alert("Your value: "+value))
// 	.then(data => console.log("Your data: "+data))
// 	.catch(error => console.log("Error: " + error));
// });



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
	