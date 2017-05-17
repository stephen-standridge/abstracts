// global.consoleLogger = {
// 	_logs: [],
// 	_warns: [],
// 	_errors: [],
// 	enabled: {
// 		log: false,
// 		warn: false,
// 		error: false
// 	},
// 	shouldShow: false,
// 	show: function(bool) {
// 		this.shouldShow = bool;
// 	},
// 	enable: function(which){
// 		if (typeof this.enabled[which] !== 'undefined') {
// 			this[`_${which}`] = global.console[which];
// 			global.console[which] = this[which].bind(this);
// 			this.enabled[which] = true;
// 		}
// 		console.warn(this)
// 	},
// 	disable: function(which){
// 		if (this.enabled[which]) {
// 			global.console[which] = this[`_${which}`];
// 			this.enabled[which] = false;
// 		}
// 	},
// 	clear: function(){
// 		this._logs = []
// 		this._warns = []
// 		this._errors = []
// 	},
// 	log: function(...messages){
// 		this._logs.concat(messages)
// 		this.shouldShow && this._log(messages)
// 	},
// 	warn: function(...messages){
// 		this._warns.concat(messages)
// 		this.shouldShow && this._warn(messages)
// 	},
// 	error: function(...messages){
// 		this._errors.concat(messages)
// 		this.shouldShow && this._error(messages)
// 	}

// }

// consoleLogger.enable('log');
// consoleLogger.enable('warn');
// consoleLogger.enable('error');
