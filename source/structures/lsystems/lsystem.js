class lSystem {
	constructor() {
		this._axiom;
		this._production = [];
		this._rules = {};
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

	setRules(newRules) {
	}
	addRuleArray(key, rule) {
					rule.map(() => {

					})
	}
	addRule(key, rule) {
		if (typeof key !== 'string') return false;
		switch (typeof rule) {
			case 'string':
				this._rules[key] = rule;
				return true;
				break;
			case 'function':
				if (typeof rule(key) !== 'string') return false;
				this._rules[key] = rule;
				return true;
				break;
			case 'object':
				if (rule.constructor == Array) {
					return this.addRuleArray(key, rule)
				} else {

				}
				break;
			case 'boolean':
			case 'undefined':
				return false;
				break;
		}
	}
	getRule (key) {
		return this._rules[key] || false;
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
