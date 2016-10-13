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
/***/ function(module, exports) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tree = (function () {
		function Tree() {
			var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			_classCallCheck(this, Tree);

			this.state = this.initialState();
			this.setState(args);
		}

		_createClass(Tree, [{
			key: 'initialState',
			value: function initialState() {
				return {
					data: [],
					config: {
						branches: 2,
						depth: false
					},
					nav: {
						level: 0,
						node: 0,
						maxLevel: 0
					}
				};
			}
		}, {
			key: 'setState',
			value: function setState(state) {
				if (state.config) {
					this.setConfig(state.config);
				}

				if (state.data) {
					this.setData(state.data);
				}

				if (state.nav) {
					this.setNav(state.nav);
				}
			}
		}, {
			key: 'setData',
			value: function setData() {
				var newData = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

				this.state.data = newData.slice();
				this.root;
				this.index();
				return this.state.data;
			}
		}, {
			key: 'setConfig',
			value: function setConfig() {
				var newConfig = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.state.config = Object.assign(this.state.config, newConfig);
				return this.state.config;
			}
		}, {
			key: 'setNav',
			value: function setNav() {
				var newNav = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

				this.state.nav = Object.assign(this.state.nav, newNav);
				return this.state.nav;
			}
		}, {
			key: 'flatten',
			value: function flatten() {
				var thing = this.state.data.map(function (item, index) {
					return item.value;
				});
				return thing;
			}
		}, {
			key: 'flattenItem',
			value: function flattenItem() {
				return this.state.data;
			}
		}, {
			key: '_children',
			value: function _children(prop) {
				var children = [];
				for (var i = 0; i < this.branches; i++) {
					this.toNth(i);
					children.push(this[prop]);
					this.toParent();
				}
				return children;
			}
		}, {
			key: 'maxNodeIndex',
			value: function maxNodeIndex(max) {
				return this.nodesAtIndexed(max + 1) / this.adjCount - 1;
			}
		}, {
			key: 'makeNode',
			value: function makeNode(value) {
				var n = arguments.length <= 1 || arguments[1] === undefined ? this._node : arguments[1];
				var l = arguments.length <= 2 || arguments[2] === undefined ? this._level : arguments[2];

				var val = value == undefined ? false : value;
				return {
					value: value,
					__n: n,
					__l: l
				};
			}
		}, {
			key: 'nodesAt',
			value: function nodesAt(level) {
				level = level || this._level;
				return Math.pow(this.branches, level);
			}
		}, {
			key: 'nodesAtIndexed',
			value: function nodesAtIndexed(level) {
				level = level || this._level;
				return this.nodesAt(level) - 1;
			}
		}, {
			key: 'rootNodeAt',
			value: function rootNodeAt(level) {
				level = level || this._level;
				return this.nodesAtIndexed(level) / this.adjCount;
			}
		}, {
			key: 'getIndex',
			value: function getIndex(level, node) {
				var index = node + this.nodesAtIndexed(level) / this.adjCount;
				return index;
			}
		}, {
			key: 'locate',
			value: function locate(level, node) {
				var index = this.getIndex(level, node);
				return index;
			}
		}, {
			key: 'toFirst',
			value: function toFirst() {
				var l = this.state.nav.level + 1;
				var n = this.firstChildNode;
				this.setNav({ level: l, node: n });
			}
		}, {
			key: 'toLast',
			value: function toLast() {
				var l = this.state.nav.level + 1;
				var n = this.lastChildNode;
				this.setNav({ level: l, node: n });
			}
		}, {
			key: 'toNth',
			value: function toNth(index) {
				var l = this.state.nav.level + 1;
				var n = this.firstChildNode + index;
				this.setNav({ level: l, node: n });
			}
		}, {
			key: 'toParent',
			value: function toParent() {
				var l = this.state.nav.level - 1;
				var n = Math.floor(this._node / this.branches);
				this.setNav({ level: l, node: n });
			}
		}, {
			key: 'toParentAtLevel',
			value: function toParentAtLevel() {
				var level = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

				while (this._level > level) {
					this.toParent();
				}
			}
		}, {
			key: 'goTo',
			value: function goTo(node, level) {
				var l = level !== undefined ? level : this.state.nav.level;
				var n = node !== undefined ? node : this.state.nav.node;
				this.setNav({ level: l, node: n });
			}
		}, {
			key: 'goToNode',
			value: function goToNode(node) {
				if (node == undefined) {
					return;
				}
				var l = node.__l,
				    n = node.__n;
				this.goTo(n, l);
			}
		}, {
			key: 'preOrderDepth',
			value: function preOrderDepth(callback) {
				var ctx = arguments.length <= 1 || arguments[1] === undefined ? this : arguments[1];

				callback.call(ctx, this.node, this._node, this._level);
				for (var i = 0; i < this.branches; i++) {
					this.toNth(i);
					if (this.shouldTraverseDeeper) {
						this.preOrderDepth(callback, ctx);
					}
					this.parent;
				}
			}
		}, {
			key: 'postOrderDepth',
			value: function postOrderDepth(callback) {
				var ctx = arguments.length <= 1 || arguments[1] === undefined ? this : arguments[1];

				for (var i = 0; i < this.branches; i++) {
					this.toNth(i);
					if (this.shouldTraverseDeeper) {
						this.postOrderDepth(callback, ctx);
					}
					this.parent;
				}
				callback.call(ctx, this.node, this._node, this._level);
			}
		}, {
			key: 'preOrderBreadth',
			value: function preOrderBreadth(callback) {
				var ctx = arguments.length <= 1 || arguments[1] === undefined ? this : arguments[1];

				var q = [],
				    current,
				    count = 0;
				if (!this.node) {
					return;
				}
				q.push(this.nodeAddress);

				while (q.length > 0) {
					current = q[0];
					q.shift();
					if (this.getIndex(current.__l, current.__n) < this.state.data.length) {
						this.goToNode(current);
						callback.call(ctx, this.node, this._node, this._level);
						q = q.concat(this.childrenAddresses);
					}
				}
			}
		}, {
			key: 'breadthTraverse',
			value: function breadthTraverse(callback, ctx, index) {
				var node = this.state.data[index];
				this.goToNode(node);
				if (this.node) {
					callback.call(ctx, this.node, this._node, this._level);
				}
			}
		}, {
			key: 'reIndex',
			value: function reIndex() {
				if (this.node !== undefined) {
					this.node = this.node;
				}
				if (this.shouldIndexDeeper) {
					for (var i = 0; i < this.branches; i++) {
						this.toNth(i);
						this.reIndex();
						this.parent;
					}
				}
			}
		}, {
			key: 'index',
			value: function index() {
				if (this.node !== undefined) {
					this.node = this.node;
					for (var i = 0; i < this.branches; i++) {
						this.toNth(i);
						this.index();
						this.parent;
					}
				}
			}
		}, {
			key: 'trim',
			value: function trim() {
				if (this.depth && this._level > this.depth) {
					this.reRoot();
				}
			}
		}, {
			key: 'reRoot',
			value: function reRoot() {
				var _this = this;

				var level = this._level,
				    node = this._node,
				    returnToIndex = 0,
				    returned = [];

				this.toParentAtLevel(1);
				this.preOrderBreadth(function (item, n, l) {
					returned.push(_this.nodeItem);
					if (l == level && n == node) {
						returnToIndex = returned.length - 1;
					}
				});
				this.setData(returned);
				this.goToNode(this.state.data[returnToIndex]);
				return;
			}
		}, {
			key: 'toJS',
			value: function toJS() {
				var retrieved = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

				var returned = [];
				this.state.data.forEach(function (item) {
					if (retrieved && item) {
						returned.push(item[retrieved]);
					} else {
						returned.push(item);
					}
				});
				return returned;
			}
		}, {
			key: 'branches',
			get: function get() {
				return this.state.config.branches;
			}
		}, {
			key: 'depth',
			get: function get() {
				return this.state.config.depth;
			}
		}, {
			key: 'shouldIndexDeeper',
			get: function get() {
				return this.getIndex(this._level, this.branches) < this.traversed;
			}
		}, {
			key: 'shouldTraverseDeeper',
			get: function get() {
				return this.getIndex(this._level, this.branches) < this.length;
			}
		}, {
			key: '_node',
			get: function get() {
				return this.state.nav.node;
			}
		}, {
			key: '_level',
			get: function get() {
				return this.state.nav.level;
			}
		}, {
			key: 'maxLevel',
			get: function get() {
				return this.state.nav.maxLevel;
			}
		}, {
			key: 'length',
			get: function get() {
				return this.maxNodeIndex(this.depth) + 1;
			}
		}, {
			key: 'traversed',
			get: function get() {
				return this.maxNodeIndex(this.maxLevel) + 1;
			}
		}, {
			key: 'adjCount',
			get: function get() {
				return this.branches - 1;
			}
		}, {
			key: 'firstChildNode',
			get: function get() {
				return this._node * this.branches;
			}
		}, {
			key: 'firstChildIndex',
			get: function get() {
				return this.locate(this._level + 1, this.firstChildNode);
			}
		}, {
			key: 'lastChildNode',
			get: function get() {
				return this._node * this.branches + this.adjCount;
			}
		}, {
			key: 'lastChildIndex',
			get: function get() {
				return this.locate(this._level + 1, this.lastChildNode);
			}
		}, {
			key: 'node',
			set: function set(value) {
				var level = this._level,
				    node = this._node,
				    index = this.locate(level, node);
				this.state.data[index] = this.makeNode(value);
				if (this._level > this.maxLevel) {
					this.setNav({ maxLevel: this._level });
				}
				this.trim();
				return;
			},
			get: function get() {
				var level = this._level,
				    node = this._node,
				    index = this.locate(level, node);

				return this.state.data[index] ? this.state.data[index].value : undefined;
			}
		}, {
			key: 'nodeItem',
			get: function get() {
				var level = this._level,
				    node = this._node,
				    index = this.locate(level, node);
				return this.state.data[index] || undefined;
			}
		}, {
			key: 'nodeAddress',
			get: function get() {
				return { __l: this._level, __n: this._node };
			}
		}, {
			key: 'root',
			get: function get() {
				this.setNav({ level: 0, node: 0 });
				return this.node;
			},
			set: function set(value) {
				this.root;
				this.node = value;
				return this.node;
			}
		}, {
			key: 'rootItem',
			get: function get() {
				this.root;
				return this.nodeItem;
			}
		}, {
			key: 'parent',
			get: function get() {
				this.toParent();
				return this.node;
			},
			set: function set(arg) {
				this.toParent();
				this.node = arg;
			}
		}, {
			key: 'parentItem',
			get: function get() {
				this.toParent();
				return this.nodeItem;
			}
		}, {
			key: 'children',
			get: function get() {
				return this.childrenList;
			},
			set: function set(vals) {
				var _this2 = this;

				vals.length = this.branches;

				vals.map(function (value, index) {
					_this2.toNth(index);
					_this2.node = value;
					_this2.parent;
				}, this);
			}
		}, {
			key: 'childrenList',
			get: function get() {
				return this._children('node');
			}
		}, {
			key: 'childrenItems',
			get: function get() {
				return this._children('nodeItem');
			}
		}, {
			key: 'childrenAddresses',
			get: function get() {
				return this._children('nodeAddress');
			}
		}]);

		return Tree;
	})();

	exports.default = Tree;

/***/ }
/******/ ]);