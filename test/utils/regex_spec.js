import { expect } from 'chai';
import { matchAll, PARAMETRIC_GRAMMAR_REGEX, IN_PARAMS_REGEX } from '../../source/utils/regex';

describe('#matchAll', () => {
	it('should return an array of all matches in a string', () => {
		let regex = '[a-zA-Z]';
		let str = 'aaaBBBcCc';
		expect(matchAll(str, regex)).to.deep.equal(['a', 'a', 'a', 'B', 'B', 'B', 'c', 'C', 'c'])
	})
	it('should not return non-matches', () => {
		let regex = '[a-zA-Z]';
		let str = 'a0aB1BcC2';
		expect(matchAll(str, regex)).to.deep.equal(['a', 'a', 'B', 'B', 'c', 'C'])
	})
})

describe('PARAMETRIC_GRAMMAR_REGEX', () => {
	it('should identify parametric grammar', () => {
		let str = 'A(1.0,3.3)aB0B(2.1)1cC2';
		expect(matchAll(str, PARAMETRIC_GRAMMAR_REGEX)).to.deep.equal(['A(1.0,3.3)', 'a', 'B', 'B(2.1)', 'c', 'C'])
	})
	it('should identify punctuation', () => {
		let str = '[a]B?0|B(2.1)0&+-1c-C/=_\\';
		expect(matchAll(str, PARAMETRIC_GRAMMAR_REGEX)).to.deep.equal(['[', 'a', ']', 'B', '?', '|', 'B(2.1)', '&', '+', '-', 'c', '-', 'C', '/', '=', '_', '\\' ])
	})
	it('should identify dashes before letters')
})

describe('IN_PARAMS_REGEX', () => {
	it('should identify parametric grammar', () => {
		let str = '(1.0,3.3)';
		expect(str.match(IN_PARAMS_REGEX)[0]).to.deep.equal('1.0,3.3')
	})
})
