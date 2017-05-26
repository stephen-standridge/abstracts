import {expect} from 'chai';
import {uniqBy} from 'lodash';
import { lSystemProducer } from '../../../source/structures/lsystems';

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
			expect(testSpy).to.have.been.calledWith('Z', 1, 2, 3);
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
		it('should change the current level to the next level', () => {
			expect(lsystem.currentLevel).to.equal(0)
			lsystem.produce();
			expect(lsystem.currentLevel).to.equal(1)
		})
		it('should write the next production', () => {
			lsystem.produce();
			expect(lsystem._productionArray[1]).to.deep.equal(str1.split(''))
			lsystem.produce();
			expect(lsystem._productionArray[2]).to.deep.equal(str2.split(''))
			lsystem.produce();
			expect(lsystem._productionArray[3]).to.deep.equal(str3.split(''))
		})
		it('should transfer non-found rules to the string', () => {
			lsystem._productionArray[1] = ['B','C','+','C'];
			lsystem.currentLevel = 1;
			lsystem.produce();
			expect(lsystem._productionArray[2]).to.deep.equal(str4.split(''))
		})
		it('should not allow stepping past the maxLevels', () => {
			lsystem.maxLevels = 3;
			lsystem.produce();
			expect(lsystem._productionArray[1]).to.deep.equal(str1.split(''))
			lsystem.produce();
			expect(lsystem._productionArray[2]).to.deep.equal(str2.split(''))
			lsystem.produce();
			expect(lsystem._productionArray[3]).to.deep.equal(str3.split(''))
			lsystem.produce();
			expect(lsystem._productionArray[4]).to.deep.equal(undefined)
		})
		it('should destroy all future steps', () => {
			lsystem._productionArray[1] = 'BC+C';
			lsystem._productionArray[2] = 'ABCDEFGH';
			lsystem._productionArray[3] = 'DDDDD';
			lsystem.currentLevel = 1;
			lsystem.produce();
			expect(lsystem._productionArray.length).to.equal(3);
			expect(lsystem._productionArray[3]).to.equal(undefined);
		})
		it('should pass the current key and index into function rules', () => {
			let testFunction = function(key, arg1, arg2, arg3){ return 'yes'}
			let testObject = { testFunction };
			let testSpy = sinon.spy(testObject, 'testFunction');
			lsystem.addRule('B', testObject.testFunction)
			lsystem.produce();
			lsystem.produce();
			expect(testSpy).to.have.been.calledWith('B', 0)
			testSpy.restore();
		})
		describe('parametric rules', () => {
			it('should attempt to call the method with the arguments if it encounters a parametric rule', () => {
				let testFunction = function(...args){ return 'yes'}
				let testObject = { testFunction };
				let testSpy = sinon.spy(testObject, 'testFunction');

				lsystem.addRule('K', testObject.testFunction)
				lsystem._productionArray[1] = ['K(1,2)','K(2,3,4,5)'];
				lsystem.currentLevel = 1;
				lsystem.produce();
				expect(testSpy).to.have.been.calledWith('K','1','2',0);
				expect(testSpy).to.have.been.calledWith('K','2','3','4','5',1);
			})
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
			it('should write from the start to the maxLevels', () => {
				lsystem.write(1,3)
				expect(lsystem._productionArray[2]).to.deep.equal(str1.split(''))
				expect(lsystem._productionArray[3]).to.deep.equal(str2.split(''))
			})
			it('should rewrite if the production at index is not built', () => {
				lsystem._productionArray[2] = undefined;
				lsystem.write(2)
				expect(lsystem._productionArray[2]).to.deep.equal(str1.split(''))
				expect(lsystem._productionArray[3]).to.deep.equal(str2.split(''))
			})
		})
		it('should iterate from 0 to maxLevels by default', () => {
			lsystem.write();
			expect(lsystem._productionArray.length).to.equal(4);
		})
		it('should return false if an axiom is not defined', () => {
			lsystem.axiom = undefined;
			expect(lsystem.write()).to.equal(false);
		})
		it('should clear anything past end', () => {
			lsystem._productionArray[1] = 'BC+C'.split('');
			lsystem._productionArray[2] = 'DDD'.split('');
			lsystem.write(0, 1);
			expect(lsystem._productionArray[2]).to.equal(undefined)
		})
	})
})
