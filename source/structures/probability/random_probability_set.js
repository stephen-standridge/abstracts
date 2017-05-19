import { FYShuffle } from '../../utils/shuffle';

class RandomProbabilitySet {
	constructor(set, choices=1){
		if (set.constructor !== Array) { throw new Error('RandomProbabilitySet: cannot create without an array set', 'random_probability_set.js') }
		this._maxChoices = choices;
		this._set = set;
		this.redistribute();
	}
	redistribute(){
		this._chosen = [];
		this._shuffled = FYShuffle(this._set);
	}
	choose(seed){
    //if this set has exhausted its choices, reshuffle
    if (this._chosen.length == this._maxChoices) this.redistribute();
    this._chosen.push((seed || Math.random()) > 0.5 ? this._shuffled.pop() : this._shuffled.shift());

    return this._chosen[this._chosen.length - 1]
	}
	chooseAll(){
		let returned = [];
		for (let i = 0; i < this._maxChoices; i++){
			returned[i] = this.choose();
		}
		return returned;
	}
}

export { RandomProbabilitySet }

