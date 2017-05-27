import { expect } from 'chai';
import { lSystemExecutor } from '../../../source/structures/lsystems';
import { RandomProbabilitySet, DiscreetProbabilitySet } from '../../../source/structures/probability';

describe('lSystemExecutor', () => {
	let lsystem,
		function1 = function(){ return 'function1' },
		function2 = function(){ return 'function2' },
		function3 = function(){ return 'function3' },
		function4 = function(){ return 'function4' },
		function5 = function(){ return 'function5' },
		function6 = function(){ return 'function6' };

	let testObject = {
		function1,
		function2,
		function3,
		function4,
		function5,
		function6
	}
	beforeEach((ready) => {
		lsystem = new lSystemExecutor();
		lsystem.axiom = 'A';
		lsystem.addRules({
			'A': 'ABA',
			'B': 'K(2,3)',
			'A<B>A': 'B',
			'K': function(key, arg1, arg2) { return 'I' }
		})
		lsystem.produce(3).then(function(){
			ready()
		})
	})
	describe('#addInstruction', () => {
		it('should not take anything other than a function or array')
		describe('with a function', () => {
			it('should add the instruction', () => {
				expect(lsystem.addInstruction('B', function1)).to.equal(true)
				expect(lsystem._instructions['B']).to.equal(function1)
			})
			it('should call remove instruction', () => {
				expect(lsystem.addInstruction('B', function1)).to.equal(true)
				let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction');
				lsystem.addInstruction('B', function2)
				expect(removeInstructionSpy).to.have.been.calledWith('B')
				expect(lsystem._instructions['B']).to.equal(function2)
			})
		})
		describe('with an array', () => {
			it('should defer to addInstructionArray', () => {
				let arrayInstructionSpy = sinon.spy(lsystem, 'addInstructionArray')
				let testArray = [function1, function2, function3]
				lsystem.addInstruction('B', testArray);
				expect(arrayInstructionSpy).to.have.been.calledWith('B', testArray);
			})
		})
	})
	describe('#addInstructionArray', () => {
		it('should not take anything other than a function or array')
		it('should add a RandomProbabilitySet', () => {
			let testArray = [function1, function2, function3];
			expect(lsystem.addInstructionArray('B', testArray)).to.equal(true);
			expect(lsystem._instructionSets['B'].constructor).to.equal(RandomProbabilitySet)
		})
		it('should remove existing instructions', () => {
			let testArray = [function1, function2, function3];
			let testArray2 = [function3, function2, function1];
			expect(lsystem.addInstructionArray('B', testArray2)).to.equal(true)
			let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction');
			expect(lsystem.addInstructionArray('B', testArray)).to.equal(true)
			expect(removeInstructionSpy).to.have.been.calledWith('B');
			expect(lsystem._instructionSets['B'].constructor).to.equal(RandomProbabilitySet)
		})
		describe('with objects', () => {
			it('should not take anything other than a function or array')
			it('should not add anything when probability is not present', () => {
					let testArray = [{ value: function1, probability: 20 }, { value: function2, probability: 10 }, { value: function3 }];
					expect(lsystem.addInstructionArray('B', testArray)).to.equal(false)
					expect(lsystem._instructionSets['B']).to.equal(undefined)
			})
			describe('with value', () => {
				it('should add a DistributedProbabilitySet when the value is a function', () => {
					let testArray = [{ value: function1, probability: 20 }, { value: function2, probability: 10 }, { value: function3, probability: 10 }];
					expect(lsystem.addInstructionArray('B', testArray)).to.equal(true)
					expect(lsystem._instructionSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
				it('should remove existing instructions', () => {
					let testArray = [{ value: function1, probability: 20 }, { value: function2, probability: 10 }, { value: function3, probability: 10 }];
					let testArray2 = [{ value: function3, probability: 20 }, { value: function2, probability: 10 }, { value: function1, probability: 10 }];
					expect(lsystem.addInstructionArray('B', testArray2)).to.equal(true)
					let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction')
					expect(lsystem.addInstructionArray('B', testArray)).to.equal(true)
					expect(removeInstructionSpy).to.have.been.calledWith('B')
					expect(lsystem._instructionSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
			})
			describe('with set/max', () => {
				it('should add a DistributedProbabilitySet when the set contains functions', () => {
					let testArray = [{ set: [function1, function2, function3], probability: 20 }, { value: function3, probability: 10 }];
					expect(lsystem.addInstructionArray('B', testArray)).to.equal(true);
					expect(lsystem._instructionSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
				it('should remove existing instructions', () => {
					let testArray = [{ set: [function1, function2, function3], probability: 20 }, { value: function3, probability: 10 }];
					let testArray2 = [{ set: [function3, function2, function1], probability: 20 }, { value: function1, probability: 10 }];
					expect(lsystem.addInstructionArray('B', testArray2)).to.equal(true)
					let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction')
					expect(lsystem.addInstructionArray('B', testArray)).to.equal(true)
					expect(removeInstructionSpy).to.have.been.calledWith('B')
					expect(lsystem._instructionSets['B'].constructor).to.equal(DiscreetProbabilitySet)
				})
			})
		})
	})

	describe('#addInstructions', () => {
		it('should set the instructions to the instruction set', () => {
			let instructions = {
				'B': [{ set: [function1, function2], probability: 20 }, { value: function3, probability: 15 }],
				'C': [{ value: function1, probability: 20 }, { value: function2, probability: 10 }, { value: function3, probability: 5 }],
				'D': function1,
				'E': [function2, function3, function2]
			}
			expect(lsystem.addInstructions(instructions)).to.deep.equal([true, true, true, true]);
			expect(lsystem._instructionSets['B'].constructor).to.equal(DiscreetProbabilitySet)
			expect(lsystem._instructionSets['C'].constructor).to.equal(DiscreetProbabilitySet)
			expect(lsystem._instructions['D']).to.equal(function1)
			expect(lsystem._instructionSets['E'].constructor).to.equal(RandomProbabilitySet)
		})
		it('should warn about invalid instructions', () => {
			let instructions = {
				'B': [{ set: [function1, undefined], probability: 20 }, { value: 'Y', probability: 15 }],
				'C': [{ value: function1, probability: 20 }, { value: function2, probability: 10 }, { value: function3, probability: 5 }],
				'D': 'R',
				'E': function2,
				'F': [function1, function2, undefined],
				'G': [function(){}, function(){}]
			}
			expect(lsystem.addInstructions(instructions)).to.deep.equal([false, true, false, true, false, true]);
			expect(lsystem._instructionSets['B']).to.equal(undefined)
			expect(lsystem._instructions['B']).to.equal(undefined)
			expect(lsystem._instructionSets['C'].constructor).to.equal(DiscreetProbabilitySet)
			expect(lsystem._instructions['D']).to.equal(undefined)
			expect(lsystem._instructionSets['D']).to.equal(undefined)
			expect(lsystem._instructions['E']).to.equal(function2)
			expect(lsystem._instructions['F']).to.equal(undefined)
			expect(lsystem._instructionSets['G'].constructor).to.equal(RandomProbabilitySet)
		})
	})

	describe('#getInstruction', () => {
		beforeEach(() => {
			lsystem.addInstructions({
				'B': function1,
				'A<B': function2,
				'B>A': function3,
				'A<B>A': function4,
				'B>H': function5,
				'H<B': function6
			})
		})
		it('should get basic instructions', () => {
			expect(lsystem.getInstruction('B')).to.equal('function1')
		})
		it('should return undefined if not found', () => {
			expect(lsystem.getInstruction('A')).to.equal(undefined)
		})
		it('should call the instruction with the given arguments', () => {
			let testObject = { function1 };
			let testSpy = sinon.spy(testObject, 'function1');
			expect(lsystem.addInstruction('Z', testObject.function1)).to.equal(true)
			expect(lsystem.getInstruction('Z', [1, 2, 3])).to.equal('function1')
			expect(testSpy).to.have.been.calledWith('Z', 1, 2, 3);
		})
		describe('context-specific instructions', () => {
			describe('left context match', () => {
				it('should get the context-specific instruction', () => {
					expect(lsystem.getInstruction('B', [false], { left: 'A', right: undefined })).to.equal('function2')
				})
				it('should return false for inverse matching', () => {
					expect(lsystem.getInstruction('A', [false], { left: undefined, right: 'B' })).to.equal(undefined)
				})
				it('should return the default instruction if not found', () => {
					expect(lsystem.getInstruction('B', [false], { left: 'C', right: undefined })).to.equal('function1')
				})
			})
			describe('right context match', () => {
				it('should get the context-specific instruction', () => {
					expect(lsystem.getInstruction('B', [false], { left: undefined, right: 'A' })).to.equal('function3')
				})
				it('should return false for inverse matching', () => {
					expect(lsystem.getInstruction('A', [false], { left: 'B', right: undefined })).to.equal(undefined)
				})
				it('should return the default instruction if not found', () => {
					expect(lsystem.getInstruction('B', [false], { left: false, right: 'C' })).to.equal('function1')
				})
			})
			describe('between context match', () => {
				it('should get the context-specific instruction with a matching between', () => {
					expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'A' })).to.equal('function4')
				})
				it('should partially match left', () => {
					expect(lsystem.getInstruction('B', [false], { left: 'C', right: 'A' })).to.equal('function3')
				})
				it('should partially match right', () => {
					expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'C' })).to.equal('function2')
				})
				it('should return default instruction if not found', () => {
					expect(lsystem.getInstruction('B', [false], { left: 'C', right: 'C' })).to.equal('function1')
				})
			})
			it('should prioritize between, left, then right', () => {
				expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'A' })).to.equal('function4')
				expect(lsystem.getInstruction('B', [false], { left: 'H', right: 'A' })).to.equal('function6')
				expect(lsystem.getInstruction('B', [false], { left: undefined, right: 'A' })).to.equal('function3')
				expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'H' })).to.equal('function2')
				expect(lsystem.getInstruction('B', [false], { left: undefined,  right: 'H' })).to.equal('function5')
			})
		})
		it('should work with punctuation', () => {
			lsystem.addInstructions({
				'=': function1,
				'+': function2,
				'|': function3,
				'[': function4,
				']': function5,
				'.': function6
			})
			expect(lsystem.getInstruction('=', [false], { left: 'A', right: 'A' })).to.equal('function1')
			expect(lsystem.getInstruction('+', [false], { left: 'A', right: 'A' })).to.equal('function2')
			expect(lsystem.getInstruction('|', [false], { left: 'A', right: 'A' })).to.equal('function3')
			expect(lsystem.getInstruction('[', [false], { left: 'A', right: 'A' })).to.equal('function4')
			expect(lsystem.getInstruction(']', [false], { left: 'A', right: 'A' })).to.equal('function5')
			expect(lsystem.getInstruction('.', [false], { left: 'A', right: 'A' })).to.equal('function6')
		})
	})

	describe('#execute', () => {
		it('should execute the last production by default', (done) => {
			let iterateLevelSpy = sinon.spy(lsystem, 'iterateLevel')
			lsystem.execute().then(function(){
				expect(iterateLevelSpy.callCount).to.equal(1)
				expect(iterateLevelSpy).to.have.been.calledWith(sinon.match((func) => func.name == 'bound getInstruction'), lsystem._productionArray.length - 1)
				iterateLevelSpy.restore();
				done();
			})
		})
		it('should call the instruction once per item in the production', (done) => {
			let testSpy1 = sinon.spy(testObject, 'function1');
			let testSpy2 = sinon.spy(testObject, 'function2');
			let testSpy3 = sinon.spy(testObject, 'function3');
			let testSpy4 = sinon.spy(testObject, 'function4');
			lsystem.addInstructions({
				'A': testObject.function1,
				'B': testObject.function2,
				'K': testObject.function3,
				'I': testObject.function4
			})
			lsystem.execute().then(function(){
				expect(testSpy1.callCount).to.equal(8)
				expect(testSpy2.callCount).to.equal(4)
				expect(testSpy3.callCount).to.equal(2)
				expect(testSpy4.callCount).to.equal(1)
				testSpy1.restore()
				testSpy2.restore()
				testSpy3.restore()
				testSpy4.restore()
				done();
			})
		})

		it('should attempt to call the method with the arguments if it encounters a parametric instruction', (done) => {
			let testSpy1 = sinon.spy(testObject, 'function1');
			lsystem.addInstructions({
				'K': testObject.function1
			})
			lsystem.execute().then(function(){
				expect(testSpy1).to.have.been.calledWith('K','2','3');
				expect(testSpy1).to.have.been.calledWith('K','2','3');
				expect(testSpy1.callCount).to.equal(2)
				testSpy1.restore();
				done();
			})
		})

		it('should take a start', (done) => {
			let testSpy1 = sinon.spy(testObject, 'function1');
			let testSpy2 = sinon.spy(testObject, 'function2');
			let testSpy3 = sinon.spy(testObject, 'function3');
			let testSpy4 = sinon.spy(testObject, 'function4');
			lsystem.addInstructions({
				'A': testObject.function1,
				'B': testObject.function2,
				'K': testObject.function3,
				'I': testObject.function4
			})
			lsystem.execute(2).then(function(){
				expect(testSpy1.callCount).to.equal(12)
				expect(testSpy2.callCount).to.equal(6)
				expect(testSpy3.callCount).to.equal(3)
				expect(testSpy4.callCount).to.equal(1)
				testSpy1.restore()
				testSpy2.restore()
				testSpy3.restore()
				testSpy4.restore()
				done();
			})
		})

		it('should take an end', (done) => {
			let testSpy1 = sinon.spy(testObject, 'function1');
			let testSpy2 = sinon.spy(testObject, 'function2');
			let testSpy3 = sinon.spy(testObject, 'function3');
			let testSpy4 = sinon.spy(testObject, 'function4');
			lsystem.addInstructions({
				'A': testObject.function1,
				'B': testObject.function2,
				'K': testObject.function3,
				'I': testObject.function4
			})
			//executes from the last to the second to last
			lsystem.execute(3, 1).then(function(){
				expect(testSpy1.callCount).to.equal(12)
				expect(testSpy2.callCount).to.equal(6)
				expect(testSpy3.callCount).to.equal(3)
				expect(testSpy4.callCount).to.equal(1)
				testSpy1.restore()
				testSpy2.restore()
				testSpy3.restore()
				testSpy4.restore()
				done();
			})
		})
		it('should warn about out of range execution', (done) => {
			lsystem.execute(-1, 1).catch(function(err){
				expect(err).to.equal('lSystemExecutor: could not execute from -1 to 1; Out of range.')
				lsystem.execute(0, 5).catch(function(err){
					expect(err).to.equal('lSystemExecutor: could not execute from 0 to 5; Out of range.')
					lsystem.execute(5, 2).catch(function(err){
						expect(err).to.equal('lSystemExecutor: could not execute from 5 to 2; Out of range.')
						lsystem.execute(1, -1).catch(function(err){
							expect(err).to.equal('lSystemExecutor: could not execute from 1 to -1; Out of range.')
							done();
						})
					})
				})
			})

		})
	})
})
