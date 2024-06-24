/**
 * @typedef {import("./types").Size} Size
 */

/**
 * @param {Size} size
 * @param {number} padding
 * @returns {Size}
 */
export function getPaddingSize(size, padding) {
	const diffSize = padding << 1; // PADDING * 2
	return {
		width: size.width + diffSize,
		height: size.height + diffSize
	};
}

/**
 * @param {Size[]} sizes
 * @returns {Size}
 */
export function getGroupSize(sizes, numOfCol = 1, margin = 0) {
	const numOfRow = Math.ceil(sizes.length / numOfCol);
	const rowSizes = [...Array(numOfRow)].map((_, i) => {
		const colI = numOfCol * i;
		return getGroupInRowSize(sizes.slice(colI, colI + numOfCol), margin);
	});
	const colSizes = [...Array(numOfCol)].map((_, i) => {
		return getGroupInColSize(
			sizes.filter((_, sizeI) => sizeI % numOfCol == i),
			margin
		);
	});
	return {
		height: getGroupInColSize(rowSizes, margin).height,
		width: getGroupInRowSize(colSizes, margin).width
	};
}

/**
 * @param {Size[]} sizes
 * @returns {Size}
 */
export function getGroupInRowSize(sizes, margin = 0) {
	if (sizes.length == 0) {
		return { width: 0, height: 0 };
	}
	const width = sizes.map((size) => size.width).reduce((p, c) => p + c + margin);
	const height = Math.max(...sizes.map((size) => size.height));
	return {
		width,
		height
	};
}

/**
 * @param {Size[]} sizes
 * @returns {Size}
 */
export function getGroupInColSize(sizes, margin = 0) {
	if (sizes.length == 0) {
		return { width: 0, height: 0 };
	}
	const width = Math.max(...sizes.map((size) => size.width));
	const height = sizes.map((size) => size.height).reduce((p, c) => p + c + margin);
	return {
		width,
		height
	};
}
