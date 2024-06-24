/**
 * @typedef {import("./types").SvgElement} SvgElement
 * @typedef {import("./types").Argument} Argument
 */

/**
 * @param {Argument} arg
 * @param  {SvgElement[]} body
 * @returns {SvgElement}
 */
export function newSvg(arg, body) {
	return newElement(
		'svg',
		{
			xmlns: 'http://www.w3.org/2000/svg',
			...arg
		},
		body
	);
}

/**
 * @param {Argument} arg
 * @returns {SvgElement}
 */
export function newRect(arg) {
	return newElement('rect', arg);
}

/**
 * @param {Argument} arg
 * @param  {SvgElement[]|string} body
 * @returns {SvgElement}
 */
export function newText(arg, body) {
	return newElement('text', arg, body);
}

/**
 * @param  {SvgElement[]} body
 * @returns {SvgElement}
 */
export function newDefs(body) {
	return newElement('defs', {}, body);
}

/**
 * @param  {string} id
 * @param  {SvgElement[]} body
 * @returns {SvgElement}
 */
export function newFilter(id, body) {
	return newElement('filter', { id }, body);
}

/**
 * @param {Argument} arg
 * @returns {SvgElement}
 */
export function newFeDropShadow(arg) {
	return newElement('feDropShadow', arg);
}

/**
 * @param {string} tag
 * @param {Argument} arg
 * @param  {SvgElement[]|string=} body
 * @returns {SvgElement}
 */
export function newElement(tag, arg, body) {
	return {
		tag,
		children: body,
		...arg
	};
}

/**
 * @param {SvgElement} elem
 * @returns {string}
 */
export function getStringFromSvg(elem) {
	if (typeof elem.style === 'object') {
		elem.style = Object.entries(elem.style)
			.filter(([, v]) => v !== undefined)
			.map(([k, v]) => `${k}:${v};`)
			.join(' ');
	}
	if (typeof elem.viewBox === 'object') {
		elem.viewBox = [elem.viewBox.x, elem.viewBox.y, elem.viewBox.width, elem.viewBox.height].join(
			' '
		);
	}
	const attr = Object.entries({ ...elem, tag: undefined, children: undefined })
		.filter(([, v]) => v !== undefined)
		.map(([k, v]) => `${k}="${v}"`)
		.join(' ');

	if (elem.children) {
		const childrenString =
			typeof elem.children === 'string'
				? elem.children
				: elem.children.map(getStringFromSvg).join('');
		return `<${elem.tag} ${attr}>${childrenString}</${elem.tag}>`;
	}
	return `<${elem.tag} ${attr}/>`;
}
