import { derived, get, writable } from 'svelte/store';
import { persist } from './persist';
import sample from '$lib/sample.yaml?raw';

/**
 * @typedef {import('$lib/types').State} State
 * @typedef {import('$lib/types').ValidatedState} ValidatedState
 */

/** @type {State} */
const defaultState = {
	code: sample,
	updateDiagram: true,
	errors: []
};

// inputStateStore handles all updates and is shared externally when exporting via URL, History, etc.
export const inputStateStore = persist(writable(defaultState), 'codeStore');

/** @type {ValidatedState} */
export const currentState = (() => {
	const state = get(inputStateStore);
	return {
		...state
	};
})();

/**
 * Process and Validate State
 *
 * @param {State} state
 * @returns {Promise<ValidatedState>}
 */
const processState = async (state) => {
	/** @type {ValidatedState} */
	const processed = {
		...state
	};
	return processed;
};

// All internal reads should be done via stateStore, but it should not be persisted/shared externally.
export const stateStore = derived(
	[inputStateStore],
	([state], set) => {
		void processState(state).then(set);
	},
	currentState
);

/**
 *
 * @param {Partial<State>} newState
 */
export const updateCodeStore = (newState) => {
	inputStateStore.update((state) => {
		return { ...state, ...newState };
	});
};

/**
 * @param {string} code
 * @param {{ updateDiagram?: boolean; resetPanZoom?: boolean }} param1
 */
export const updateCode = (code, { updateDiagram = false, resetPanZoom = false } = {}) => {
	inputStateStore.update((state) => {
		if (resetPanZoom) {
			state.pan = undefined;
			state.zoom = undefined;
		}
		return { ...state, code, updateDiagram };
	});
};
