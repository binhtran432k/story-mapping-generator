/**
 * @typedef {import("./types").Activity} Activity
 * @typedef {import("./types").SvgElement} SvgElement
 */

import { getBoxSvgs, newBox, processBoxPosition, processBoxSize } from './box';

/**
 * @param {{label: unknown, tasks: unknown}} activityYaml
 * @returns {Activity}
 */
export function newActivity(activityYaml) {
	if (typeof activityYaml.label != 'string') {
		throw new Error('parsed activity must have label with type string');
	}
	return {
		label: newBox(activityYaml.label),
		tasks: []
	};
}

/**
 * @param {Activity} activity
 */
export function processActivitySize(activity) {
	processBoxSize(activity.label);
	activity.width = activity.label.width;
	activity.height = activity.label.height;
}

/**
 * @param {number} activityLabelHeight
 * @param {number} taskLabelHeight
 * @param {Activity} activity
 */
export function processActivityChildrenPosition(activityLabelHeight, taskLabelHeight, activity) {
	if (typeof activity.x === 'undefined' || typeof activity.y === 'undefined') {
		throw new Error('activiy.x and activity.y must be defined');
	}
	processBoxPosition({ x: activity.x, y: activity.y }, activity.label);
}

/**
 * @param {Activity} activity
 * @returns {SvgElement[]}
 */
export function getActivitySvgs(activity) {
	return [...getBoxSvgs(activity.label)];
}
