import { getDiagramSvg, newDiagram } from './diagram';
import { getStringFromSvg } from './svg';

import { parse } from 'yaml';

/**
 * @param {string} id
 * @param {string} code
 * @returns {string}
 */
export function renderDiagram(id, code) {
	return getStringFromSvg(getDiagramSvg(id, newDiagram(parse(code))));
}
