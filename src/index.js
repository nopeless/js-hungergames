
import * as util from "./util.js";
import * as Core from "./HungerGamesCore.js";
import * as Player from "./Player.js";

// const events = util.loadJSON("default_events.json");

const events = [
	["p1 kills p2 with a shovel", "p1->p2"],
	["p1 hugs p2"],
	["p1 stares into the distance"],
	["p1 is bored. p1 goes to eat a snack"],
	["p1 is sad. p1 asks p2 to play with p1em"],
	["p2 makes a laser cannon and vaporizes p4", "p2->p4"],
	["p1 falls into a deadly pit", "->p1"],
	["p1 makes fun of p2 and p2 is hurt by it"],
	["p1 constructs a shield but drops it on p1s toe", "->p1"],
	["p1 steps on a lego brick", "->p1"],
	["p1 and p2 lay down and cry"],
	["p1 made an oppsie in math homeowrk and got hunted down by Lee", "->p1"],
	["p1 tried to acd and got banned", "->p1"],
	["p1 'accidentally' pushes p2 off a cliff","p1->p2"],
	["p1 and p2 get in a fight, and P1 wins", "p1->p2"],
	["p1 finds out p2 is a figment of their imagination", "->p2"],
].map(([sentence, directives]) => {
	try {
		return new Core.HungerGamesEvent(sentence, new Core.HungerGamesInformation(directives))
	} catch {
		return null;
	}
}).filter(v => v);

const ola = new Player.Player("Ola", "she");
const nop = new Player.Player("Nope", "she");
const rem = new Player.Player("Rem", "he");
const mat = new Player.Player("Matt", "he");
const mlem = new Player.Player("Mlem", "he");

const players = new Set([ola, nop, rem, mat, mlem]);

while (players.size > 1) {
	const event = util.randomItem(events);
	const arity = event.getArity();
	if (arity > players.size || players.size - event.getVictims().length < 1) {
		continue;
	}
	// console.log('stating with', players);
	const participants = util.randomItems(Array.from(players), arity);
	console.log(event.render(participants));
	for (const v of event.getVictims()) {
		console.log(`${participants[v].name} is dead`);
		players.delete(participants[v]);
	}
}

console.log([...players][0].name, "wins")


export default {}
