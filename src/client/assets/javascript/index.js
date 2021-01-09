// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE


/**
 * The store object
 * @typedef {Object} Store
 * @property {Number} track_id - the selected track id
 * @property {Number} player_id - The selectred player id
 * @property {Number} race_id - The created race id
 */

// The store will hold all information needed globally
/** @type {Store} */
var store = {
	track_id: undefined,
	player_id: undefined,
	race_id: undefined,
}



/**
* @description Function that update the store
* @param {Store} state- The store object
* @param {object} object - the object to update the store
* @return {Store} the new updated store
*/
function updateStore(state,object) {
	return Object.assign({},state,object);
}


// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
		renderAt('#race',renderNetworkError());
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
		} 

		if((!!target.parentElement && target.parentElement.matches('.card.track')) ){
			handleSelectTrack(target.parentElement )
		}

		// Podracer form field
		if (target.matches('.card.podracer') ) {
			handleSelectPodRacer(target)
		}

		if ((!!target.parentElement && target.parentElement.matches('.card.podracer'))){
			handleSelectPodRacer(target.parentElement )
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate(target)
		}

	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}
// ^ PROVIDED CODE ^ DO NOT REMOVE

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
	// render starting UI
	renderAt('#race', renderRaceStartView())

	//Get player_id and track_id from the store
	const { track_id, player_id } = store;
	
	//invoke the API call to create the race, then save the result
	try{
		const result = await createRace(player_id,track_id);

		//update the store with the race id
		store = updateStore(store,{race_id: result.ID});
		// The race has been created, now start the countdown
		// call the async function runCountdown
		await runCountdown();
		//call the async function startRace
		await startRace(store.race_id-1);
		//call the async function runRace
		// no need to wait the runRace will cycle and handle the update of the UI
		runRace(store.race_id-1);

	}catch(error){
		renderAt('#race',renderNetworkError());
		console.log('Problemin createRace::',error);
	}
}

function runRace(raceID) {
	return new Promise(resolve => {
		// Method to get race info every 500ms
		const cyclicGetRace = setInterval( () => {
			getRace(raceID)
			.then(res => {
				if(res.status === "in-progress") return renderAt('#leaderBoard', raceProgress(res.positions));
				else if (res.status === "finished") {
					clearInterval(cyclicGetRace);
					return resolve(res);
				}
			})
			.catch( error => {
				clearInterval(cyclicGetRace);
				console.log('Problem in getRace request::',error);
				renderAt('#race',renderNetworkError());
			})
		}, 500);
	})
	.then( res => renderAt('#race', resultsView(res.positions)))
	.catch( error => {
		console.log('Problem in runRace request::',error);
		renderAt('#race',renderNetworkError())
	})
}


async function runCountdown() {
	try {
		// wait for the DOM to load
		await delay(100)
		let timer = 3

		return new Promise(resolve => {
			//Count down once per second
			const countDown = setInterval( () => {

				//DOM manipulation to decrement the countdown for the user
				document.getElementById('big-numbers').innerHTML = --timer

				//if the countdown is done, clear the interval, resolve the promise, and return
				if(timer <= 0){
					clearInterval(countDown);
					resolve();
				}
			}, 1000);

		
		})
	} catch(error) {
		console.log(error);
	}
}

function handleSelectPodRacer(target) {
	console.log("selected a pod", target.id)

	// remove class selected from all racer options
	const selected = document.querySelector('#racers .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	// save the selected racer to the store
	const id = parseInt(target.id);
	store = updateStore(store,{player_id: id});
}

function handleSelectTrack(target) {
	console.log("selected a track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if(selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')

	//save the selected track id to the store
	const id = parseInt(target.id);
	store = updateStore(store,{track_id: id});
}

function handleAccelerate() {
	console.log("accelerate button clicked")
	//API call to accelerate
	const raceId = store.race_id -1;
	accelerate(raceId);
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer

	return `
		<li class="card podracer" id="${id}">
			<h3>${driver_name}</h3>
			<p>${top_speed}</p>
			<p>${acceleration}</p>
			<p>${handling}</p>
		</li>
	`
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `
		<li id="${id}" class="card track">
			<h3>${name}</h3>
		</li>
	`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track, racers) {
	return `
		<header>
			<h1>Race: ${!!track ? !!track.name ? track.name: '' : ''}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
	positions.sort((a, b) => (a.final_position > b.final_position) ? 1 : -1)

	return `
		<header>
			<h1>Race Results</h1>
		</header>
		<main>
			${raceProgress(positions)}
			<a href="/race">Start a new race</a>
		</main>
	`
}
/**
* @description Function that return string representation of the UI when network error
* @return {String} the UI to show when error detected for the network calls
*/
function renderNetworkError(){
	return `
		<header>
			<h1>Network Error</h1>
		</header>
		<main>
			<section>
				<p>Sorry, an unexpected network error occur, please load the page and try again</p>
			</section>
		</main>
	`
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id === store.player_id);
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<main>
			<h3>Leaderboard</h3>
			<section id="leaderBoard">
				${results}
			</section>
		</main>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:8000'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

function getTracks() {
	// GET request to `${SERVER}/api/tracks`
	return fetch(`${SERVER}/api/tracks`, {
		method: 'GET',
		...defaultFetchOpts(),
	})
	.then(res=>res.json())
	.catch(err=>console.log("Problem with getTrack request::",err));
}

function getRacers() {
	// GET request to `${SERVER}/api/cars`
	return fetch(`${SERVER}/api/cars`, {
		method: 'GET',
		...defaultFetchOpts(),
	})
	.then(res=>res.json())
	.catch(err=>console.log("Problem with getRacers request::",err));
}

function createRace(player_id, track_id) {
	player_id = parseInt(player_id)
	track_id = parseInt(track_id)
	const body = { player_id, track_id }
	
	return fetch(`${SERVER}/api/races`, {
		method: 'POST',
		...defaultFetchOpts(),
		dataType: 'jsonp',
		body: JSON.stringify(body)
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with createRace request::", err))
}

function getRace(id) {
	// GET request to `${SERVER}/api/races/${id}`
	return fetch(`${SERVER}/api/races/${id}`, {
		method: 'GET',
		...defaultFetchOpts(),
	})
	.then(res=>res.json())
	.catch(err=>console.log("Problem with getRace request::",err));
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.catch(err => console.log("Problem with StartRace request::", err))
}

function accelerate(id) {
	// POST request to `${SERVER}/api/races/${id}/accelerate`
	return fetch(`${SERVER}/api/races/${id}/accelerate`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.catch(err => console.log("Problem with accelerate request::", err))
}
