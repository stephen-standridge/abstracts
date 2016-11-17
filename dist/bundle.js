module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _generators = __webpack_require__(2);

	var generators = _interopRequireWildcard(_generators);

	var _vector = __webpack_require__(6);

	var vector = _interopRequireWildcard(_vector);

	var _constants = __webpack_require__(5);

	var constants = _interopRequireWildcard(_constants);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = { generators: generators, vector: vector, constants: constants };

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _guid = __webpack_require__(3);

	Object.keys(_guid).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _guid[key];
	    }
	  });
	});

	var _logarithmic_spiral = __webpack_require__(4);

	Object.keys(_logarithmic_spiral).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _logarithmic_spiral[key];
	    }
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = guid;
	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.logarithmic = logarithmic;

	var _constants = __webpack_require__(5);

	function logarithmic(c, r, a) {
		var angle = a || 0.30635;
		var constant = c || 1;
		var rotation = r || _constants.TAU;
		return function (x) {
			var t = x * rotation;
			var polar = constant * Math.pow(_constants.E, angle * t);
			return [(polar * Math.cos(t)).toFixed(5) / 1, (polar * Math.sin(t)).toFixed(5) / 1, (polar * Math.tan(angle)).toFixed(5) / 1];
		};
	}

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var PHI = exports.PHI = 1.618033988749895;
	var PI = exports.PI = Math.PI;
	var TAU = exports.TAU = 2 * PI;
	var E = exports.E = 2.718281828459045;
	var EPSILON = exports.EPSILON = 0.00001;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.dot = dot;
	exports.cross = cross;
	exports.perpendicular = perpendicular;
	exports.direction = direction;
	exports.length = length;
	exports.toLength = toLength;
	exports.unit = unit;
	exports.descale = descale;
	exports.multiply = multiply;
	exports.divide = divide;
	exports.add = add;
	exports.subtract = subtract;
	exports.distance = distance;
	exports.scale = scale;
	exports.copy = copy;
	exports.average = average;
	exports.createAxes = createAxes;
	function dot(a, b) {
		return a.reduce(function (start, next, index) {
			return start + next * b[index];
		}, 0);
	}

	function cross(a, b) {
		if (a.length !== 3 || b.length !== 3) {
			throw new Error('can only cross vectors in 3d');
		}
		return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
	}

	function perpendicular(v, s) {
		// return vector such that v * vector = 0;
		// v[0] * vector[0] + v[1] * vector[1] + v[2] * vector[2] = 0
		// v[2] * vector[2] = -v[0] * vector[0] - v[1] * vector[1]
		// vector[2] = ( -v[0] * vector[0] - v[1] * vector[1] ) / v[2]
		return [s, s, (-v[0] * s - v[1] * s) / v[2]];
	}

	function direction(a, b) {
		return a.map(function (p, i) {
			return p > b[i] ? -1.0 : p < b[i] ? 1.0 : 0.0;
		});
	}

	function length(v) {
		return Math.sqrt(dot(v, v));
	}

	function toLength(v, s) {
		var u = unit(v);
		return scale(u, s);
	}

	function unit(v) {
		var l = length(v);
		return v.map(function (p) {
			return p / l;
		});
	}

	var normalize = exports.normalize = unit;

	function descale(v, s) {
		return v.map(function (p) {
			return p / s;
		});
	}

	function multiply(a, b) {
		return a.map(function (p, i) {
			return p * b[i];
		});
	}

	function divide(a, b) {
		return a.map(function (p, i) {
			return p / b[i];
		});
	}

	function add(a, b) {
		return a.map(function (p, i) {
			return p + b[i];
		});
	}

	function subtract(a, b) {
		return a.map(function (p, i) {
			return p - b[i];
		});
	}

	function distance(a, b) {
		return a.map(function (p, i) {
			return Math.abs(p - b[i]);
		});
	}

	function scale(v, s) {
		return v.map(function (p) {
			return p * s;
		});
	}

	function copy(v) {
		return v.slice(0);
	}

	function average(a) {
		var t = a.reduce(function (sum, v) {
			return add(sum, v);
		}, [0, 0, 0, 0]);
		return descale(t, a.length);
	}

	function createAxes(v, s) {
		var a = unit(perpendicular(v, s || Math.random()));
		var b = cross(a, v);
		return [a, b];
	}

/***/ }
/******/ ]);