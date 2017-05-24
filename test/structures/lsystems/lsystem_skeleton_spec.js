import { expect } from 'chai';
import { lSystemSkeleton } from '../../../source/structures/lsystems';

describe('lSystemSkeleton', () => {
	let lsystem;
	beforeEach(() => {
		lsystem = new lSystemSkeleton();
		lsystem.axiom = 'A';
		lsystem.addRules({
			'A': 'ABA',
			'B': 'K(2,3)',
			'A<B>A': 'B',
			'K': function(key, arg1, arg2) { return 'I' }
		})
		lsystem.step();
		lsystem.step();
		lsystem.step();
	})
	describe('#addInstruction', () => {
		it('should not take anything other than a function or array')
		describe('with a function', () => {
			it('should add the instruction', (done) => {
				expect(lsystem.addInstruction('B', () => 'C')).to.equal(true)
				expect(lsystem.getInstruction('B')).to.equal('C')
				done('unimplemented')
			})
			it('should call remove instruction', (done) => {
				expect(lsystem.addInstruction('B', () => 'C')).to.equal(true)
				let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction');
				lsystem.addInstruction('B', () => 'D')
				expect(removeInstructionSpy).to.have.been.calledWith('B')
				expect(lsystem.getInstruction('B')).to.equal('D')
				done('unimplemented')
			})
		})
		describe('with an array', () => {
			it('should defer to addInstructionArray', (done) => {
				let arrayInstructionSpy = sinon.spy(lsystem, 'addInstructionArray')
				let testArray = ['C', 'D', 'E']
				lsystem.addInstruction('B', testArray);
				expect(arrayInstructionSpy).to.have.been.calledWith('B', testArray);
				done('unimplemented')
			})
		})
	})
	describe('#addInstructionArray', () => {
		it('should not take anything other than a function or array')
		it('should add a RandomProbabilitySet', (done) => {
			let testArray = ['C', 'D', 'E'];
			lsystem.addInstructionArray('B', testArray);
			expect(testArray.includes(lsystem.getInstruction('B'))).to.equal(true);
			done('unimplemented')
		})
		it('should remove existing instructions', (done) => {
			let testArray = ['C', 'D', 'E'];
			let testArray2 = ['F', 'G', 'H'];
			lsystem.addInstructionArray('B', testArray2);
			let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction');
			lsystem.addInstructionArray('B', testArray);
			expect(removeInstructionSpy).to.have.been.calledWith('B');
			expect(testArray.includes(lsystem.getInstruction('B'))).to.equal(true);
			done('unimplemented');
		})
		describe('with objects', () => {
			it('should not take anything other than a function or array')
			it('should not add anything when probability is not present', (done) => {
					let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E' }];
					lsystem.addInstructionArray('B', testArray);
					expect(lsystem.getInstruction('B')).to.equal(false);
					done('unimplemented');
			})
			describe('with value', () => {
				it('should add a DistributedProbabilitySet when the value is a function', (done) => {
					let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E', probability: 10 }];
					lsystem.addInstructionArray('B', testArray);
					expect(['C', 'D', 'E'].includes(lsystem.getInstruction('B'))).to.equal(true);
					done('unimplemented')
				})
				it('should remove existing instructions', (done) => {
					let testArray = [{ value: 'C', probability: 20 }, { value: 'D', probability: 10 }, { value: 'E', probability: 10 }];
					let testArray2 = [{ value: 'F', probability: 20 }, { value: 'G', probability: 10 }, { value: 'H', probability: 10 }];
					lsystem.addInstructionArray('B', testArray2);
					let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction')
					lsystem.addInstructionArray('B', testArray);
					expect(removeInstructionSpy).to.have.been.calledWith('B')
					expect(['C', 'D', 'E'].includes(lsystem.getInstruction('B'))).to.equal(true);
					done('unimplemented');
				})
			})
			describe('with set/max', () => {
				it('should add a DistributedProbabilitySet when the set contains functions', (done) => {
					let testArray = [{ set: ['C', 'D', 'E'], probability: 20 }, { value: 'F', probability: 10 }];
					lsystem.addInstructionArray('B', testArray);
					expect(['C', 'D', 'E', 'F'].includes(lsystem.getInstruction('B'))).to.equal(true);
					done('unimplemented')
				})
				it('should remove existing instructions', (done) => {
					let testArray = [{ set: ['C', 'D', 'E'], probability: 20 }, { value: 'B', probability: 10 }];
					let testArray2 = [{ set: ['F', 'G', 'H'], probability: 20 }, { value: 'I', probability: 10 }];
					lsystem.addInstructionArray('B', testArray2);
					let removeInstructionSpy = sinon.spy(lsystem, 'removeInstruction')
					lsystem.addInstructionArray('B', testArray);
					expect(removeInstructionSpy).to.have.been.calledWith('B')
					expect(['B', 'C', 'D', 'E'].includes(lsystem.getInstruction('B'))).to.equal(true);
					done('unimplemented')
				})
			})
		})
	})

	describe('#addInstructions', () => {
		it('should set the instructions to the instruction set', (done) => {
			let instructions = {
				'B': [{ set: ['Z', 'X'], probability: 20 }, { value: 'Y', probability: 15 }],
				'C': [{ value: 'W', probability: 20 }, { value: 'V', probability: 10 }, { value: 'U', probability: 5 }],
				'D': () => { return 'T' },
				'E': 'S',
				'F': ['R', 'Q', 'P'],
				'G': [function(){ return 'O'}, function(){ return 'N'}]
			}
			expect(lsystem.addInstructions(instructions)).to.deep.equal([true, true, true, true, true, true]);
			expect(['Z','X','Y'].includes(lsystem.getInstruction('B'))).to.equal(true)
			expect(['U','V','W'].includes(lsystem.getInstruction('C'))).to.equal(true)
			expect(lsystem.getInstruction('D')).to.equal('T')
			expect(lsystem.getInstruction('E')).to.equal('S')
			expect(['P','Q','R'].includes(lsystem.getInstruction('F'))).to.equal(true)
			expect(['O','N'].includes(lsystem.getInstruction('G'))).to.equal(true)
			done('unimplemented');
		})
		it('should warn about invalid instructions', (done) => {
			let instructions = {
				'B': [{ set: ['Z', undefined], probability: 20 }, { value: 'Y', probability: 15 }],
				'C': [{ value: 'W', probability: 20 }, { value: 'V', probability: 10 }, { value: 'U', probability: 5 }],
				'D': () => { 'T' },
				'E': 'S',
				'F': ['R', 'Q', undefined],
				'G': [function(){ return 'O'}, function(){ return 'N'}]
			}
			expect(lsystem.addInstructions(instructions)).to.deep.equal([false, true, false, true, false, true]);
			expect(['Z','X','Y'].includes(lsystem.getInstruction('B'))).to.equal(false)
			expect(['U','V','W'].includes(lsystem.getInstruction('C'))).to.equal(true)
			expect(lsystem.getInstruction('D')).to.equal(false)
			expect(lsystem.getInstruction('E')).to.equal('S')
			expect(['P','Q','R'].includes(lsystem.getInstruction('F'))).to.equal(false)
			expect(['O','N'].includes(lsystem.getInstruction('G'))).to.equal(true)
			done('unimplemented')
		})
	})

	describe('#getInstruction', () => {
		beforeEach(() => {
			lsystem.addInstructions({
				'B': 'G',
				'A<B': 'D',
				'B>A': 'E',
				'A<B>A': 'F',
				'B>H': 'I',
				'H<B': 'J'
			})
		})
		it('should get basic instructions', (done) => {
			expect(lsystem.getInstruction('B')).to.equal('G')
			done('unimplemented')
		})
		it('should return false if not found', (done) => {
			expect(lsystem.getInstruction('A')).to.equal(false)
			done('unimplemented')
		})
		it('should call the instruction with the given arguments', (done) => {
			let testFunction = function(...args){ return 'yes'}
			let testObject = { testFunction };
			let testSpy = sinon.spy(testObject, 'testFunction');
			lsystem.addInstruction('Z', testObject.testFunction)
			lsystem.getInstruction('Z', [1, 2, 3])
			expect(testSpy).to.have.been.calledWith('Z', 1, 2, 3);
			done('unimplemented')
		})
		describe('context-specific instructions', () => {
			describe('left context match', () => {
				it('should get the context-specific instruction', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: 'A', right: undefined })).to.equal('D')
					done('unimplemented')
				})
				it('should return false for inverse matching', (done) => {
					expect(lsystem.getInstruction('A', [false], { left: undefined, right: 'B' })).to.equal(false)
					done('unimplemented')
				})
				it('should return the default instruction if not found', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: 'C', right: undefined })).to.equal('G')
					done('unimplemented')
				})
			})
			describe('right context match', () => {
				it('should get the context-specific instruction', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: undefined, right: 'A' })).to.equal('E')
					done('unimplemented')
				})
				it('should return false for inverse matching', (done) => {
					expect(lsystem.getInstruction('A', [false], { left: 'B', right: undefined })).to.equal(false)
					done('unimplemented')
				})
				it('should return the default instruction if not found', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: false, right: 'C' })).to.equal('G')
					done('unimplemented')
				})
			})
			describe('between context match', () => {
				it('should get the context-specific instruction with a matching between', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'A' })).to.equal('F')
					done('unimplemented')
				})
				it('should partially match left', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: 'C', right: 'A' })).to.equal('E')
					done('unimplemented')
				})
				it('should partially match right', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'C' })).to.equal('D')
					done('unimplemented')
				})
				it('should return default instruction if not found', (done) => {
					expect(lsystem.getInstruction('B', [false], { left: 'C', right: 'C' })).to.equal('G')
					done('unimplemented')
				})
			})
			it('should prioritize between, left, then right', (done) => {
				expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'A' })).to.equal('F')
				expect(lsystem.getInstruction('B', [false], { left: 'H', right: 'A' })).to.equal('J')
				expect(lsystem.getInstruction('B', [false], { left: undefined, right: 'A' })).to.equal('E')
				expect(lsystem.getInstruction('B', [false], { left: 'A', right: 'H' })).to.equal('D')
				expect(lsystem.getInstruction('B', [false], { left: undefined,  right: 'H' })).to.equal('I')
				done('unimplemented')
			})
		})
	})
})
