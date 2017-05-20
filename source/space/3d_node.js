import { Emitter } from '../utils'
//Based on ofNode
//https://github.com/openframeworks/openFrameworks/blob/master/libs/openFrameworks/3d/ofNode.cpp

class 3DNode extends Emitter {
	constructor(position=[0,0,0], orientation=[0,0,0], scale=1, emitterArgs){
		super(emitterArgs);
		setPosition(position);
		setOrientation(orientation);
		setScale(scale);
	}
	setPosition(position){
		this._position = position;
		createMatrix();
		emit('position', position);
	}
}


