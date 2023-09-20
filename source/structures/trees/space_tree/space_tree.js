import { NAryTree } from '../n_ary_tree';
import { SpaceTreeNode } from './space_tree_node';
import { BoundingBox } from '../../../space/bounds/bounding_box';

class SpaceTree extends NAryTree {
	constructor(args = {}) {
		super(Object.assign(args, { branches: 8 }));
		this.objects = args.objects || [];
		this.root = new BoundingBox(...args.region);
		this.rootShape = new BoundingBox(...args.region);
		this.minSize = args.minSize || 10;
		this.maxSize = args.maxSize || null;
		this.shouldResize = args.resize || false;
		this.leafCount = 0;
	}
	division(index, bBox) {
		let center = bBox ? bBox.center() : this.node.center(),
			min = bBox ? bBox.min : this.node.min,
			max = bBox ? bBox.max : this.node.max, coordinates;
		switch (index) {
			case 0:
				coordinates = [min, center]
				break;
			case 1:
				coordinates = [[center[0], min[1], min[2]], [max[0], center[1], center[2]]]
				break;
			case 2:
				coordinates = [[center[0], min[1], center[2]], [max[0], center[1], max[2]]]
				break;
			case 3:
				coordinates = [[min[0], min[1], center[2]], [center[0], center[1], max[2]]]
				break;
			case 4:
				coordinates = [[min[0], center[1], min[2]], [center[0], max[1], center[2]]]
				break;
			case 5:
				coordinates = [[center[0], center[1], min[2]], [max[0], max[1], center[2]]]
				break;
			case 6:
				coordinates = [center, max]
				break;
			case 7:
				coordinates = [[min[0], center[1], center[2]], [center[0], max[1], max[2]]]
				break;

		}
		if (coordinates) return new BoundingBox(...coordinates)
		return
	}

	// rebuildTree() {
	// 	//call node.expand(toFit)
	// }

	// get maxDepth() {
	// 	if (!this.state.minSize) return super.maxDepth;
	// 	const range = this.root.extent().map((e) => e * 2);
	// 	const max = Math.max(...range);
	// 	return max / this.state.minSize

	// }

	insert(inserted, callback) {
		// if (this.state.level === 0 && this.shouldResize) {
		// 	const hasResized = this.node.expand(inserted);
		// 	if (hasResized) this.rebuildTree();
		// 	//TODO: insert the new item
		// }

		let nodeSmallerThanMin = this.node.size().reduce((bool, m) => {
			return bool || m <= this.minSize
		}, false)
		if (nodeSmallerThanMin) {
			if (callback) callback(inserted)

			if (this.state.maxDepth < this.state.level) {
				this.state.maxDepth = this.state.level;
			}
			const wasInserted = this.nodeItem.add(inserted, this.leafCount);
			this.leafCount++;
			return wasInserted;
		}

		let bBox, found = false, parent = this.node;
		this.eachChild(function (item, index) {
			if (found) return found;
			bBox = this.node || this.division(index, parent)
			if (bBox.contains(inserted)) {
				if (!item) {
					this.node = bBox;
				}

				found = this.insert(inserted, callback)
			}
		})

		if (!found) {
			if (callback) callback(inserted)
			return this.nodeItem.add(inserted)
		}
		return found;
	}
	getClosest(queried) {
		if (!this.nodeItem) { return }
		let closest, closestDistance, distance;
		this.nodeItem.objects.forEach((obj, i) => {
			if (!obj.distance) { return }
			distance = obj.distance(queried)
			if (!closestDistance || distance < closestDistance) {
				closestDistance = distance;
				closest = {
					item: obj,
					dist: closestDistance,
					index: this.nodeItem.indices[i]
				}
			}
		})
		return closest;
	}
	closestByColor(queried, options = {}) {
		const deColorized = this.deColorize(queried);
		const { item, dist, index } = this._closest(deColorized);
		if (!options.index && !options.dist) return item;
		if (options.index) {
			let returned = { item, index }
			if (options.dist) returned.dist = dist;
			return returned;
		}
		if (options.dist) {
			return { item, dist }
		}
	}
	closest(queried, options = {}) {
		const { item, dist, index } = this._closest(queried);
		if (!options.index && !options.dist) return item;
		if (options.index) {
			let returned = { item, index }
			if (options.dist) returned.dist = dist;
			return returned;
		}
		if (options.dist) {
			return { item, dist }
		}
	}
	_closest(queried) {
		let nodeSmallerThanMin = this.node.size().reduce((bool, m) => {
			return bool || m <= this.minSize
		}, false)
		if (nodeSmallerThanMin) {
			return this.getClosest(queried)
		}

		let bBox, found = false, parent = this.node, close;
		const candidates = [];
		this.eachChild(function (item, index) {
			bBox = this.node;
			if (!bBox) return;
			candidates.push({ l: this.state.level, n: this.state.node, dist: bBox.distance(queried) })
		});

		candidates.sort((a, b) => a.dist - b.dist);
		let closest = null;
		for (const candidate of candidates) {
			if (!closest || candidate.dist < closest.dist) {
				this.goTo(candidate.n, candidate.l);
				closest = this._closest(queried);
				this.toParent();
			}
		}

		if (!closest) {
			return this.getClosest(queried)
		}
		return closest
	}
	randomPoint() {
		return this.node.size().map((m, i) => (Math.random() * m) + this.node.min[i])
	}
	bestCandidate(numCandidates = 10) {
		let bestCandidate, bestDistance = 0, p, c, d;
		for (let i = 0; i < numCandidates; ++i) {
			p = this.randomPoint(),
				c = this._closest(p),
				d = c && c.distance ? c.distance(p) : undefined;
			if (d == undefined || d > bestDistance) {
				bestDistance = d;
				bestCandidate = p;
			}
		}
		return bestCandidate;
	}

	makeNode(value) {
		let val = value == undefined ? false : value;
		return new SpaceTreeNode({ value: value, node: this.state.node, level: this.state.level })
	}

	colorize(item) {
		const max = this.rootShape.max;
		const min = this.rootShape.min;
		return item.map((point, i) => {
			return (point - min[i]) / (max[i] - min[i]);
		})
	}

	deColorize(colorizedItem) {
		const max = this.rootShape.max;
		const min = this.rootShape.min;

		return colorizedItem.map((colorizedValue, i) => {
			return colorizedValue * (max[i] - min[i]) + min[i];
		});
	}

	getValues(options) {
		const { buffer, colors, positions, indices } = options;
		let returned = [];
		let test = [];
		this.preOrderDepth((node, nodeAddress, levelAddress) => {
			if (!this.node) return;
			const nodeItem = this.getNodeItem({ level: levelAddress, node: nodeAddress });
			nodeItem.objects.forEach((obj, i) => {
				let pushed = {};
				if (colors) {
					pushed.color = this.colorize(obj.center ? obj.center() : obj)
				}
				if (positions) {
					pushed.position = obj.center ? obj.center() : obj
				}
				pushed.index = nodeItem.indices[i];
				returned.push(pushed);
			})

			if (buffer) {
				returned.sort((a, b) => a.index - b.index);
				test = returned.reduce((result, a) => {
					if (colors) {
						result.colors.push(...a.color)
					}
					if (positions) {
						result.positions.push(...a.position)
					}
					result.indices.push(a.index);

					return result
				}, { colors: [], indices: [], positions: [] })
			} else {

				test = returned.reduce((result, a) => {
					if (colors) {
						result.colors.push(a.color)
					}
					if (positions) {
						result.positions.push(a.position)
					}
					result.indices.push(a.index);

					return result
				}, { colors: [], indices: [], positions: [] })
			}
		});
		return { positions: test.positions, indices: test.indices, colors: test.colors };
	}
}
export { SpaceTree }
