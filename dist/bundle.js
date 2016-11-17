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

	var _grids = __webpack_require__(7);

	var grids = _interopRequireWildcard(_grids);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	exports.default = { generators: generators, vector: vector, constants: constants, grids: grids };

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _sphere_grid = __webpack_require__(8);

	Object.keys(_sphere_grid).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _sphere_grid[key];
	    }
	  });
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.SphereGrid = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _grid_tree = __webpack_require__(9);

	var _grid_tree2 = _interopRequireDefault(_grid_tree);

	var _vector = __webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var SphereGrid = function (_GridTree) {
		_inherits(SphereGrid, _GridTree);

		function SphereGrid(resolution, center, radius) {
			_classCallCheck(this, SphereGrid);

			if (resolution.length !== 2) {
				var _ret;

				console.warn('must have 2 resolution to make each grid');return _ret = false, _possibleConstructorReturn(_this, _ret);
			}
			resolution.unshift(6);
			resolution.push(3);

			var _this = _possibleConstructorReturn(this, (SphereGrid.__proto__ || Object.getPrototypeOf(SphereGrid)).call(this, resolution));

			_this.center = center;
			_this.radius = radius;
			_this.buildGrid();
			return _this;
		}

		_createClass(SphereGrid, [{
			key: 'vectorGet',
			value: function vectorGet(_ref) {
				//accesses the grid point that is closest to vector given 
				//by comparing vector against center

				var _ref2 = _slicedToArray(_ref, 3),
				    x = _ref2[0],
				    y = _ref2[1],
				    z = _ref2[2];

				var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : center;
			}
		}, {
			key: 'vectorSet',
			value: function vectorSet(_ref3) {
				//accesses the grid point that is closest to vector given 
				//by comparing vector against center

				var _ref4 = _slicedToArray(_ref3, 3),
				    x = _ref4[0],
				    y = _ref4[1],
				    z = _ref4[2];

				var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : center;
			}
		}, {
			key: 'uvGet',
			value: function uvGet() {
				// n = Normalize(sphere_surface_point - sphere_center);
				// u = atan2(n.x, n.z) / (2*pi) + 0.5;
				// v = n.y * 0.5 + 0.5;		
			}
		}, {
			key: 'uvSet',
			value: function uvSet() {
				// n = Normalize(sphere_surface_point - sphere_center);
				// u = atan2(n.x, n.z) / (2*pi) + 0.5;
				// v = n.y * 0.5 + 0.5;		
			}
		}, {
			key: 'toSphere',
			value: function toSphere() {
				var radius = this.radius;
				var center = this.center;
				this.traverse(function (value) {
					var diff = (0, _vector.subtract)(value, center);
					this.value = (0, _vector.scale)((0, _vector.normalize)(diff), radius);
				});
			}
		}, {
			key: 'buildGrid',
			value: function buildGrid() {
				var direction = void 0,
				    axis = void 0,
				    percentU = void 0,
				    percentV = void 0,
				    axisValue = void 0,
				    value1 = void 0,
				    value2 = void 0,
				    range = void 0,
				    toSet = void 0;
				for (var i = 0; i < this.density; i++) {
					direction = i % 2 == 0 ? 1.0 : -1.0;
					axis = i % 3;
					axisValue = this.radius * direction;
					range = this.radius - this.radius * -1.0;
					for (var u = 0; u < this.dimensions[0]; u++) {
						percentU = u / (this.dimensions[0] - 1);
						value1 = direction * (percentU * range + this.radius * -1.0);
						for (var v = 0; v < this.dimensions[1]; v++) {
							percentV = v / (this.dimensions[1] - 1);
							value2 = direction * (percentV * range + this.radius * -1.0);
							toSet = [this.center[0] + axis == 0 ? axisValue : axis == 1 ? value2 : value1, this.center[1] + axis == 1 ? axisValue : axis == 2 ? value2 : value1, this.center[2] + axis == 2 ? axisValue : axis == 0 ? value2 : value1];
							this.set([i, u, v], toSet);
						}
					}
				}
			}
		}]);

		return SphereGrid;
	}(_grid_tree2.default);

	exports.SphereGrid = SphereGrid;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _guid = __webpack_require__(3);

	var _guid2 = _interopRequireDefault(_guid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GridNode = function () {
		function GridNode(_ref) {
			var __l = _ref.__l,
			    __n = _ref.__n,
			    __first = _ref.__first,
			    __last = _ref.__last;

			_classCallCheck(this, GridNode);

			this.__id = (0, _guid2.default)();
			this.__l = __l;
			this.__n = __n;
			this.__first = __first;
			this.__last = __last;
			this.__children = [];
			this.dimensions = [];
		}

		_createClass(GridNode, [{
			key: 'traverse',
			value: function traverse(callback) {
				var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

				if (this.leaf) return callback.call(this, this.root.grid.slice(this.__first, this.__last), address);
				var a = address;
				this.__children.forEach(function (child, index) {
					a.push(index);
					child.traverse(callback, a);
					a.pop();
				});
			}
		}, {
			key: 'index',
			value: function index(indices) {
				var current = indices && indices.length ? indices.shift() : undefined;
				if (this.leaf) {
					return current !== undefined ? this.__first + current : this.__first;
				}
				if (current !== undefined) {
					return this.__children[current].index(indices);
				}
				return this.__first;
			}
		}, {
			key: 'get',
			value: function get(indices) {
				var current = indices && indices.length ? indices.shift() : undefined;
				if (current >= this.density) {
					console.warn('cannot set to ' + current + ' in dimension ' + this.__l);
					return;
				}
				if (this.leaf) {
					return current !== undefined ? this.children[current] : this.children;
				}
				return this.__children[current].get(indices);
			}
		}, {
			key: 'set',
			value: function set(indices, value) {
				var current = indices && indices.length ? indices.shift() : undefined;
				if (current >= this.density) {
					console.warn('cannot set to ' + current + ' in dimension ' + this.__l);
					return false;
				}
				if (this.leaf) {
					if (current !== undefined) {
						return (this.root.grid[this.__first + current] = value) == value;
					}
					this.children = value;
					return true;
				}
				if (!this.__children[current]) {
					return false;
				}
				return this.__children[current].set(indices, value);
			}
		}, {
			key: 'makeChildren',
			value: function makeChildren() {
				var dimensions = this.dimensions.slice();
				var childLength = dimensions.reduce(function (sum, density) {
					return sum * density;
				}, 1);
				for (var i = 0; i < this.density; i++) {
					this.__children[i] = new DimensionNode(this.root, {
						__l: this.__l + 1,
						__n: i,
						__first: this.__first + childLength * i,
						__last: this.__first + childLength * i + childLength
					}, this);
				}
			}
		}, {
			key: 'children',
			get: function get() {
				if (this.leaf) return this.root.grid.slice(this.__first, this.__last);

				return this.__children.reduce(function (sum, child) {
					return sum.concat(child.children);
				}, []);
			},
			set: function set(value) {
				var _root$grid;

				var v = [].concat(value);
				if (this.leaf) return (_root$grid = this.root.grid).splice.apply(_root$grid, [this.__first, this.density].concat(_toConsumableArray(v))).length == 0;

				this.__children.forEach(function (child) {
					return child.children = value;
				});
				return true;
			}
		}, {
			key: 'value',
			get: function get() {
				return this.children;
			},
			set: function set(value) {
				this.children = value;
				return true;
			}
		}]);

		return GridNode;
	}();

	var DimensionNode = function (_GridNode) {
		_inherits(DimensionNode, _GridNode);

		function DimensionNode(grid, address, parent) {
			_classCallCheck(this, DimensionNode);

			var _this = _possibleConstructorReturn(this, (DimensionNode.__proto__ || Object.getPrototypeOf(DimensionNode)).call(this, address));

			_this.__parent = parent || null;
			_this.root = grid;
			_this.dimensions = _this.__parent ? _this.__parent.dimensions.slice() : _this.root.dimensions.slice();
			_this.density = _this.dimensions.shift();
			if (_this.dimensions.length == 0) {
				_this.leaf = true;
				return _possibleConstructorReturn(_this);
			}
			_this.makeChildren();
			return _this;
		}

		_createClass(DimensionNode, [{
			key: 'length',
			get: function get() {
				return this.dimensions.reduce(function (sum, density) {
					return sum * density;
				}, 1);
			}
		}]);

		return DimensionNode;
	}(GridNode);

	var GridTree = function (_GridNode2) {
		_inherits(GridTree, _GridNode2);

		function GridTree(dimensions) {
			_classCallCheck(this, GridTree);

			var _this2 = _possibleConstructorReturn(this, (GridTree.__proto__ || Object.getPrototypeOf(GridTree)).call(this, { __first: 0, __last: 0, __l: 0 }));

			_this2.dimensions = dimensions.slice();
			_this2.density = _this2.dimensions.shift();
			_this2.grid = [];
			_this2.grid.length = _this2.length;
			_this2.root = _this2;
			_this2.makeChildren();
			return _this2;
		}

		_createClass(GridTree, [{
			key: 'length',
			get: function get() {
				return this.dimensions.reduce(function (sum, density) {
					return sum * density;
				}, this.density);
			}
		}]);

		return GridTree;
	}(GridNode);

	exports.default = GridTree;

/***/ }
/******/ ]);