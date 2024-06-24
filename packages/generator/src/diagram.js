/**
 * @typedef {import("./types").Diagram} Diagram
 * @typedef {import("./types").Position} Position
 * @typedef {import("./types").SvgElement} SvgElement
 */

import {
	getActivitySvgs,
	newActivity,
	processActivityChildrenPosition,
	processActivitySize,
	reprocessActivitySize
} from './activity';
import { FONT_SIZE, MARGIN } from './constants';
import { newDefs, newFeDropShadow, newFilter, newRect, newSvg } from './svg';

/**
 * @param {any} diagramYaml
 * @returns {Diagram}
 */
export function newDiagram(diagramYaml) {
	return {
		activities: diagramYaml?.activities ? diagramYaml.activities.map(newActivity) : []
	};
}

/**
 * @param {Diagram} diagram
 */
function processDiagram(diagram) {
	// Process Activities Size
	diagram.activities.forEach(processActivitySize);

	// Process Position of Activities
	diagram.activities.reduce((x, activity) => {
		if (typeof activity.width === 'undefined') {
			throw new Error('activity.width must be defined');
		}
		activity.x = x;
		activity.y = MARGIN;
		return x + activity.width + MARGIN;
	}, MARGIN);

	// Process Position of Activity Children
	const activityLabelHeight = getActivityLabelHeight(diagram);
	const taskLabelHeight = getTaskLabelHeight(diagram);
	diagram.activities.forEach(
		processActivityChildrenPosition.bind(undefined, activityLabelHeight, taskLabelHeight)
	);

	processDiagramSize(activityLabelHeight, taskLabelHeight, diagram);
}

/**
 * @param {number} activityLabelHeight
 * @param {number} taskLabelHeight
 * @param {Diagram} diagram
 */
function processDiagramSize(activityLabelHeight, taskLabelHeight, diagram) {
	diagram.activities.forEach(
		reprocessActivitySize.bind(undefined, activityLabelHeight, taskLabelHeight)
	);

	const widths = diagram.activities.map((activity) => {
		if (typeof activity.x === 'undefined' || typeof activity.width === 'undefined') {
			throw new Error('activity.x and activity.width must be defined');
		}
		return activity.x + activity.width;
	});
	const heights = diagram.activities.map((activity) => {
		if (typeof activity.y === 'undefined' || typeof activity.height === 'undefined') {
			throw new Error('activity.y and activity.height must be defined');
		}
		return activity.y + activity.height;
	});
	diagram.width = Math.max(...widths) + MARGIN;
	diagram.height = Math.max(...heights) + MARGIN;
}

/**
 * @param {Diagram} diagram
 * @returns {number}
 */
function getActivityLabelHeight(diagram) {
	return Math.max(
		0,
		...diagram.activities.map(({ label }) => {
			if (typeof label.height === 'undefined') {
				throw new Error('label.height must be defined');
			}
			return label.height;
		})
	);
}

/**
 * @param {Diagram} diagram
 * @returns {number}
 */
function getTaskLabelHeight(diagram) {
	return Math.max(
		0,
		...diagram.activities.map(({ tasks }) =>
			Math.max(
				0,
				...tasks.map(({ label }) => {
					if (typeof label.height === 'undefined') {
						throw new Error('label.height must be defined');
					}
					return label.height;
				})
			)
		)
	);
}

/**
 * @param {string} id
 * @param {Diagram} diagram
 * @returns {SvgElement}
 */
export function getDiagramSvg(id, diagram) {
	const defs = newDefs([
		newFilter('box', [
			newFeDropShadow({
				dx: 2,
				dy: 2,
				stdDeviation: 1,
				'flood-opacity': 0.2
			})
		])
	]);
	processDiagram(diagram);
	if (typeof diagram.width === 'undefined' || typeof diagram.height === 'undefined') {
		throw new Error('diagram.width and diagram.height must be defined');
	}
	const background = newRect({
		width: diagram.width,
		height: diagram.height,
		fill: 'white'
	});
	const activities = diagram.activities.flatMap(getActivitySvgs);
	return newSvg(
		{
			width: diagram.width,
			height: diagram.height,
			style: { 'font-family': 'arial,sans-serif', 'font-size': `${FONT_SIZE}px` },
			viewBox: { x: 0, y: 0, width: diagram.width, height: diagram.height },
			id
		},
		[defs, background, ...activities]
	);
}
