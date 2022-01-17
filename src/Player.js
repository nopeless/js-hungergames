const pronounMapping = {
	SUBJECT: 0,
	OBJECT: 1,
	POSSESSIVE_ADJECTIVE: 2,
	POSSESSIVE_PRONOUN: 3,
	REFLEXIVE: 4,
}

const defaultPronouns = {
	"male": ['he', 'him', 'his', 'his', 'himself'],
	"female": ['she', 'her', 'her', 'hers', 'herself'],
	[undefined]: ['they', 'them', 'their', 'theirs', 'themselves']
};

function parseGender(gender) {
	if (gender.match(/^she|her|female|wom[ae]n|girl|gal|queen$/i)) {
		return "female";
	}
	if (gender.match(/^he|him|male|m[ae]n|boy|guy|king$/i)) {
		return "male";
	}
	return undefined;
}

class Player {
	constructor(name, gender, pronouns = [], attributes = []) {

		// pronous: he/him/his/his/himself
		// override defaults they/them/their/theirs/themselves
		this.pronouns = [...defaultPronouns[parseGender(gender)]].map((v, i) => pronouns[i] ?? v)
		this.name = name;
	}

	getPronoun(type, useProper) {
		if (typeof type === "string") {
			type = pronounMapping[type];
			if (type === undefined) {
				throw new Error(`Unknown pronoun type: ${type}`);
			}
		}
		if (typeof type !== "number" || type < 0 || type >= this.pronouns.length) {
			throw new Error(`Unknown pronoun type: ${type}`);
		}
		return useProper ? this.name + (type === 3 || type === 4 ? "'s" : "") : this.pronouns[type];
	}
}

export { pronounMapping, Player, parseGender };
