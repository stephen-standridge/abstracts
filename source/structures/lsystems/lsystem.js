import { RandomProbabilitySet, DiscreetProbabilitySet } from '../probability'

class lSystem {
	constructor() {
		this._axiom;
		this._production = [];
		this._rules = {};
		this._sets = [];
		this.maxStep = 0;
		this.currentStep = 0;
	}
	set production(newProduction) {
		//set production at curentStep to newProduction
	}
	get production() {
		//get production at currentStep
	}
	set productions(newProductions) {
		//set all productions to newProductions
	}
	get productions() {
		//return all productions
		return this._production;
	}
	// getters/setters
	set axiom(newAxiom) {
		this._axiom = newAxiom;
		this.build();
	}
	get axiom() {
		return this._axiom
	}
	isStringable(item) {
		return typeof item !== undefined && (typeof item == 'string' || typeof item == 'string' || typeof item == 'boolean')
	}
	getFromSet(key) {
		let found = this._sets[key] && this._sets[key].choose();
		if (!found) return false;
		return String(found.call && found(key) || found);
	}

	setRules(newRules) {
	}
	addRuleArray(key, rule) {
		let randomSettableItems = rule.filter((item) => this.isStringable(item) || item.call && this.isStringable(item(key)));
		if (randomSettableItems.length == rule.length) {
			this._sets[key] = new RandomProbabilitySet(rule);
			this._rules[key] = this.getFromSet.bind(this, key);
			return;
		}

		let discreetSettableItems = rule.filter((item) => {
			if (item.value) {
				return item.probability &&
								( this.isStringable(item.value) || //when value: 'string'
								item.value.call && this.isStringable(item.value(key)) ) //when value: function
			} else if (item.set) {
				return item.probability && item.set.reduce((bool, setItem) => {
					return bool && (this.isStringable(setItem) || //when string
						(setItem && setItem.call && this.isStringable(setItem.call(key))) ) //when function
				}, true)
			}
		});
		if (discreetSettableItems.length == rule.length) {
			this._sets[key] = new DiscreetProbabilitySet(rule);
			this._rules[key] = this.getFromSet.bind(this, key);
			return;
		}
		throw new Error(`lSystem: could not add rule ${key} is the rule formatted properly?`, 'lsystem.js');
	}
	addRule(key, rule) {
		if (typeof key !== 'string' && typeof key !== 'number') return false;
		switch (typeof rule) {
			case 'number':
			case 'string':
				this._rules[key] = String(rule);
				return true;
				break;
			case 'function':
				if (!this.isStringable(rule(key))) return false;
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
				return false;
				break;
		}
	}
	getRule (key) {
		let rule = this._rules[key];
		//call a rule if it's a function, try returning it if not, else return false
		return (rule && rule.call && rule(key)) || rule || false;
	}

	setConstants(newConstants) {
	}
	addConstant(key, value) {
		//add one constant to the list of constants
	}

	build(start=0, end=this.maxStep) {
		//builds out the whole lSystem
	}
	step(count=1) {
		//step count times and build
	}
	getProduction(step=this.currentStep) {
		//get sentence at step
	}
}

export { lSystem }
