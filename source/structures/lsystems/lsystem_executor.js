import { RandomProbabilitySet, DiscreetProbabilitySet } from '../probability'
import { lSystemProducer } from './lsystem_producer';

class lSystemExecutor extends lSystemProducer {
	constructor(...args){
		super(...args)
		this._instructions = {};
		this._instructionSets = {};
		this.getInstruction = this.getInstruction.bind(this);
	}

	addInstruction(key, instruction) {
		if (key == '-') { console.warn('lSystemProducer: no support for hyphen rules'); return false; }
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
		let { left, right } = ctx, params = [];
		if (lookup.length > 1) {
			//remove the first letter and get the new params
			let otherParams = lookup.slice(1,lookup.length).match(IN_PARAMS_REGEX)[0];
			otherParams && otherParams.split(',').forEach((otherParam) => params.push(otherParam));
			lookup = lookup.charAt(0);
		}
		params.unshift(lookup);

		let instruction = (left && right && this._instructions[`${left}<${lookup}>${right}`]) || //get between
							 				(left && this._instructions[`${left}<${lookup}`]) || //get left
											(right && this._instructions[`${lookup}>${right}`]) || //get right
							 				this._instructions[lookup]; //default instruction

		//call a instruction if it's a function, try returning it if not, else return false
		args && args.forEach((arg) => params.push(arg))
		return (instruction && instruction.call && instruction(...params)) || undefined;
	}

	execute(start=this._productionArray.length - 1, end=this._productionArray.length) {
		return new Promise(function(resolve, reject){
			if (end > this._productionArray.length || end < 0 || start > this._productionArray.length || start < 0){
				reject(`lSystemExecutor: could not execute from ${start} to ${end}; Out of range.`);
				return;
			}
			setTimeout(function(){
				resolve(this.iterateLevels(this.getInstruction, start, end));
			}.bind(this),0)
		}.bind(this))

	}
}

export { lSystemExecutor }
