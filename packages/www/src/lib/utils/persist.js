/**
 * @template T
 * @typedef {import('svelte/store').Writable<T>} Writable
 */

/**
 * @typedef PersistentStoreBase
 * @property {() => void} delete Delete the store value from the persistent storage
 */

/**
 * A store that keep it's value in time.
 *
 * @template T
 * @typedef {PersistentStoreBase & Writable<T>} PersistentStore
 */

/**
 * @template T
 *
 * Make a store persistent
 * @param {Writable<T>} store The store to enhance
 * @param {string} key The name of the data key
 *
 * @returns {PersistentStore<T>}
 */
export function persist(store, key) {
	if (typeof window === 'undefined' || !window.localStorage) {
		return {
			...store,
			delete() {}
		};
	}
	/** @type {T} */
	const initialValue = JSON.parse(localStorage.getItem(key) ?? 'null');

	if (null !== initialValue) {
		store.set(initialValue);
	}

	store.subscribe((value) => {
		localStorage.setItem(key, JSON.stringify(value));
	});

	return {
		...store,
		delete() {
			localStorage.removeItem(key);
		}
	};
}
