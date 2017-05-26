import { range } from 'lodash';
import { RandomProbabilitySet, DiscreetProbabilitySet } from '../probability'
import { matchAll, PARAMETRIC_GRAMMAR_REGEX, IN_PARAMS_REGEX } from '../../utils/regex';

class lSystemProducer {
	constructor(axiom, maxLevels = false) {
		this._production = [];
		this._productionArray = [];
		this._rules = {};
		this._ruleSets = {};
		if (axiom) {
			this._production[0] = axiom;
			this._productionArray[0] = [axiom];
		}
		this.maxLevels = maxLevels;
		this.currentLevel = 0;
	}
	// getters/setters
	set axiom(newAxiom) {
		this._production[0] = newAxiom;
		this._productionArray[0] = [newAxiom];
		this.write();
		this.currentLevel = 0;
	}
	get axiom() {
		return this._production[0]
	}
	isStringable(item) {
		return typeof item !== undefined && (typeof item == 'string' || typeof item == 'string' || typeof item == 'boolean')
	}
	getFromSet(key) {
		let found = this._ruleSets[key] && this._ruleSets[key].choose();
		if (!found) return false;
		return String(found.call && found(key) || found);
	}

	addRules(newRules) {
		return Object.keys(newRules)
			.map((key) => {
				let added = this.addRule(key, newRules[key]);
				return added;
			})
	}
	addRandomProbabilityRuleMaybe(key, rule) {
		let randomSettableItems = rule.filter((item) => this.isStringable(item) || (item && item.call && this.isStringable(item(key))) );
		if (randomSettableItems.length == rule.length) {
			this.removeRule(key);
			this._ruleSets[key] = new RandomProbabilitySet(rule);
			this._rules[key] = this.getFromSet.bind(this, key);
			return true;
		}
		return false;
	}
	addDiscreetProbabilityRuleMaybe(key, rule) {
		let discreetSettableItems = rule.filter((item) => {
			if (!item) return false;
			if (item.value) {
				return item.probability &&
								(this.isStringable(item.value) || //when value: 'string'
								item.value.call && this.isStringable(item.value(key)) ) //when value: function
			} else if (item.set) {
				return item.probability && item.set.reduce((bool, setItem) => {
					return bool && (this.isStringable(setItem) || //when string
						(setItem && setItem.call && this.isStringable(setItem.call(key))) ) //when function
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
	addRuleArray(key, rule) {
		if(this.addRandomProbabilityRuleMaybe(key, rule)) return true;
		if(this.addDiscreetProbabilityRuleMaybe(key, rule)) return true;
		console.warn(`lSystemProducer: could not add rule ${key} is the rule formatted properly?`);
		return false;
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
				if (!this.isStringable(rule(key))) {
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
	removeRule(key) {
		this._rules[key] && delete this._rules[key];
		this._ruleSets[key] && delete this._ruleSets[key];
	}
	getRule(lookup, args=false, ctx={}) {
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
		let rule = betweenContext && this._rules[betweenContext] || //get between
							 leftContext && this._rules[leftContext] || //get left
							 rightContext && this._rules[rightContext] || //get right
							 this._rules[key]; //default rule
		//call a rule if it's a function, try returning it if not, else return false
		params = args && params.concat(args) || params;
		return (rule && rule.call && rule(...params)) || rule || false;
	}

	iterateLevels(callback, start=0, end=this._productionArray.length) {
		let val;
		return range(start,end).reduce((sum, pIndex) => {
			val = this.iterateLevel(callback, pIndex);
			return val !== undefined && sum.concat(val) || sum;
		}, [])
	}

	iterateLevel(callback, level=this.currentLevel) {
		let left, right, production = this._productionArray[level];
		if (!production) {
			console.warn(`lSystemProducer: production at level ${level} is not defined, cannot iterate.`);
			return false;
		}
		let val;
 		return production.reduce((sum, item, index) => {
 			if(index !== 0) left = production[index - 1];
 			right = production[index+1];
			let key = String(item).slice(), params = false;
			if (left && left.length > 1) left = left.slice(0,1);
			if (right && right.length > 1) right = right.slice(0,1);
			if (key.length > 1) {
				//remove the first letter and get the
				params = key.slice(1,key.length).match(IN_PARAMS_REGEX)[0];
				params = params.split(',')
				key = key.slice(0,1);
			}
 			val = callback(key, params, { level, index, left, right })
			return val !== undefined && sum.concat(val) || sum;
 		}, [])
	}

	write(start=0, end=this.maxLevels) {
		let startingLevel = start;
		if (!this.axiom) {
			console.warn('lSystemProducer: no axiom defined, cannot write without an axiom');
			return false;
		}
		while (!this._productionArray[startingLevel]) startingLevel--;
		this.currentLevel = startingLevel;
		this.produce(end - startingLevel);
	}

	produce(count=1) {
		let thisLevel, thisProduction, prevLevel, currentLevel = this.currentLevel, produced = '', newProduction = '', args=[];
		if (!this._productionArray[this.currentLevel] && typeof this._production[this.currentLevel] !== 'string') {
			console.warn(`lSystemProducer: production at level ${thisLevel} is not defined, cannot create a new production.`);
			return false;
		}

		for (let i = 1; i <= count; i++) {
			newProduction = [];
			thisLevel = currentLevel + i;
			prevLevel = currentLevel + (i - 1);
			if (this.maxLevels && (thisLevel > this.maxLevels)) {
				console.warn(`lSystemProducer: a max level was defined, cannot level past level ${this.maxLevels}`);
				return false;
			}
			thisProduction = this._productionArray[prevLevel] || matchAll(this._production[prevLevel], PARAMETRIC_GRAMMAR_REGEX);
			for (let j = 0; j< thisProduction.length; j++) {
				produced = this.getRule(thisProduction[j], [j], thisProduction[j - 1], thisProduction[j + 1]) || String(thisProduction[j]);
				newProduction = newProduction.concat(matchAll(produced, PARAMETRIC_GRAMMAR_REGEX));
			}
			this._productionArray[thisLevel] = newProduction
			this._production[thisLevel] = newProduction.join('');
		}
		this.currentLevel += count;
		this._production.length = this.currentLevel + 1;
		this._productionArray.length = this.currentLevel + 1;
	}
}

export { lSystemProducer }
