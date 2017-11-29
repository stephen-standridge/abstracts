import { range } from 'lodash';
import { RandomProbabilitySet, DiscreetProbabilitySet } from '../probability'
import { matchAll, PARAMETRIC_GRAMMAR_REGEX, IN_PARAMS_REGEX } from '../../utils/regex';

class lSystemProducer {
	constructor(axiom, maxLevels = false) {
		this._productionArray = [];
		this._rules = {};
		this._ruleSets = {};
		if (axiom) {
			this._productionArray[0] = [axiom];
		}
		this._constants = {};
		this._constantSets = {};
		this.maxLevels = maxLevels;
		this.currentLevel = 0;
	}
	get constants() {
		return Object.keys(this._constants).reduce((sum, key) => {
			sum[key] = this.getConstant(key);
			return sum;
		}, {})
	}
	// getters/setters
	set axiom(newAxiom) {
		this._productionArray[0] = [newAxiom];
		this.currentLevel = 0;
		return this.write();
	}
	get axiom() {
		return this._productionArray[0][0]
	}
	isStringable(item) {
		return typeof item !== undefined && (typeof item == 'string' || typeof item == 'string' || typeof item == 'boolean')
	}
	getFromSet(key) {
		let found = this._ruleSets[key] && this._ruleSets[key].choose();
		if (!found) return false;
		return String(found.call && found(key) || found);
	}
	getFromConstantSet(key) {
		let found = this._constantSets[key] && this._constantSets[key].choose();
		if (!found) return false;
		return String(found.call && found(key) || found);
	}

	addRule(key, rule) {
		if (key == '-') { console.warn('lSystemProducer: no support for hyphen rules'); return false; }
		if (typeof key !== 'string' && typeof key !== 'number') return false;
		switch (typeof rule) {
			case 'number':
			case 'string':
				this.removeRule(key);
				this._rules[key] = String(rule);
				return true;
				break;
			case 'function':
				let args = [];
				args[rule.length - 1] = this.constants;
				if (!this.isStringable(rule(...args))) {
					console.warn(`lSystemProducer: could not add rule ${key} is the rule formatted properly?`);
					return false;
				}
				this.removeRule(key);
				this._rules[key] = rule;
				return true;
				break;
			case 'object':
				if (rule.constructor == Array) {
					return this.addRuleArray(key, rule);
					break;
				}
			case 'boolean':
			case 'undefined':
				console.warn(`lSystemProducer: could not add rule ${key} is the rule formatted properly?`);
				return false;
				break;
		}
	}
	addRuleArray(key, rule) {
		if(this.addRandomProbabilityRuleMaybe(key, rule)) return true;
		if(this.addDiscreetProbabilityRuleMaybe(key, rule)) return true;
		console.warn(`lSystemProducer: could not add rule ${key} is the rule formatted properly?`);
		return false;
	}
	addRules(newRules) {
		return Object.keys(newRules)
			.map((key) => {
				let added = this.addRule(key, newRules[key]);
				return added;
			})
	}
	addRandomProbabilityRuleMaybe(key, rule) {
		let args = [];
		args[rule.length - 1] = this.constants;
		let randomSettableItems = rule.filter((item) => this.isStringable(item) || (item && item.call && this.isStringable(item(...args))) );
		if (randomSettableItems.length == rule.length) {
			this.removeRule(key);
			this._ruleSets[key] = new RandomProbabilitySet(rule);
			this._rules[key] = this.getFromSet.bind(this, key);
			return true;
		}
		return false;
	}
	addDiscreetProbabilityRuleMaybe(key, rule) {
		let args = [];
		args[rule.length - 1] = this.constants;
		let discreetSettableItems = rule.filter((item) => {
			if (!item) return false;
			if (item.value) {
				return item.probability &&
								(this.isStringable(item.value) || //when value: 'string'
								item.value.call && this.isStringable(item.value(...args)) ) //when value: function
			} else if (item.set) {
				return item.probability && item.set.reduce((bool, setItem) => {
					return bool && (this.isStringable(setItem) || //when string
						(setItem && setItem.call && this.isStringable(setItem.call(...args))) ) //when function
				}, true)
			}
		});
		if (discreetSettableItems.length == rule.length) {
			this.removeRule(key);
			this._ruleSets[key] = new DiscreetProbabilitySet(rule);
			this._rules[key] = this.getFromSet.bind(this, key);
			return true;
		}
		return false;
	}
	removeRule(key) {
		this._rules[key] && delete this._rules[key];
		this._ruleSets[key] && delete this._ruleSets[key];
	}
	getRule(lookup, args=false, ctx={}) {
		let { left, right } = ctx, params = [];
		if (lookup.length > 1) {
			let otherParams = lookup.slice(1,lookup.length).match(IN_PARAMS_REGEX)[0];
			otherParams && otherParams.split(',').forEach((otherParam) => params.push(otherParam));
			lookup = lookup.charAt(0)
		}

		let rule = (left && right && this._rules[`${left}<${lookup}>${right}`]) || //get between
							 (left && this._rules[`${left}<${lookup}`]) || //get left
							 (right && this._rules[`${lookup}>${right}`]) || //get right
							 this._rules[lookup]; //default rule

		//call a rule if it's a function, try returning it if not, else return false
		args && args.forEach((arg) => params.push(arg))
		if(rule && rule.call && rule.length > 0) params.length = rule.length - 1;
		params.push(this.constants);
		return (rule && rule.call && rule(...params)) || rule || false;
	}

	addConstant(key, constant) {
		if (key == '-') { console.warn('lSystemProducer: no support for hyphen constants'); return false; }
		if (typeof key !== 'string' && isNaN(Number(key))) return false;
		switch (typeof constant) {
			case 'number':
				this.removeConstant(key);
				this._constants[key] = constant;
				return true;
				break;
			case 'object':
				if (constant.constructor == Array) {
					return this.addConstantArray(key, constant);
					break;
				}
			case 'function':
			case 'number':
			case 'string':
			case 'boolean':
			case 'undefined':
				console.warn(`lSystemProducer: could not add constant ${key}; constants can only be numbers or array of numbers.`);
				return false;
				break;
		}
	}
	addConstants(newConstants) {
		return Object.keys(newConstants)
			.map((key) => {
				let added = this.addConstant(key, newConstants[key]);
				return added;
			})
	}
	addConstantArray(key, constant) {
		if(this.addRandomProbabilityConstantMaybe(key, constant)) return true;
		if(this.addDiscreetProbabilityConstantMaybe(key, constant)) return true;
		console.warn(`lSystemProducer: could not add constant ${key} is the constant formatted properly?`);
		return false;
	}

	addRandomProbabilityConstantMaybe(key, constant) {
		let randomSettableItems = constant.filter((item) => !isNaN(Number(item)) );
		if (randomSettableItems.length == constant.length) {
			this.removeConstant(key);
			this._constantSets[key] = new RandomProbabilitySet(constant);
			this._constants[key] = this.getFromConstantSet.bind(this, key);
			return true;
		}
		return false;
	}

	addDiscreetProbabilityConstantMaybe(key, constant) {
		let discreetSettableItems = constant.filter((item) => {
			if (!item) return false;
			if (item.set) {
				return item.probability && item.set.reduce((bool, setItem) => {
					return bool && !isNaN(Number(setItem))//when number
				}, true)
			} else {
				return item.probability &&!isNaN(Number(item.value))//when value: number
			}
		});
		if (discreetSettableItems.length == constant.length) {
			this.removeConstant(key);
			this._constantSets[key] = new DiscreetProbabilitySet(constant);
			this._constants[key] = this.getFromConstantSet.bind(this, key);
			return true;
		}
		return false;
	}

	removeConstant(key) {
		this._constants[key] && delete this._constants[key];
		this._constantSets[key] && delete this._constantSets[key];
	}

	getConstant(lookup) {
		let constant = this._constants[lookup];
		return Number(constant == undefined ? constant : constant.call ? constant() : constant);
	}
	iterateLevels(callback, start=0, end=this._productionArray.length) {
		let val, sum = [];
		range(start,end).forEach((pIndex) => {
			val = this.iterateLevel(callback, pIndex);
			if (val == undefined) return;
			val.forEach((item) => sum.push(item));
			val.length = 0;
		})
		return sum;
	}

	iterateLevel(callback, level=this.currentLevel) {
		let left, right, production = this._productionArray[level];
		if (!production) {
			console.warn(`lSystemProducer: production at level ${level} is not defined, cannot iterate.`);
			return false;
		}
		let val, params = false, sum = [];
 		production.forEach((item, index) => {
 			if(index !== 0) left = production[index - 1];
 			right = production[index+1];
			if (left && left.length > 1) left = left.charAt(0);
			if (right && right.length > 1) right = right.charAt(0);
			if (item.length > 1) {
				//remove the first letter and get the
				params = item.slice(1,item.length).match(IN_PARAMS_REGEX)[0];
				params = params.split(',')
			}
 			val = callback(item.charAt(0), params, { level, index, left, right });
 			params = false;

 			if (val == undefined) return;
 			sum.push(val)
 		})
 		return sum;
	}

	write(start=0, end=this.maxLevels) {
		let startingLevel = start;
		if (!this.axiom) {
			return new Promise(function(resolve, reject){
				reject('lSystemProducer: no axiom defined, cannot write without an axiom');
			})
		}
		while (!this._productionArray[startingLevel]) startingLevel--;
		this.currentLevel = startingLevel;
		return this.produce(end - startingLevel);
	}

	produce(count=1) {
		return new Promise(function(resolve, reject){
			let thisLevel, thisProduction, prevLevel, currentLevel = this.currentLevel, produced = '', newProduction = '', matched = [], args=[];
			if (!this._productionArray[this.currentLevel]) {
				reject(`lSystemProducer: production at level ${thisLevel} is not defined, cannot create a new production.`);
			}
			setTimeout(function(){
				for (let i = 1; i <= count; i++) {
					newProduction = [];
					thisLevel = currentLevel + i;
					prevLevel = currentLevel + (i - 1);
					if (this.maxLevels && (thisLevel > this.maxLevels)) {
						reject(`lSystemProducer: a max level was defined, cannot level past level ${this.maxLevels}`);
						return false;
					}
					thisProduction = this._productionArray[prevLevel];
					for (let j = 0; j< thisProduction.length; j++) {
						produced = this.getRule(thisProduction[j], [], thisProduction[j - 1], thisProduction[j + 1]) || String(thisProduction[j]);
						matched = matchAll(produced, PARAMETRIC_GRAMMAR_REGEX);
						matched.forEach((item) => newProduction.push(item))
						matched.length = 0;
					}
					this._productionArray[thisLevel] = newProduction
				}
				this.currentLevel += count;
				this._productionArray.length = this.currentLevel + 1;
				resolve(this._productionArray);
			}.bind(this), 0)
		}.bind(this))

	}
}

export { lSystemProducer }
