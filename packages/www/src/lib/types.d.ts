export interface TabEvents {
	select: Tab;
}

export interface Tab {
	id: string;
	title: string;
	icon: string;
}

export interface State {
	pan?: { x: number; y: number };
	zoom?: number;
}

export interface ValidatedState extends State {}
