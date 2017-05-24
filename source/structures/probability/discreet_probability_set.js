import { fisherYatesShuffle } from '../../utils/shuffle';
import { RandomProbabilitySet } from './random_probability_set';

class DiscreetProbabilitySet {
	constructor(set, maxChoices=1){
		if (set.constructor !== Array) throw new Error('DiscreetProbabilitySet: set is not an array', 'discreet_probability_set.js');
		//check that an item or value is defined
		this._probabilities = set.map((item) => {
			let number = Number(item.probability);
			if (isNaN(number)) throw new Error('DiscreetProbabilitySet: given a choice without a probability defined', 'discreet_probability_set.js')
			return number
		});

		this._values = set.map((item) => {
			if (!item.set && !item.value) throw new Error('DiscreetProbabilitySet: given a choice without a value or set defined', 'discreet_probability_set.js')
			return item.value || new RandomProbabilitySet(item.set, item.max);
		});

		this._maxProbability = this._probabilities.reduce((sum, item) => { return sum + item }, 0);
		this._maxChoices = maxChoices;

		this.redistribute();
	}
	redistribute() {
		this._chosen = [];
		this._shuffled = fisherYatesShuffle(Object.keys(this._probabilities));
	}
	choose(seed) {
    //if this set has exhausted its choices, reshuffle
    if (this._chosen.length == this._maxChoices) this.redistribute();
    let random = (seed || Math.random());
    let chosenIndex = -1;
		this._shuffled.reduce((sum, probabilityIndex) => {
			let percentage = this._probabilities[probabilityIndex] / this._maxProbability;
			let nextSum = sum + percentage;
			if (random > sum && random <= nextSum) chosenIndex = probabilityIndex;
			return nextSum;
		}, 0)
		let choice = this._values[chosenIndex];
    this._chosen.push(choice.choose && choice.choose() || choice);
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

export { DiscreetProbabilitySet }
