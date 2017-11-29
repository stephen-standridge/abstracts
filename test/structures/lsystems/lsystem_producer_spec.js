import {expect} from 'chai';
import {uniqBy} from 'lodash';
import { lSystemProducer } from '../../../source/structures/lsystems';
import { RandomProbabilitySet, DiscreetProbabilitySet } from '../../../source/structures/probability';

describe('lSystemProducer', ()=>{
	let lsystem;

	beforeEach(() => {
		lsystem = new lSystemProducer();
		lsystem.axiom = 'A';
	})
	describe('#axiom', ()=>{
		it('should set the axiom',() => {
			lsystem.axiom = 'B'
			expect(lsystem.axiom).to.equal('B')
		})
		it('should rewrite the entire tree', () => {
			let writeSpy = sinon.spy(lsystem, 'write')
			lsystem.axiom = 'B';
			expect(writeSpy).to.have.been.called;
		})
		it('should set the axiom as the first production', () => {
			lsystem.axiom = 'B'
			expect(lsystem._productionArray[0]).to.deep.equal(['B'])
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
			it('should call remove rule', () => {
				expect(lsystem.addRule('B', 'C')).to.equal(true)
				let removeRuleSpy = sinon.spy(lsystem, 'removeRule');
				expect(lsystem.addRule('B', 'D')).to.equal(true)
				expect(removeRuleSpy).to.have.been.calledWith('B')
				expect(lsystem.getRule('B')).to.equal('D')
			})
		})
		describe('with a function', () => {
			it('should add the rule', () => {
				expect(lsystem.addRule('B', () => 'C')).to.equal(true)
				expect(lsystem.getRule('B')).to.equal('C')
			})
			it('should call remove rule', () => {
				expect(lsystem.addRule('B', () => 'C')).to.equal(true)
				let removeRuleSpy = sinon.spy(lsystem, 'removeRule');
				lsystem.addRule('B', () => 'D')
				expect(removeRuleSpy).to.have.been.calledWith('B')
				expect(lsystem.getRule('B')).to.equal('D')
			})
			it('should test the return value is a string', () => {
				expect(lsystem.addRule('B', () => 5)).to.equal(false)
				expect(lsystem.getRule('B')).to.equal(false)
			})
			it('should handle arguments', () => {
				expect(lsystem.addRule('B', (a,b,consts) => { return `C(${a/b},${consts.R})` })).to.equal(true)
				expect(lsystem.getRule('B')).to.equal('C(NaN,undefined)')
				lsystem.addConstant('R', 123)
				expect(lsystem.getRule('B', [1,2])).to.equal('C(0.5,123)')
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
		describe('with stochastic rules', () => {
			it('should convert the rule to a discreet probability rule')
			it('should extend existing discreet probability rules')
			it('should convert existing random probability rules to discreet probability rules')
		})
	})
	describe('#addRuleArray', () => {
		it('should add a RandomProbabilitySet', () => {
			let testArray = ['C', 'D', 'E'];
			lsystem.addRuleArray('B', testArray);
			expect(testArray.includes(lsystem.getRule('B'))).to.equal(true);
		})
		it('should remove existing rules', () => {
			let testArray = ['C', 'D', 'E'];
			let testArray2 = ['F', 'G', 'H'];
			lsystem.addRuleArray('B', testArray2);
			let removeRuleSpy = sinon.spy(lsystem, 'removeRule');
			lsystem.addRuleArray('B', testArray);
			expect(removeRuleSpy).to.have.been.calledWith('B');
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
			it('should not add anything when probability is not present', () => {
				let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E' }];
					lsystem.addRuleArray('B', testArray);
					expect(lsystem.getRule('B')).to.equal(false);
			})
			describe('with value', () => {
				it('should add a DistributedProbabilitySet when the value is a string', () => {
					let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E', probability: 10 }];
					lsystem.addRuleArray('B', testArray);
					expect(['C', 'D', 'E'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should remove existing rules', () => {
					let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E', probability: 10 }];
					let testArray2 = [{ value: 'F', probability: 20 }, { value: 'G', probability: 10 }, { value: 'H', probability: 10 }];
					lsystem.addRuleArray('B', testArray2);
					let removeRuleSpy = sinon.spy(lsystem, 'removeRule')
					lsystem.addRuleArray('B', testArray);
					expect(removeRuleSpy).to.have.been.calledWith('B')
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
				it('should not add undefined values', () => {
					let testArray = [{ value: 'C', probability: 20 }, { value: undefined, probability: 10 }, { value: 'E', probability: 15 }];
					lsystem.addRuleArray('B', testArray);
					expect(lsystem.getRule('B')).to.equal(false);
				})
				it('should not add functions that return undefined values', () => {
					let testFunctionValues = [
						{ value: function() { return 'C' }, probability: 20 },
						{ value: function() { 'D' }, probability: 10 },
						{ value: function() { return 'E' }, probability: 15 }];
						lsystem.addRuleArray('B', testFunctionValues);
						expect(lsystem.getRule('B')).to.equal(false);

				})
			})
			describe('with set/max', () => {
				it('should add a DistributedProbabilitySet when the set contains string', () => {
					let testArray = [{ set: ['C', 'D', 'E'], probability: 20 }, { value: 'F', probability: 10 }];
					lsystem.addRuleArray('B', testArray);
					expect(['C', 'D', 'E', 'F'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should remove existing rules', () => {
					let testArray = [{ set: ['C', 'D', 'E'], probability: 20 }, { value: 'B', probability: 10 }];
					let testArray2 = [{ set: ['F', 'G', 'H'], probability: 20 }, { value: 'I', probability: 10 }];
					lsystem.addRuleArray('B', testArray2);
					let removeRuleSpy = sinon.spy(lsystem, 'removeRule')
					lsystem.addRuleArray('B', testArray);
					expect(removeRuleSpy).to.have.been.calledWith('B')
					expect(['B', 'C', 'D', 'E'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should add a DistributedProbabilitySet when the value returns a string', () => {
					let testFunctionValues = [
						{ set: [function() { return 'C' }, function() { return 'D' }], probability: 20 },
						{ value: function() { return 'E' }, probability: 15 }];
					lsystem.addRuleArray('B', testFunctionValues);
					expect(['C', 'D', 'E'].includes(lsystem.getRule('B'))).to.equal(true);
				})
				it('should not add undefined values', () => {
					let testArray = [{ set: ['C', undefined], probability: 20 }, { value: 'E', probability: 15 }];
					lsystem.addRuleArray('B', testArray);
					expect(lsystem.getRule('B')).to.equal(false);
				})
				it('should not add functions that return undefined values', () => {
					let testFunctionValues = [
						{ set: [function() { return 'C' }, function(){} ], probability: 20 },
						{ value: function() { return 'E' }, probability: 15 }];
						lsystem.addRuleArray('B', testFunctionValues);
						expect(lsystem.getRule('B')).to.equal(false);
				})
			})
		})
	})

	describe('#addRules', () => {
		it('should set the rules to the rule set', () => {
			let rules = {
				'B': [{ set: ['Z', 'X'], probability: 20 }, { value: 'Y', probability: 15 }],
				'C': [{ value: 'W', probability: 20 }, { value: 'V', probability: 10 }, { value: 'U', probability: 5 }],
				'D': () => { return 'T' },
				'E': 'S',
				'F': ['R', 'Q', 'P'],
				'G': [function(){ return 'O'}, function(){ return 'N'}]
			}
			expect(lsystem.addRules(rules)).to.deep.equal([true, true, true, true, true, true]);
			expect(['Z','X','Y'].includes(lsystem.getRule('B'))).to.equal(true)
			expect(['U','V','W'].includes(lsystem.getRule('C'))).to.equal(true)
			expect(lsystem.getRule('D')).to.equal('T')
			expect(lsystem.getRule('E')).to.equal('S')
			expect(['P','Q','R'].includes(lsystem.getRule('F'))).to.equal(true)
			expect(['O','N'].includes(lsystem.getRule('G'))).to.equal(true)
		})
		it('should warn about invalid rules', () => {
			let rules = {
				'B': [{ set: ['Z', undefined], probability: 20 }, { value: 'Y', probability: 15 }],
				'C': [{ value: 'W', probability: 20 }, { value: 'V', probability: 10 }, { value: 'U', probability: 5 }],
				'D': () => { 'T' },
				'E': 'S',
				'F': ['R', 'Q', undefined],
				'G': [function(){ return 'O'}, function(){ return 'N'}]
			}
			expect(lsystem.addRules(rules)).to.deep.equal([false, true, false, true, false, true]);
			expect(['Z','X','Y'].includes(lsystem.getRule('B'))).to.equal(false)
			expect(['U','V','W'].includes(lsystem.getRule('C'))).to.equal(true)
			expect(lsystem.getRule('D')).to.equal(false)
			expect(lsystem.getRule('E')).to.equal('S')
			expect(['P','Q','R'].includes(lsystem.getRule('F'))).to.equal(false)
			expect(['O','N'].includes(lsystem.getRule('G'))).to.equal(true)
		})
	})

	describe('#getRule', () => {
		beforeEach(() => {
			lsystem.addRules({
				'B': 'G',
				'A<B': 'D',
				'B>A': 'E',
				'A<B>A': 'F',
				'B>H': 'I',
				'H<B': 'J'
			})
		})
		it('should get basic rules', () => {
			expect(lsystem.getRule('B')).to.equal('G')
		})
		it('should return false if not found', () => {
			expect(lsystem.getRule('A')).to.equal(false)
		})
		it('should call the rule with the given arguments', () => {
			let testFunction = function(...args){ return 'yes'}
			let testObject = { testFunction };
			let testSpy = sinon.spy(testObject, 'testFunction');
			lsystem.addRule('Z', testObject.testFunction)
			lsystem.getRule('Z', [1, 2, 3])
			expect(testSpy).to.have.been.calledWith(1, 2, 3);
		})
		it('should call the rule with the constants as the last argument', () => {
			let testFunction = function(...args){ return 'yes'}
			let testObject = { testFunction };
			let testSpy = sinon.spy(testObject, 'testFunction');
			lsystem.addConstant('a', 1)
			lsystem.addConstant('b', [23, 23])
			lsystem.addConstant('c', [{ probability: 1, value: 27}, {probability: 1, value: 27}])
			lsystem.addRule('Z', testObject.testFunction)
			lsystem.getRule('Z', [1, 2, 3])
			expect(testSpy).to.have.been.calledWith(1, 2, 3, { a: 1, b: 23, c: 27});
		})
		describe('context-specific rules', () => {
			describe('left context match', () => {
				it('should get the context-specific rule', () => {
					expect(lsystem.getRule('B', [false], { left: 'A', right: undefined })).to.equal('D')
				})
				it('should return false for inverse matching', () => {
					expect(lsystem.getRule('A', [false], { left: undefined, right: 'B' })).to.equal(false)
				})
				it('should return the default rule if not found', () => {
					expect(lsystem.getRule('B', [false], { left: 'C', right: undefined })).to.equal('G')
				})
			})
			describe('right context match', () => {
				it('should get the context-specific rule', () => {
					expect(lsystem.getRule('B', [false], { left: undefined, right: 'A' })).to.equal('E')
				})
				it('should return false for inverse matching', () => {
					expect(lsystem.getRule('A', [false], { left: 'B', right: undefined })).to.equal(false)
				})
				it('should return the default rule if not found', () => {
					expect(lsystem.getRule('B', [false], { left: false, right: 'C' })).to.equal('G')
				})
			})
			describe('between context match', () => {
				it('should get the context-specific rule with a matching between', () => {
					expect(lsystem.getRule('B', [false], { left: 'A', right: 'A' })).to.equal('F')
				})
				it('should partially match left', () => {
					expect(lsystem.getRule('B', [false], { left: 'C', right: 'A' })).to.equal('E')
				})
				it('should partially match right', () => {
					expect(lsystem.getRule('B', [false], { left: 'A', right: 'C' })).to.equal('D')
				})
				it('should return default rule if not found', () => {
					expect(lsystem.getRule('B', [false], { left: 'C', right: 'C' })).to.equal('G')
				})
			})
			it('should prioritize between, left, then right', () => {
				expect(lsystem.getRule('B', [false], { left: 'A', right: 'A' })).to.equal('F')
				expect(lsystem.getRule('B', [false], { left: 'H', right: 'A' })).to.equal('J')
				expect(lsystem.getRule('B', [false], { left: undefined, right: 'A' })).to.equal('E')
				expect(lsystem.getRule('B', [false], { left: 'A', right: 'H' })).to.equal('D')
				expect(lsystem.getRule('B', [false], { left: undefined,  right: 'H' })).to.equal('I')
			})
		})
	})

	describe('#produce', () => {
		let str1, str2, str3, str4;
		beforeEach(() => {
			str1 = 'BC';
			str2 = 'ABCAB';
			str3 = 'BCABCABBCABC';
			str4 = 'ABCAB+AB';
			lsystem.addRules({
				'A': 'BC',
				'B': 'ABC',
				'C': 'AB'
			})
		})
		it('should return a promise', (done) => {
			expect(lsystem.currentLevel).to.equal(0)
			lsystem.produce().then(function(){ done() })
		})
		it('should change the current level to the next level', (done) => {
			expect(lsystem.currentLevel).to.equal(0)
			lsystem.produce().then(function(){
				expect(lsystem.currentLevel).to.equal(1)
				done();
			})
		})
		it('should write the next production', (done) => {
			lsystem.produce().then(function(){
				expect(lsystem._productionArray[1]).to.deep.equal(str1.split(''))
				lsystem.produce().then(function(){
					expect(lsystem._productionArray[2]).to.deep.equal(str2.split(''))
					done();
				})
			})
		})
		it('should transfer non-found rules to the string', (done) => {
			lsystem._productionArray[1] = ['B','C','+','C'];
			lsystem.currentLevel = 1;
			lsystem.produce().then(function(){
				expect(lsystem._productionArray[2]).to.deep.equal(str4.split(''))
				done();
			})
		})
		it('should not allow stepping past the maxLevels', (done) => {
			lsystem.maxLevels = 2;
			lsystem.produce().then(function(){
				expect(lsystem._productionArray[1]).to.deep.equal(str1.split(''))
				lsystem.produce().then(function(){
					expect(lsystem._productionArray[2]).to.deep.equal(str2.split(''))
					lsystem.produce().catch(function(err){
						expect(err).to.equal('lSystemProducer: a max level was defined, cannot level past level 2')
						expect(lsystem._productionArray[3]).to.deep.equal(undefined)
						done();
					})
				})
			})
		})
		it('should destroy all future steps', (done) => {
			lsystem._productionArray[1] = 'BC+C';
			lsystem._productionArray[2] = 'ABCDEFGH';
			lsystem._productionArray[3] = 'DDDDD';
			lsystem.currentLevel = 1;
			lsystem.produce().then(function(){
				expect(lsystem._productionArray.length).to.equal(3);
				expect(lsystem._productionArray[3]).to.equal(undefined);
				done()
			})
		})
		it('should pass the current key and index into function rules', (done) => {
			let testFunction = function(arg1, arg2, arg3){ return 'yes'}
			let testObject = { testFunction };
			let testSpy = sinon.spy(testObject, 'testFunction');
			lsystem.addRule('B', testObject.testFunction)
			lsystem.produce().then(function(){
				lsystem.produce().then(function(){
					expect(testSpy).not.to.have.been.calledWith('B');
					expect(testSpy).to.have.been.called;
					testSpy.restore();
					done();
				}).catch(function(err){ done(err) })
			}).catch(function(err){ done(err) })
		})
		describe('parametric rules', () => {
			it('should attempt to call the method with the arguments if it encounters a parametric rule', (done) => {
				let testFunction = function(...args){ return 'yes' }
				let testObject = { testFunction };
				let testSpy = sinon.spy(testObject, 'testFunction');
				lsystem.addConstant('c', 123)
				lsystem.addRule('K', testObject.testFunction)
				lsystem._productionArray[1] = ['K(1,2)','K(2,3,4,5)'];
				lsystem.currentLevel = 1;
				lsystem.produce().then(function(){
					expect(testSpy).to.have.been.calledWith('1','2', {c: 123});
					expect(testSpy).to.have.been.calledWith('2','3','4','5',{c: 123});
					done();
				}).catch(function(err){ done(err)})
			})
		})
	})

	describe('#addConstant', () => {
		it('should not take anything other than a number')
		describe('with a number', () => {
			it('should add the constant', () => {
				expect(lsystem.addConstant('B', 1)).to.equal(true)
				expect(lsystem._constants['B']).to.equal(1)
			})
			it('should call remove constant', () => {
				expect(lsystem.addConstant('B', 1)).to.equal(true)
				let removeConstantSpy = sinon.spy(lsystem, 'removeConstant');
				lsystem.addConstant('B', 2)
				expect(removeConstantSpy).to.have.been.calledWith('B')
				expect(lsystem._constants['B']).to.equal(2)
			})
		})
	})
	describe('#addConstantArray', () => {
		it('should not take anything other than a number')
		it('should add a RandomProbabilitySet', () => {
			let testArray = [1, 2, 3];
			expect(lsystem.addConstantArray('B', testArray)).to.equal(true);
			expect(lsystem._constantSets['B'].constructor).to.equal(RandomProbabilitySet)
		})
		it('should remove existing constants', () => {
			let testArray = [1, 2, 3];
			let testArray2 = [4, 5, 6];
			expect(lsystem.addConstantArray('B', testArray2)).to.equal(true)
			let removeConstantSpy = sinon.spy(lsystem, 'removeConstant');
			expect(lsystem.addConstantArray('B', testArray)).to.equal(true)
			expect(removeConstantSpy).to.have.been.calledWith('B');
			expect(lsystem._constantSets['B'].constructor).to.equal(RandomProbabilitySet)
		})
		describe('with objects', () => {
			it('should not take anything other than a number')
			it('should not add anything when probability is not present', () => {
					let testArray = [{ value: 1, probability: 20 }, { value: 2, probability: 10 }, { value: 3 }];
					expect(lsystem.addConstantArray('B', testArray)).to.equal(false)
					expect(lsystem._constantSets['B']).to.equal(undefined)
			})
			describe('with value', () => {
				it('should add a DistributedProbabilitySet when the value is a number', () => {
					let testArray = [{ value: 1, probability: 20 }, { value: 2, probability: 10 }, { value: 3, probability: 10 }];
					expect(lsystem.addConstantArray('B', testArray)).to.equal(true)
					expect(lsystem._constantSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
				it('should remove existing constants', () => {
					let testArray = [{ value: 1, probability: 20 }, { value: 2, probability: 10 }, { value: 3, probability: 10 }];
					let testArray2 = [{ value: 4, probability: 20 }, { value: 5, probability: 10 }, { value: 6, probability: 10 }];
					expect(lsystem.addConstantArray('B', testArray2)).to.equal(true)
					let removeConstantSpy = sinon.spy(lsystem, 'removeConstant')
					expect(lsystem.addConstantArray('B', testArray)).to.equal(true)
					expect(removeConstantSpy).to.have.been.calledWith('B')
					expect(lsystem._constantSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
			})
			describe('with set/max', () => {
				it('should add a DistributedProbabilitySet when the set contains numbers', () => {
					let testArray = [{ set: [1, 2, 3], probability: 20 }, { value: 4, probability: 10 }];
					expect(lsystem.addConstantArray('B', testArray)).to.equal(true);
					expect(lsystem._constantSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
				it('should remove existing constants', () => {
					let testArray = [{ set: [1, 2, 3], probability: 20 }, { value: 4, probability: 10 }];
					let testArray2 = [{ set: [5, 6, 7], probability: 20 }, { value: 8, probability: 10 }];
					expect(lsystem.addConstantArray('B', testArray2)).to.equal(true)
					let removeConstantSpy = sinon.spy(lsystem, 'removeConstant')
					expect(lsystem.addConstantArray('B', testArray)).to.equal(true)
					expect(removeConstantSpy).to.have.been.calledWith('B')
					expect(lsystem._constantSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
			})
		})
	})

	describe('#addConstants', () => {
		it('should set the constants to the constant set', () => {
			let constants = {
				'B': [{ set: [1, 2], probability: 20 }, { value: 3, probability: 15 }],
				'C': [{ value: 4, probability: 20 }, { value: 5, probability: 10 }, { value: 6, probability: 5 }],
				'D': 7,
				'E': [8, 9, 0]
			}
			expect(lsystem.addConstants(constants)).to.deep.equal([true, true, true, true]);
			expect(lsystem._constantSets['B'].constructor).to.equal(DiscreetProbabilitySet)
			expect(lsystem._constantSets['C'].constructor).to.equal(DiscreetProbabilitySet)
			expect(lsystem._constants['D']).to.equal(7)
			expect(lsystem._constantSets['E'].constructor).to.equal(RandomProbabilitySet)
		})
		it('should warn about invalid constants', () => {
			let constants = {
				'B': [{ set: [0, undefined], probability: 20 }, { value: 'Y', probability: 15 }],
				'C': [{ value: 3, probability: 20 }, { value: 1, probability: 10 }, { value: 2, probability: 5 }],
				'D': 'R',
				'E': 3,
				'F': [4, 5, undefined]
			}
			expect(lsystem.addConstants(constants)).to.deep.equal([false, true, false, true, false]);
			expect(lsystem._constantSets['B']).to.equal(undefined)
			expect(lsystem._constants['B']).to.equal(undefined)
			expect(lsystem._constantSets['C'].constructor).to.equal(DiscreetProbabilitySet)
			expect(lsystem._constants['D']).to.equal(undefined)
			expect(lsystem._constantSets['D']).to.equal(undefined)
			expect(lsystem._constants['E']).to.equal(3)
			expect(lsystem._constants['F']).to.equal(undefined)
		})
	})

	describe('#getConstant', () => {
		beforeEach(() => {
			lsystem.addConstants({
				'B': 1,
				'C': [2,3,4],
				'D': [{ value: 7, probability: 20 }, { value: 5, probability: 10 }, { value: 6, probability: 5 }]
			})
		})
		it('should get basic constants', () => {
			expect(lsystem.getConstant('B')).to.equal(1)
		})
		it('should return not a number if not found', () => {
			expect(isNaN(lsystem.getConstant('A'))).to.equal(true)
		})
		it('should return a RandomProbabilitySet number', () => {
			expect(isNaN(Number(lsystem.getConstant('C')))).to.equal(false)
		})
		it('should return a DiscreetProbabilitySet number', () => {
			expect(isNaN(Number(lsystem.getConstant('D')))).to.equal(false)
		})
	})

	describe('#iterateLevels', () => {
		let testFunction, testObject, testSpy;
		beforeEach(() => {
			testFunction = function(key, step, index){ return 'yes'}
			testObject = { testFunction };
			testSpy = sinon.spy(testObject, 'testFunction');
			lsystem._productionArray[1] = 'BC+C'.split('');
			lsystem._productionArray[2] = 'DDD'.split('');
		})
		afterEach(() => {
			expect(testSpy).to.have.been.calledWith('B', false, { level: 1, index: 0, left: undefined, right: 'C' })
			expect(testSpy).to.have.been.calledWith('C', false, { level: 1, index: 1, left: 'B', right: '+' })
			expect(testSpy).to.have.been.calledWith('+', false, { level: 1, index: 2, left: 'C', right: 'C' })
			expect(testSpy).to.have.been.calledWith('C', false, { level: 1, index: 3, left: '+', right: undefined })
			testSpy.restore();
		})
		it('should iterate over each item in each production', () => {
			lsystem.iterateLevels(testObject.testFunction);
			expect(testSpy).to.have.been.calledWith('A', false, { level: 0, index: 0, left: undefined, right: undefined })
		})
		it('should take a start', () => {
			lsystem.iterateLevels(testObject.testFunction, 1);
			expect(testSpy).not.to.have.been.calledWith('A', false, { level: 0, index: 0, left: undefined, right: undefined })
			expect(testSpy).to.have.been.calledWith('D', false, { level: 2, index: 2, left: 'D', right: undefined })
		})
		it('should take an end', () => {
			lsystem.iterateLevels(testObject.testFunction, 1, 2);
			expect(testSpy).not.to.have.been.calledWith('A', false, { level: 0, index: 0, left: undefined, right: undefined })
			expect(testSpy).not.to.have.been.calledWith('D', false, { level: 2, index: 0, left: undefined, right: 'D' })
			expect(testSpy).not.to.have.been.calledWith('D', false, { level: 2, index: 1, left: 'D', right: 'D' })
			expect(testSpy).not.to.have.been.calledWith('D', false, { level: 2, index: 2, left: 'D', right: undefined })
			testSpy.restore();
		})
	})

	describe('#iterateLevel', () => {
		let testFunction, testObject, testSpy;
		beforeEach(()=>{
			testFunction = function(key, step, index){ return 'yes'}
			testObject = { testFunction };
			testSpy = sinon.spy(testObject, 'testFunction');
		})
		afterEach(() => {
			testSpy.restore();
		})
		describe('no special cases', () => {
			beforeEach(() => {
				lsystem._productionArray[1] = 'BC+C'.split('');
				lsystem._productionArray[2] = 'DDD'.split('');
				lsystem.currentLevel = 1;
			})
			it('should iterate over each item in the given production', () => {
				lsystem.iterateLevel(testObject.testFunction, 2);
				expect(testSpy).not.to.have.been.calledWith('A', false, { level: 0, index: 0, left: undefined, right: undefined })
				expect(testSpy).not.to.have.been.calledWith('B', false, { level: 1, index: 0, left: undefined, right: 'C' })
				expect(testSpy).to.have.been.calledWith('D', false, { level: 2, index: 0, left: undefined, right: 'D' })
				expect(testSpy).to.have.been.calledWith('D', false, { level: 2, index: 1, left: 'D', right: 'D' })
				expect(testSpy).to.have.been.calledWith('D', false, { level: 2, index: 2, left: 'D', right: undefined })
			})
			it('should warn about nonexistent levels', () => {
				expect(testSpy).not.to.have.been.calledWith('A', false, { level: 0, index: 0, left: undefined, right: undefined })
				expect(testSpy).not.to.have.been.calledWith('B', false, { level: 1, index: 0, left: undefined, right: 'C' })
				expect(testSpy).not.to.have.been.calledWith('C', false, { level: 1, index: 1, left: 'B', right: '+' })
				expect(testSpy).not.to.have.been.calledWith('+', false, { level: 1, index: 2, left: 'C', right: 'C' })
				expect(testSpy).not.to.have.been.calledWith('C', false, { level: 1, index: 3, left: '+', right: undefined })
				expect(testSpy).not.to.have.been.calledWith('D', false, { level: 2, index: 0, left: undefined, right: 'D' })
				expect(testSpy).not.to.have.been.calledWith('D', false, { level: 2, index: 1, left: 'D', right: 'D' })
				expect(testSpy).not.to.have.been.calledWith('D', false, { level: 2, index: 2, left: 'D', right: undefined })
			})
		})
		describe('with parametric arguments', () => {
			it('should pass in parametric arguments', () => {
				lsystem._productionArray[1] = ['K(1,2)','K(2,3,4,5)'];
				lsystem.currentLevel = 1;
				lsystem.iterateLevel(testObject.testFunction, 1);
				expect(testSpy).to.have.been.calledWith('K',['1','2'], { level: 1, index: 0, left: undefined, right: 'K' });
				expect(testSpy).to.have.been.calledWith('K',['2','3','4','5'], { level: 1, index: 1, left: 'K', right: undefined });
			})
		})
	})

	describe('#write', () => {
		beforeEach(() => {
			lsystem.addRules({
				'A': 'BC',
				'B': 'ABC',
				'C': 'AB'
			})
			lsystem.maxLevels = 3
		})
		describe('with a start index', () => {
			let str1, str2;
			beforeEach(() => {
				str1 = 'ABCAB+AB';
				str2 = 'BCABCABBCABC+BCABC';
				lsystem._productionArray[1] = 'BC+C'.split('');
				lsystem._productionArray[2] = 'DDD'.split('');
			})
			it('should write from the start to the maxLevels', (done) => {
				lsystem.write(1,3).then(function(){
					expect(lsystem._productionArray[2]).to.deep.equal(str1.split(''))
					expect(lsystem._productionArray[3]).to.deep.equal(str2.split(''))
					done();
				})
			})
			it('should rewrite if the production at index is not built', (done) => {
				lsystem._productionArray[2] = undefined;
				lsystem.write(2).then(function(){
					expect(lsystem._productionArray[2]).to.deep.equal(str1.split(''))
					expect(lsystem._productionArray[3]).to.deep.equal(str2.split(''))
					done()
				})
			})
		})
		it('should iterate from 0 to maxLevels by default', (done) => {
			lsystem.write().then(function(){
				expect(lsystem._productionArray.length).to.equal(4);
				done();
			})
		})
		it('should return a rejected promise if an axiom is not defined', (done) => {
			lsystem._productionArray[0][0] = undefined;
			lsystem.write().catch(function(err){
				expect(err).to.equal('lSystemProducer: no axiom defined, cannot write without an axiom');
				done();
			})
		})
		it('should clear anything past end', (done) => {
			lsystem._productionArray[1] = 'BC+C'.split('');
			lsystem._productionArray[2] = 'DDD'.split('');
			lsystem.write(0, 1).then(function(){
				expect(lsystem._productionArray[2]).to.equal(undefined)
				done();
			})
		})
	})
})
