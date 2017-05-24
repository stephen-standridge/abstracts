import { RandomProbabilitySet, DiscreetProbabilitySet } from '../probability'
import { lSystemProducer } from './lsystem_producer';

class lSystemExecutor extends lSystemProducer {
	constructor(...args){
		super(...args)
		this._instructions = {};
		this._instructionSets = {};
	}

	addInstruction(key, instruction) {
		if (typeof key !== 'string' && typeof key !== 'number') return false;
		switch (typeof instruction) {
			case 'function':
				this.removeInstruction(key);
				this._instructions[key] = instruction;
				return true;
				break;
			case 'object':
				if (instruction.constructor == Array) {
					return this.addInstructionArray(key, instruction);
					break;
				}
			case 'number':
			case 'string':
			case 'boolean':
			case 'undefined':
				console.warn(`lSystemExecutor: could not add instruction ${key}; instructions can only be functions or array of functions.`);
				return false;
				break;
		}
	}

	addRandomProbabilityInstructionMaybe(key, instruction) {
		let randomSettableItems = instruction.filter((item) => item && item.call);
		if (randomSettableItems.length == instruction.length) {
			this.removeInstruction(key);
			this._instructionSets[key] = new RandomProbabilitySet(instruction);
			this._instructions[key] = this.getFromSet.bind(this, key);
			return true;
		}
		return false;
	}

	addDiscreetProbabilityInstructionMaybe(key, instruction) {
		let discreetSettableItems = instruction.filter((item) => {
			if (!item) return false;
			if (item.value) {
				return item.probability && item.value && item.value.call //when value: function
			} else if (item.set) {
				return item.probability && item.set.reduce((bool, setItem) => {
					return bool && setItem && setItem.call//when function
				}, true)
			}
		});
		if (discreetSettableItems.length == instruction.length) {
			this.removeInstruction(key);
			this._instructionSets[key] = new DiscreetProbabilitySet(instruction);
			this._instructions[key] = this.getFromSet.bind(this, key);
			return true;
		}
		return false;
	}

	addInstructions(newInstructions) {
		return Object.keys(newInstructions)
			.map((key) => {
				let added = this.addInstruction(key, newInstructions[key]);
				return added;
			})
	}

	addInstructionArray(key, instruction) {
		if(this.addRandomProbabilityInstructionMaybe(key, instruction)) return true;
		if(this.addDiscreetProbabilityInstructionMaybe(key, instruction)) return true;
		console.warn(`lSystemExecutor: could not add instruction ${key} is the instruction formatted properly?`);
		return false;
	}

	removeInstruction(key) {
		this._instructions[key] && delete this._instructions[key];
		this._instructionSets[key] && delete this._instructionSets[key];
	}

	getInstruction(lookup, args=false, ctx={}) {
		let { left, right } = ctx;
		let key = String(lookup).slice(), params = [];
		if (key.length > 1) {
			//remove the first letter and get the
			params = key.slice(1,key.length).match(IN_PARAMS_REGEX)[0];
			params = params.split(',')
			key = key.slice(0,1);
		}
		params.unshift(key)

		let betweenContext = left && right && `${left}<${key}>${right}` || false;
		let leftContext = left && `${left}<${key}` || false;
		let rightContext = right && `${key}>${right}` || false;
		let instruction = betweenContext && this._instructions[betweenContext] || //get between
							 leftContext && this._instructions[leftContext] || //get left
							 rightContext && this._instructions[rightContext] || //get right
							 this._instructions[key]; //default instruction
		//call a instruction if it's a function, try returning it if not, else return false
		params = args && params.concat(args) || params;
		return (instruction && instruction.call && instruction(...params)) || false;
	}
}

export { lSystemExecutor }
