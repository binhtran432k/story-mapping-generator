/**
 * @typedef {import("./types").Line} Line
 * @typedef {import("./types").SvgElement} SvgElement
 */

import { newText } from './svg';
import { getTextSize } from './text';

/**
 * @param {string} line
 * @returns {Line}
 */
export function newLine(line) {
	return { val: line };
}

/**
 * @param {Line} line
 */
export function processLineSize(line) {
	const textSize = getTextSize(line.val);
	line.width = textSize.width;
	line.height = textSize.height;
}

/**
 * @param {Line} line
 * @returns {SvgElement}
 */
export function getLineSvg(line) {
	return newText(
		{
			x: line.x,
			y: line.y,
			fill: 'black',
			textLength: line.width,
			style: {
				'white-space': 'pre'
			}
		},
		line.val
	);
}
