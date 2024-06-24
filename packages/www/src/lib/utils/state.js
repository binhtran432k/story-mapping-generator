import { derived, get, writable } from 'svelte/store';
import { persist } from './persist';
import sample from '$lib/sample.yaml?raw';

/**
 * @typedef {import('$lib/types').State} State
 * @typedef {import('$lib/types').GeneratedState} GeneratedState
 * @typedef {import('$lib/types').ValidatedState} ValidatedState
 */

/** @type {State} */
const defaultState = {
	code: sample
};

// inputStateStore handles all updates and is shared externally when exporting via URL, History, etc.
export const inputStateStore = persist(writable(defaultState), 'codeStore');

/** @type {GeneratedState} */
const defaultGeneratedState = {
	validDiagram: false,
	errors: []
};

export const generatedStateStore = writable(defaultGeneratedState);

/** @type {ValidatedState} */
export const currentState = (() => {
	const state = get(inputStateStore);
	const generatedState = get(generatedStateStore);
	return {
		...state,
		...generatedState
	};
})();

/**
 * Process and Validate State
 *
 * @param {State} state
 * @param {GeneratedState} tmpState
 * @returns {Promise<ValidatedState>}
 */
const processState = async (state, tmpState) => {
	/** @type {ValidatedState} */
	const processed = {
		...state,
		...tmpState
	};
	return processed;
};

// All internal reads should be done via stateStore, but it should not be persisted/shared externally.
export const stateStore = derived(
	[inputStateStore, generatedStateStore],
	([state, tmpState], set) => {
		void processState(state, tmpState).then(set);
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
 * @param {{ resetPanZoom?: boolean }} param1
 */
export const updateCode = (code, { resetPanZoom = false } = {}) => {
	inputStateStore.update((state) => {
		if (resetPanZoom) {
			state.pan = undefined;
			state.zoom = undefined;
		}
		return { ...state, code };
	});
};

/**
 * @param {boolean} validDiagram
 */
export const updateValidDiagram = (validDiagram) => {
	generatedStateStore.update((state) => {
		return { ...state, validDiagram };
	});
};
