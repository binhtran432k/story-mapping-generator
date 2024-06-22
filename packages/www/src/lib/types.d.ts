export interface TabEvents {
	select: Tab;
}

export interface Tab {
	id: string;
	title: string;
	icon: string;
}

export interface State {
	code: string;
	updateDiagram: boolean;
	pan?: { x: number; y: number };
	errors: string[];
	zoom?: number;
}

export interface ValidatedState extends State {}
