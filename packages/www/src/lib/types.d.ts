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
	pan?: { x: number; y: number };
	zoom?: number;
}

export interface GeneratedState {
	validDiagram: boolean;
	errors: string[];
}

export interface ValidatedState extends State, GeneratedState {}
