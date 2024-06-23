/**
 * @typedef {import("./types").Task} Task
 * @typedef {import("./types").SvgElement} SvgElement
 */

import { getBoxSvgs, newBox, processBoxPosition, processBoxSize } from './box';

/**
 * @param {{label: unknown, stories: string}} taskYaml
 * @returns {Task}
 */
export function newTask(taskYaml) {
	if (typeof taskYaml.label !== 'string') {
		throw new Error('parsed task must have label with type string');
	}
	return {
		label: newBox(taskYaml.label),
		numOfCol: 1,
		stories: []
	};
}

/**
 * @param {Task} task
 */
export function processTaskSize(task) {
	processBoxSize(task.label);
	task.width = task.label.width;
	task.height = task.label.height;
}

/**
 * @param {number} taskLabelHeight
 * @param {Task} task
 */
export function processTaskChildrenPosition(taskLabelHeight, task) {
	if (typeof task.x === 'undefined' || typeof task.y === 'undefined') {
		throw new Error('activiy.x and activity.y must be defined');
	}
	processBoxPosition({ x: task.x, y: task.y }, task.label);
}

/**
 * @param {Task} task
 * @returns {SvgElement[]}
 */
export function getTaskSvgs(task) {
	return [...getBoxSvgs(task.label, 'cyan')];
}
