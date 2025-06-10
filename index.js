//const { createElement } = require("react");

const url = "https://pokeapi.co/api/v2/pokemon/";
let nameInput = document.querySelector("#name");

let button = document.querySelector("#search");

button.addEventListener("click", ()=>{
	const apiKey = url + nameInput.value;
	getPokemon(apiKey);
});

async function getPokemon(apiKey){
	try{
		const response = await fetch(apiKey);
		if (!response.ok){
			throw new Error("Pokemon not found !");
		}
		const data = await response.json();
		displaySprite(data);
		alert("Your value: "+ data.name);
		console.log(data);
	} catch(error){
		alert(error);
	}
}

function displaySprite(data){
	let sprite = document.createElement("img");
	sprite.document.sr
	document.body.append(sprite);

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
// )

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
	