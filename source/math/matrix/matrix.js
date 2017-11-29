class Matrix extends Array {
	constructor(cols, rows){
		super();
		this.cols = cols;
		this.rows = rows;
		this.length = cols * rows;
	}
}

export Matrix;
