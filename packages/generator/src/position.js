/**
 * @typedef {import("./types").Size} Size
 * @typedef {import("./types").Position} Position
 */

/**
 * @param {Position} pos
 * @param {Size[]} sizes
 * @returns {Position[]}
 */
export function getGroupPositions(pos, sizes, numOfCol = 1, margin = 0) {
	const numOfRow = Math.ceil(sizes.length / numOfCol);
	const heights = [...Array(numOfRow)].map((_, i) => {
		const colI = numOfCol * i;
		const colSizes = sizes.slice(colI, colI + numOfCol);
		return Math.max(...colSizes.map((size) => size.height));
	});
	const widths = [...Array(numOfCol)].map((_, i) => {
		const rowSizes = sizes.filter((_, sizeI) => sizeI % numOfCol === i);
		return Math.max(...rowSizes.map((size) => size.width));
	});
	const ys = getSumNums(pos.y, heights, margin);
	const xs = getSumNums(pos.x, widths, margin);
	return sizes.map((_, i) => {
		const xI = i % numOfCol;
		const yI = Math.floor(i / numOfCol);
		return {
			x: xs[xI],
			y: ys[yI]
		};
	});
}

/**
 * Get new list from old list with value is sum of previou values, the current,
 * and the initial value
 *
 * @param {number} n initial value
 * @param {number[]} ns list of value
 * @param {number=} margin the margin between each value
 * @returns {number[]}
 */
export function getSumNums(n, ns, margin = 0) {
	const [, xs] = ns.reduce(
		/** @param {[number, number[]]} param0 */
		([prevSum, arr], currN) => {
			const next = prevSum + currN + margin;
			return [next, [...arr, prevSum]];
		},
		[n, []]
	);
	return xs;
}
