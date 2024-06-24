/**
 * @typedef {import('./types').Box} Box
 * @typedef {import('./types').Position} Position
 * @typedef {import('./types').SvgElement} SvgElement
 */

import { FONT_SIZE, LINE_MARGIN, LINE_OFFSET, PADDING } from './constants';
import { getLineSvg, newLine, processLineSize } from './line';
import { getGroupInColSize, getPaddingSize } from './size';
import { newRect } from './svg';

/**
 * @param {string} text
 * @returns {Box}
 */
export function newBox(text) {
	return {
		lines: text.split('\n').map(newLine)
	};
}

/**
 * @param {Box} box
 */
export function processBoxSize(box) {
	box.lines.forEach(processLineSize);
	// @ts-expect-error box.lines satisfied Size[]
	const boxSize = getPaddingSize(getGroupInColSize(box.lines, LINE_MARGIN), PADDING);
	box.width = boxSize.width;
	box.height = boxSize.height;
}

/**
 * @param {Position} rootPosition
 * @param {Box} box
 */
export function processBoxPosition(rootPosition, box) {
	box.x = rootPosition.x;
	box.y = rootPosition.y;

	const linesX = rootPosition.x + PADDING;
	box.lines.reduce(
		(y, line) => {
			line.x = linesX;
			line.y = y;
			return y + FONT_SIZE + LINE_MARGIN;
		},
		rootPosition.y + PADDING + LINE_OFFSET
	);
}

/**
 * @param {string} fill
 * @param {Box} box
 * @returns {SvgElement[]}
 */
export function getBoxSvgs(fill, box) {
	return [
		newRect({
			x: box.x,
			y: box.y,
			width: box.width,
			height: box.height,
			rx: 3,
			ry: 3,
			filter: 'url(#box)',
			fill
		}),
		...box.lines.map(getLineSvg)
	];
}
