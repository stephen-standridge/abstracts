import {expect} from 'chai';
import {includes, filter} from 'lodash';
import { DiscreetProbabilitySet, RandomProbabilitySet } from '../../../source/structures/probability';

describe('DiscreetProbabilitySet', ()=>{
	let set, otherSet;

	before(() => {
		set = new DiscreetProbabilitySet([
			{ value: 20, probability: 3 },
			{ value: 50, probability: 4 },
			{ value: 100, probability: 7 }], 3);
		otherSet = new DiscreetProbabilitySet([
			{ set: [20, 5, 7], probability: 1, max: 2},
			{ set: [50, 1], probability: 2 },
			{ value: 100, probability: 5 }]);
	})

	describe('#constructor', () => {
		it('should not allow a non-array set', (done) => {
			try {
				new DiscreetProbabilitySet(5, 2);
				done('allowed non-array set creation')
			} catch (e) {
				expect(e.message).to.equal('DiscreetProbabilitySet: set is not an array')
				done()
			}
		})
		it('should not allow items without a probability defined', (done) => {
			try {
				new DiscreetProbabilitySet([{ value: 5 }], 2);
				done('allowed non-probability-item set creation')
			} catch (e) {
				expect(e.message).to.equal('DiscreetProbabilitySet: given a choice without a probability defined')
				done()
			}
		})
		it('should not allow items without a set or value defined', (done) => {
			try {
				new DiscreetProbabilitySet([{ probability: 5 }], 2);
				done('allowed non-value-item set creation')
			} catch (e) {
				expect(e.message).to.equal('DiscreetProbabilitySet: given a choice without a value or set defined')
				done()
			}
		})
		it('should correctly assign the max probability', () => {
			expect(otherSet._maxProbability).to.equal(8)
			expect(set._maxProbability).to.equal(14)
		})
		it('should correctly assign the probabilities', () => {
			expect(set._probabilities).to.deep.equal([3, 4, 7]);
			expect(otherSet._probabilities).to.deep.equal([1, 2, 5]);
		})
		it('should correctly assign the values', () => {
			expect(set._values).to.deep.equal([20, 50, 100])
			expect(otherSet._values[0].constructor).to.equal(RandomProbabilitySet);
			expect(otherSet._values[1].constructor).to.equal(RandomProbabilitySet);
			expect(otherSet._values[2]).to.equal(100);
		})
		it('should call redistribute', () => {
			expect(set._shuffled.length).to.equal(3);
		})
	})

	describe('#redistribute', () => {
		it('should clear the chosen', () => {
			set._chosen = [4, 777]
			set.redistribute();
			expect(set._chosen).to.deep.equal([])
		})
		it('should shuffle the probability keys', () => {
			set._shuffled = [7,8,9]
			expect(set._shuffled.filter((item) => Object.keys(set._probabilities).includes(item)).length).to.equal(0)
			set.redistribute();
			expect(set._shuffled.filter((item) => Object.keys(set._probabilities).includes(item)).length).to.equal(3)
		})
	})

	describe('#choose', () => {
		it('should return an item of the given set', () => {
			expect(set._values.includes(set.choose())).to.equal(true)
		})
		it('should redistribute once the max choices are attempted', () => {
			let redistributeSpy = sinon.spy(set, 'redistribute')
			set.choose();
			expect(redistributeSpy).not.to.have.been.called;
			set.choose();
			expect(redistributeSpy).not.to.have.been.called;
			set.choose()
			expect(redistributeSpy).to.have.been.called;
		})

		describe('when given a higher amount of maxChoices than choices', () => {
			it('should return empty results', () => {
				let otherSet = new RandomProbabilitySet([1,2,3], 4);
				let redistributeSpy = sinon.spy(otherSet, 'redistribute')
				let returned = [];
				returned.push(otherSet.choose());
				returned.push(otherSet.choose());
				returned.push(otherSet.choose());
				returned.push(otherSet.choose());
				expect(redistributeSpy).not.to.have.been.called;
				expect(returned.length).to.equal(4)
				expect(returned.filter((x) => !x).length).to.equal(1)
			})
		})

		describe('when choosing a set', () => {
			it('should call choose on the set', () => {
				otherSet._shuffled = [0, 1, 2];
				let chooseSpy = sinon.spy(otherSet._values[0], 'choose');
				otherSet.choose(0.1);
				expect(chooseSpy).to.have.been.called
			})
		})
	})

	describe('#chooseAll', () => {
		it('should return a set of maxChoices size', () => {
			let choices = set.chooseAll();
			expect(choices.length).to.equal(3);
			expect(choices.filter((x) => set._values.includes(x)).length).to.equal(3);
		})
	})
})
