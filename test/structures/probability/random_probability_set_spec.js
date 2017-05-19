import {expect} from 'chai';
import {uniq} from 'lodash';
import { RandomProbabilitySet } from '../../../source/structures/probability';

describe('RandomProbabilitySet', ()=>{
	let set;

	beforeEach(() => {
		set = new RandomProbabilitySet([1, 2, 3], 2);
	})

	describe('#constructor', () => {
		it('should not allow a non-array set', (done) => {
			try {
				new RandomProbabilitySet(5, 2);
				done('allowed non-array set creation')
			} catch (e) {
				expect(e.message).to.equal('RandomProbabilitySet: cannot create without an array set')
				done()
			}
		})
		it('should redistribute the probability', () => {
			expect(set._shuffled.length).to.equal(3)
		})
	})

	describe('#choose', () => {
		it('should return an item of the given set', () => {
			expect([1, 2, 3].includes(set.choose())).to.equal(true)
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
		it('should choose a unique item until the choices have been chosen', () => {
			let chosen = set.choose();
			expect(set._shuffled.length).to.equal(set._set.length - 1);
			expect(set._shuffled.includes(chosen)).to.equal(false);
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
	})

	describe('#chooseAll', () => {
		it('should return a set of maxChoices size', () => {
			let choices = set.chooseAll();
			expect(choices.length).to.equal(2);
			expect(choices.filter((x) => set._set.includes(x)).length).to.equal(2);
		})
	})

	describe('#redistribute', () => {
		it('should clear the chosen', () => {
			set._chosen = [2, 3]
			set.redistribute();
			expect(set._chosen).to.deep.equal([])
		})
		it('should shuffle the choices', () => {
			set._shuffled = [2, 3, 1];
			set.redistribute();
			expect(uniq(set._shuffled).length).to.equal(3);
			expect(set._shuffled.filter((item) => set._set.includes(item)).length).to.equal(3);
		})
	})
})
