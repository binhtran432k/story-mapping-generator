/**
 * @typedef {import("./types").Activity} Activity
 * @typedef {import("./types").SvgElement} SvgElement
 */

import { getBoxSvgs, newBox, processBoxPosition, processBoxSize } from './box';
import { MARGIN } from './constants';
import { getGroupInColSize, getGroupInRowSize } from './size';
import { getTaskSvgs, newTask, processTaskChildrenPosition, processTaskSize } from './task';

/**
 * @param {{label: unknown, tasks: any}} activityYaml
 * @returns {Activity}
 */
export function newActivity(activityYaml) {
	if (typeof activityYaml.label !== 'string') {
		throw new Error('parsed activity must have label with type string');
	}
	return {
		label: newBox(activityYaml.label),
		tasks: activityYaml.tasks ? activityYaml.tasks.map(newTask) : []
	};
}

/**
 * @param {Activity} activity
 */
export function processActivitySize(activity) {
	processBoxSize(activity.label);
	activity.tasks.forEach(processTaskSize);

	// @ts-expect-error activity.tasks has already satisfied Size[]
	const tasksSize = getGroupInRowSize(activity.tasks, MARGIN);
	// @ts-expect-error activity.label has already satisfied Size
	const activitySize = getGroupInColSize([activity.label, tasksSize], MARGIN);

	activity.width = activitySize.width;
	activity.height = activitySize.height;
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

	// Process Task Positions
	const tasksY = activity.y + activityLabelHeight + MARGIN;
	activity.tasks.reduce((x, task) => {
		if (typeof task.width === 'undefined') {
			throw new Error('task.width must be defined');
		}
		task.x = x;
		task.y = tasksY;
		return x + task.width + MARGIN;
	}, activity.x);

	// Process Position of Activity Children
	activity.tasks.forEach(processTaskChildrenPosition.bind(undefined, taskLabelHeight));
}

/**
 * @param {Activity} activity
 * @returns {SvgElement[]}
 */
export function getActivitySvgs(activity) {
	return [...getBoxSvgs(activity.label, 'orange'), ...activity.tasks.flatMap(getTaskSvgs)];
}
