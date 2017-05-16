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
	describe('#setRules', () => {
		it('should set the rules to the rule set')
		it('should not take an undefined rule')
	})
	describe('#addRule', () => {
		it('should not take an undefined rule')
		describe('with a string rule', () => {
			it('should add the rule')
		})
		describe('with a function', () => {
			it('should add the rule')
			it('should test the return value is a string')
		})
		describe('with an array', () => {
			it('should add a function that does an even split of probability')
			it('should test each item is a string')
		})
		describe('with an object', () => {
			it('should only take numeric keys')
			it('should distribute the probability over the sum of the given keys')
			describe('with a string value', () => {
				it('should add the rule')
			})
			describe('with a function value', () => {
				it('should add the rule')
				it('should test the return value is a string')
			})
			describe('with an array value', () => {
				it('should add a function that does an even split of probability')
				it('should test each item is a string')
			})
		})
	})
	describe('#setConstants', () => {
		it('should set the constant to the constants set')
		it('should not take an undefined constant')
	})
	describe('#addConstant', () => {
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
