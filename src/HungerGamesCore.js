import * as Player from "./Player.js";

const sentence = "p1 steals p2's shovel while p2 was sleeping. p1 likes p2s shovel and claims that it is now p1's";
const diagram = "p1->p2"

//              id        modifier
const ptag = /[pP]([1-9]\d*)('?s|self|em)?/g;
// capital P means ProperNoun
// nothing: subject
//      em: object pronouns
//       s: possesive adjective
//      's: possesive noun
//    self: reflexive pronoun

/**
 * interface
 */
class Token {
	constructor(content, data = {}) {
		this.content = content;
		this.data = data;
	}
}

class LiteralToken extends Token {
	constructor(content) {
		super(content);
	}
}

class PlayerToken extends Token {
	constructor(playerId, mode, proper = false) {
		super(`<player $${playerId}>`)
		this.playerId = playerId;
		this.mode = mode ? {
			em: Player.pronounMapping.OBJECT,
			s: Player.pronounMapping.POSSESSIVE_ADJECTIVE,
			"'s": Player.pronounMapping.POSSESSIVE_PRONOUN,
			self: Player.pronounMapping.REFLEXIVE,
		}[mode.toLowerCase()] : Player.pronounMapping.SUBJECT;
		this.proper = proper;
	}
}

const killDirective = /^((?:\w+)(?:,(?:\w+))*)?\->((?:\w+)(?:,(?:\w+))*)$/;

class HungerGamesInformation {
	constructor(text = "") {
		this.killList = [];
		this.killers = [];
		this.victims = [];
		for (const directive of text.split(/\s*;\s*/)) {
			// empty directive
			if (!directive) continue;
			let m;
			if (m = directive.match(killDirective)) {
				const [, killersStr = "", victimsStr] = m;
				const killers = killersStr.split(",").map(v => v.match(/\d+/));
				const victims = victimsStr.split(",").map(v => v.match(/\d+/));
				for (const killer of killers) {
					if (!this.killers.includes(killer)) this.killers.push(killer);
				}
				for (const victim of victims) {
					if (!this.victims.includes(victim)) this.victims.push(victim);
				}
				this.killList.push([killers, victims]);
				continue;
			}
			throw new Error(`Invalid directive: ${directive}`);
		}
	}
}

class HungerGamesEvent {
	constructor(text, information = new HungerGamesInformation()) {
		this._information = information;
		// id: {} some object idk
		this.people = Object.create(null);

		const elementList = [];

		let m, last = 0, n = 0;

		// reset the stateful regex
		ptag.lastIndex = 0;

		// a simple parser for now
		while (m = ptag.exec(text)) {
			// console.log(m);
			const s = text.substring(last, m.index);
			s && elementList.push(new LiteralToken(s));
			const id = m[1];
			elementList.push(new PlayerToken(id, m[2], m[0][0] === "P"));

			// Register valid players
			this.people[id] = true;


			last = ptag.lastIndex;
		}

		for (const id of Object.keys(this.people).sort((a, b) => a - b)) {
			this.people[id] = n++;
		}

		// get last substring
		const lastElement = text.substring(last);
		lastElement && elementList.push(new LiteralToken(lastElement));

		this.tokens = elementList;
	}

	getArity() {
		return Object.keys(this.people).length;
	}

	getVictims() {
		return this._information.victims.map(v => this.people[v]);
	}

	getKillers() {
		return this._information.killers.map(v => this.people[v]);
	}

	/**
	 * Pass in an array of players
	 */
	render(playerList) {
		// check for arity later
		if (playerList.length < this.getArity()) {
			throw new Error("Not enough players");
		}
		const hasAppeared = Object.create(null);

		return this.tokens.map(v => {
			if (v instanceof PlayerToken) {
				const player = playerList[this.people[v.playerId]];
				const appeared = hasAppeared[v.playerId];
				if (!appeared) {
					hasAppeared[v.playerId] = true;
				}
				return player.getPronoun(v.mode, !appeared || v.proper);
			}
			return v.content;
		}).join("")
	}
}

export { HungerGamesInformation, HungerGamesEvent };
