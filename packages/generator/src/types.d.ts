export interface Diagram extends Partial<Size> {
	activities: Activity[];
}

export interface Activity extends Partial<Position>, Partial<Size> {
	label: Box;
	tasks: Task[];
}

export interface Task extends Partial<Position>, Partial<Size> {
	label: Box;
	numOfCol: number;
	stories: Box[];
}

export interface Box extends Partial<Position>, Partial<Size> {
	lines: Line[];
}

export interface Line extends Partial<Position>, Partial<Size> {
	val: string;
}

export interface SvgElement extends Partial<Position>, Partial<Size> {
	tag: string;
	children?: SvgElement[] | string;

	xmlns?: 'http://www.w3.org/2000/svg';
	style?: string | Record<string, unknown>;
	viewBox?: string | (Size & Position);
	id?: string;
	fill?: string;
	textLength?: number;
	dx?: number;
	dy?: number;
	rx?: number;
	ry?: number;
	filter?: string;
	stdDeviation?: number;
	'flood-opacity'?: number;
}

export type Argument = Omit<SvgElement, 'tag' | 'children'>;

export interface Position {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}
