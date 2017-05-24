import { lSystem } from './lsystem';

class lSystemSkeleton extends lSystem {
	addInstruction() {
		return false
	}
	addInstructions() {
		return false
	}
	addInstructionArray() {
		return false
	}
	removeInstruction() {
		return false
	}
	getInstruction() {
		return false
	}
}

export { lSystemSkeleton }
