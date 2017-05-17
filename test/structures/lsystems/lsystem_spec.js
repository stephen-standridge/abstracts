import {expect} from 'chai';
import {uniqBy} from 'lodash';
const lSystem = abstracts.lsystems.lSystem;

describe('lSystem', ()=>{
	let lsystem;

	beforeEach(() => {
		lsystem = new lSystem();
	})
	describe('#axiom', ()=>{
		it('should set the axiom',() => {
			lsystem.axiom = 'B'
			expect(lsystem.axiom).to.equal('B')
		})
		it('should rebuild the entire tree', () => {
			let buildSpy = sinon.spy(lsystem, 'build')
			lsystem.axiom = 'B';
			expect(buildSpy).to.have.been.called;
		})
	})
	describe('#addRule', () => {
		it('should not take an undefined rule', () => {
			expect(lsystem.addRule('B', undefined)).to.equal(false)
			expect(lsystem.getRule('B')).to.equal(false)
		})
		it('should stringify a non-string key', () => {
			expect(lsystem.addRule(5, 'C')).to.equal(true)
			expect(lsystem.getRule(5)).to.equal('C')
		})
		describe('with a string rule', () => {
			it('should add the rule', () => {
				expect(lsystem.addRule('B', 'C')).to.equal(true)
				expect(lsystem.getRule('B')).to.equal('C')
			})
		})
		describe('with a function', () => {
			it('should add the rule', () => {
				expect(lsystem.addRule('B', () => 'C')).to.equal(true)
				expect(lsystem.getRule('B')).to.equal('C')
			})
			it('should test the return value is a string', () => {
				expect(lsystem.addRule('B', () => 5)).to.equal(false)
				expect(lsystem.getRule('B')).to.equal(false)
			})
		})
		describe('with an array', () => {
			it('should defer to addRuleArray', () => {
				let arrayRuleSpy = sinon.spy(lsystem, 'addRuleArray')
				let testArray = ['C', 'D', 'E']
				lsystem.addRule('B', testArray);
				expect(arrayRuleSpy).to.have.been.calledWith('B', testArray);
			})
		})
	})
	describe('#addRuleArray', () => {
		it('should add a RandomProbabilitySet', () => {
			let testArray = ['C', 'D', 'E'];
			lsystem.addRuleArray('B', testArray);
			expect(testArray.includes(lsystem.getRule('B'))).to.equal(true);
		})
		it('should add a RandomProbabilitySet with functions that return strings', () => {
			let testFunctions = [function(){ return 'C'}, function(){ return 'D'}];
			lsystem.addRuleArray('B', testFunctions);
			expect(['C', 'D'].includes(lsystem.getRule('B'))).to.equal(true);
		})
		it('should add a RandomProbabilitySet with mixed', () => {
			let testFunctions = [function(){ return 'C'}, 'D'];
			lsystem.addRuleArray('B', testFunctions);
			expect(['C', 'D'].includes(lsystem.getRule('B'))).to.equal(true);
		})
		describe('with objects', () => {
			it('should not add anything when probability is not present', (done) => {
				let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E' }];
				try {
					lsystem.addRuleArray('B', testArray);
					done('did not throw error')
				} catch (e) {
					expect(e.message).to.equal(`lSystem: could not add rule B is the rule formatted properly?`)
					expect(lsystem.getRule('B')).to.equal(false);
					done();
				}
			})
			describe('with value', () => {
				it('should add a DistributedProbabilitySet when the value is a string', () => {
					let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E', probability: 10 }];
					lsystem.addRuleArray('B', testArray);
					expect(['C', 'D', 'E'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should add a DistributedProbabilitySet when the value returns a string', () => {
					let testFunctionValues = [
						{ value: function() { return 'C' }, probability: 20 },
						{ value: function() { return 'D' }, probability: 10 },
						{ value: function() { return 'E' }, probability: 15 }];
					lsystem.addRuleArray('B', testFunctionValues);
					expect(['C', 'D', 'E'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should add a DistributedProbabilitySet when mixed', () => {
					let testFunctionValues = [
						{ value: function() { return 'C' }, probability: 20 },
						{ value: 'D', probability: 10 },
						{ value: function() { return 'E' }, probability: 15 }];
					lsystem.addRuleArray('B', testFunctionValues);
					expect(['C', 'D', 'E'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should not add undefined values', (done) => {
					let testArray = [{ value: 'C', probability: 20 }, { value: undefined, probability: 10 }, { value: 'E', probability: 15 }];
					try {
						lsystem.addRuleArray('B', testArray);
						done('did not throw error')
					} catch (e) {
						expect(e.message).to.equal(`lSystem: could not add rule B is the rule formatted properly?`)
						expect(lsystem.getRule('B')).to.equal(false);
						done();
					}
				})
				it('should not add functions that return undefined values', (done) => {
					let testFunctionValues = [
						{ value: function() { return 'C' }, probability: 20 },
						{ value: function() { 'D' }, probability: 10 },
						{ value: function() { return 'E' }, probability: 15 }];
						try {
							lsystem.addRuleArray('B', testFunctionValues);
							done('did not throw error')
						} catch (e) {
							expect(e.message).to.equal(`lSystem: could not add rule B is the rule formatted properly?`)
							expect(lsystem.getRule('B')).to.equal(false);
							done();
						}
				})
			})
			describe('with set/max', () => {
				it('should add a DistributedProbabilitySet when the set contains string', () => {
					let testArray = [{ set: ['C', 'D', 'E'], probability: 20 }, { value: 'F', probability: 10 }];
					lsystem.addRuleArray('B', testArray);
					expect(['C', 'D', 'E', 'F'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should add a DistributedProbabilitySet when the value returns a string', () => {
					let testFunctionValues = [
						{ set: [function() { return 'C' }, function() { return 'D' }], probability: 20 },
						{ value: function() { return 'E' }, probability: 15 }];
					lsystem.addRuleArray('B', testFunctionValues);
					expect(['C', 'D', 'E'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should not add undefined values', (done) => {
					let testArray = [{ set: ['C', undefined], probability: 20 }, { value: 'E', probability: 15 }];
						try {
							lsystem.addRuleArray('B', testArray);
							done('did not throw error')
						} catch (e) {
							expect(e.message).to.equal(`lSystem: could not add rule B is the rule formatted properly?`)
							expect(lsystem.getRule('B')).to.equal(false);
							done();
						}
				})
				it('should not add functions that return undefined values', (done) => {
					let testFunctionValues = [
						{ set: [function() { return 'C' }, function(){} ], probability: 20 },
						{ value: function() { return 'E' }, probability: 15 }];
						try {
							lsystem.addRuleArray('B', testFunctionValues);
							done('did not throw error')
						} catch (e) {
							expect(e.message).to.equal(`lSystem: could not add rule B is the rule formatted properly?`)
							expect(lsystem.getRule('B')).to.equal(false);
							done();
						}
				})
			})
		})
	})
	describe('#setRules', () => {
		it('should set the rules to the rule set')
		it('should not take an undefined rule')
	})
	describe('#addConstant', () => {
		it('should set the constant to the constants set')
		it('should not take an undefined constant')
	})
	describe('#setConstants', () => {
		it('should set the constant to the constants set')
		it('should not take an undefined constant')
	})
	describe('#iterate', () => {
		it('should iterate over each production')
	})
	describe('#build', () => {
		it('should build from the starting index to the ending index')
		it('should not go past the maxStep')
		it('should iterate from 0 to maxStep by default')
	})
	describe('#step', () => {
		it('should build the next step')
		it('should change the current level to the next level')
		it('should not allow stepping past the maxStep')
		it('should destroy all future steps')
		describe('with a string rule', () => {
			it('should add a determined node to the production')
		})
		describe('with a function', () => {
			it('should evaluate the function and add it to the production')
			it('should only add strings')
		})
		describe('with an array', () => {
			it('should add one of the items as a node to the production')
			it('should only add strings')
		})
		describe('with an object', () => {
			it('should only add strings')
		})
	})
	describe('#getProduction', () => {
		it('should build to the step if it is not built')
		it('should get the production at the given step')
		it('should get the current step by default')
	})
	describe('#setProduction', () => {
		it('should build to the step if it is not built')
		it('should set the production at the given step')
		it('should set the current step by default')
		it('should warn if the production doesnt match the rules')
	})
	describe('#getProductions', () => {
		it('should get the productions')
		it('should take a delimeter')
	})
	describe('#setProductions', () => {
		it('should set the productions to the array')
		it('should warn if the production doesnt match the rules')
	})
})
