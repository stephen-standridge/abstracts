import { Subject } from 'rx'

class Emitter {
	constructor(args){
		this.subjects = {};
		this.pausable = args && args.pausable || false;
		this.sources = {};
		this.pausers = {};
	}
	createName(name) {
		return '$' + name;
	}
	pause(name) {
		if(!this.pausable) { console.warn('cannot pause an emitter that is not pausable'); return false; }
		this.pausers[this.createName(name)].onNext(false);
	}
	unpause(name) {
		if(!this.pausable) { console.warn('cannot unpause an emitter that is not pausable'); return false; }
		this.pausers[this.createName(name)].onNext(true);
	}
	createSubject(name){
		let fnName = this.createName(name);
		if(this.sources[fnName]) { console.warn('cannot create a subject that already exists, that could really fuck shit up'); return false; }
		if (this.pausable) {
			const source = new Subject();
			const pauser = new Subject();
			const pausable = pauser.switchMap(paused => paused ? Observable.never() : source);

			pauser.onNext(true);
			this.subjects[fnName] = pausable;
			this.sources[fnName] = source;
			this.pausers[fnName] = source;
		} else {
			this.sources[fnName] = new Subject();
		}
	}
	emit(name, data) {
		var fnName = this.createName(name);
		this.sources[fnName] || this.createSubject(name);
		this.sources[fnName].onNext(data);
	}
	get(name) {
		var fnName = this.createName(name);

		this.ources[fnName] || this.createSubject(name);
		return this.subjects[fnName] || this.sources[fnName];
	}
	cancel(name) {
		var fnName = this.createName(name);
		if (this.subjects[fnName]) {
			this.subjects[fnName].dispose();
			delete this.subjects[fnName];
		}
		if(this.pausers[fnName]) {
			this.pausers[fnName].dispose();
			delete this.pausers[fnName];
		}
	}
	cancelAll() {
		Object.keys(this.sources).forEach((key) => {
			this.sources[key].dispose();
		})
		Object.keys(this.pausers).forEach((key) => {
			this.pausers[key].dispose();
		})
		this.subjects = {};
		this.sources = {};
		this.pausers = {};
	}
}

export { Emitter }
