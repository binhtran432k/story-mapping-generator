import { getDiagramSvg, newDiagram } from './diagram';
import { getStringFromSvg } from './svg';

import { parse } from 'yaml';

/**
 * @param {string} id
 * @param {string} code
 * @returns {string}
 */
export function renderDiagram(id, code) {
	const diagram = newDiagram(parse(code));
	if (!diagram.activities.length) {
		return '';
	}
	return getStringFromSvg(getDiagramSvg(id, diagram));
}
