import { RandomProbabilitySet, DiscreetProbabilitySet } from '../probability'

class lSystem {
	constructor(axiom, maxSteps = false) {
		this._production = [];
		this._rules = {};
		this._sets = [];
		if (axiom) this._production[0] = axiom;
		this.maxSteps = maxSteps;
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
		this._production[0] = newAxiom;
		this.build();
		this.currentStep = 0;
	}
	get axiom() {
		return this._production[0]
	}
	isStringable(item) {
		return typeof item !== undefined && (typeof item == 'string' || typeof item == 'string' || typeof item == 'boolean')
	}
	getFromSet(key) {
		let found = this._sets[key] && this._sets[key].choose();
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
			this._sets[key] = new RandomProbabilitySet(rule);
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
			this._sets[key] = new DiscreetProbabilitySet(rule);
			this._rules[key] = this.getFromSet.bind(this, key);
			return true;
		}
		return false;
	}
	addRuleArray(key, rule) {
		if(this.addRandomProbabilityRuleMaybe(key, rule)) return true;
		if(this.addDiscreetProbabilityRuleMaybe(key, rule)) return true;
		console.warn(`lSystem: could not add rule ${key} is the rule formatted properly?`);
		return false;
	}
	addRule(key, rule) {
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
					console.warn(`lSystem: could not add rule ${key} is the rule formatted properly?`);
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
				console.warn(`lSystem: could not add rule ${key} is the rule formatted properly?`);
				return false;
				break;
		}
	}
	removeRule(key) {
		this._rules[key] && delete this._rules[key];
		this._sets[key] && delete this._sets[key];
	}
	getRule (key, args=false, left=false, right=false) {
		let betweenContext = left && right && `${left}<${key}>${right}` || false;
		let leftContext = left && `${left}<${key}` || false;
		let rightContext = right && `${key}>${right}` || false;
		let rule = betweenContext && this._rules[betweenContext] || //get between
							 leftContext && this._rules[leftContext] || //get left
							 rightContext && this._rules[rightContext] || //get right
							 this._rules[key]; //default rule
		//call a rule if it's a function, try returning it if not, else return false
		let a = args && [key].concat(args) || [key]
		return (rule && rule.call && rule(...a)) || rule || false;
	}

	iterateSteps(callback) {
		return this._production.map((production, pIndex) => this.iterateStep(callback, pIndex))
	}

	iterateStep(callback, step=this.currentStep) {
 		return this._production[step].split('').map((item, iIndex) => callback(item, step, iIndex))
	}

	build(start=0, end=this.maxSteps) {
		let startingStep = start;
		if (!this.axiom) { console.warn('no axiom defined, cannot build without an axiom'); return false; }
		while (!this._production[startingStep]) startingStep--;
		this.currentStep = startingStep;
		this.step(end - startingStep);
		//builds out the whole lSystem
	}
	step(count=1) {
		let thisStep, thisProduction, prevStep, currentStep = this.currentStep, newProduction = '';
		if (typeof this._production[this.currentStep] !== 'string') { console.warn(`production at step ${thisStep} is not defined, cannot create a new production.`); return }

		for (let i = 1; i <= count; i++) {
			newProduction = '';
			thisStep = currentStep + i;
			prevStep = currentStep + (i - 1);
			if (this.maxSteps && (thisStep > this.maxSteps)) { console.warn(`a max step was defined, cannot step past step ${this.maxSteps}`); return }
			thisProduction = this._production[prevStep];
			for (let j = 0; j< thisProduction.length; j++) {
				newProduction += this.getRule(thisProduction[j], [j], thisProduction[j - 1], thisProduction[j + 1]) || String(thisProduction[j]);
			}
			this._production[thisStep] = newProduction;
		}
		this.currentStep += count;
		this._production.length = this.currentStep + 1;
	}
	getProduction(step=this.currentStep) {
		//get sentence at step
	}
}

export { lSystem }
