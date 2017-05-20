import { expect } from 'chai';
import { Emitter } from '../../source/utils/emitter';
import { Subject, Observable } from 'rx';

describe('Emitter', () => {
	let emitter;
	describe('a pausable emitter', () => {
		beforeEach(()=> emitter = new Emitter({ pausable: true }))
		afterEach(() => emitter.cancelAll())
		describe('#createSubject', () => {
			it('should create a subject', () => {
				emitter.createSubject('cool_subject')
				expect(emitter.sources['$cool_subject'].constructor).to.equal(Subject)
			})
			it('should create a pauser', () => {
				emitter.createSubject('cool_subject')
				expect(emitter.pausers['$cool_subject'].constructor).to.equal(Subject)
			})
			it('should not allow duplicate subject creation', () => {
				emitter.createSubject('cool_subject');
				expect(emitter.createSubject('cool_subject')).to.equal(false);
			})
		})
	})
	describe('#emit', () => {
		it('should automatically create a subject', () => {
			emitter.emit('cool_subject')
			expect(emitter.sources['$cool_subject'].constructor).to.equal(Subject)
		})
		it('should automatically create a pauser', () => {
			emitter.emit('cool_subject')
			expect(emitter.pausers['$cool_subject'].constructor).to.equal(Subject)
		})
	})
	describe('a pausable emitter', () => {
		beforeEach(()=> emitter = new Emitter())
		afterEach(() => emitter.cancelAll())
		describe('#createSubject', () => {
			it('should create a subject', () => {
				emitter.createSubject('cool_subject')
				expect(emitter.sources['$cool_subject'].constructor).to.equal(Subject)
			})
			it('should not create a pauser', () => {
				emitter.createSubject('cool_subject')
				expect(emitter.pausers['$cool_subject']).to.equal(undefined)
			})
			it('should not allow duplicate subject creation', () => {
				emitter.createSubject('cool_subject');
				expect(emitter.createSubject('cool_subject')).to.equal(false);
			})
		})
	})
})
