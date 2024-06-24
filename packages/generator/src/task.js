/**
 * @typedef {import("./types").Task} Task
 * @typedef {import("./types").SvgElement} SvgElement
 */

import { getBoxSvgs, newBox, processBoxPosition, processBoxSize } from './box';
import { MARGIN } from './constants';
import { getGroupPositions } from './position';
import { getGroupInColSize, getGroupSize } from './size';

/**
 * @param {{label: unknown, numOfCol?: number, stories?: string[]}} taskYaml
 * @returns {Task}
 */
export function newTask(taskYaml) {
	if (typeof taskYaml.label !== 'string') {
		throw new Error('parsed task must have label with type string');
	}
	return {
		label: newBox(taskYaml.label),
		numOfCol: taskYaml.numOfCol ?? 1,
		stories: taskYaml.stories ? taskYaml.stories.map(newBox) : []
	};
}

/**
 * @param {Task} task
 */
export function processTaskSize(task) {
	processBoxSize(task.label);
	task.stories.forEach(processBoxSize);

	// @ts-expect-error activity.tasks has already satisfied Size[]
	const storiesSize = getGroupSize(task.stories, task.numOfCol, MARGIN);
	// @ts-expect-error activity.label has already satisfied Size
	const taskSize = getGroupInColSize([task.label, storiesSize], MARGIN);

	task.width = taskSize.width;
	task.height = taskSize.height;
}

/**
 * @param {number} taskLabelHeight
 * @param {Task} task
 */
export function reprocessTaskSize(taskLabelHeight, task) {
	const labelSize = { width: task.label.width, height: taskLabelHeight };
	task.stories.forEach(processBoxSize);

	// @ts-expect-error activity.tasks has already satisfied Size[]
	const storiesSize = getGroupSize(task.stories, task.numOfCol, MARGIN);
	// @ts-expect-error activity.label has already satisfied Size
	const taskSize = getGroupInColSize([labelSize, storiesSize], MARGIN);

	task.width = taskSize.width;
	task.height = taskSize.height;
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

	// Process Story Positions
	const storiesY = task.y + taskLabelHeight + MARGIN;
	const positions = getGroupPositions(
		{ x: task.x, y: storiesY },
		// @ts-expect-error task.stories already satisfied Size[]
		task.stories,
		task.numOfCol,
		MARGIN
	);
	task.stories.forEach((story, i) => processBoxPosition(positions[i], story));
}

/**
 * @param {Task} task
 * @returns {SvgElement[]}
 */
export function getTaskSvgs(task) {
	return [
		...getBoxSvgs('cyan', task.label),
		...task.stories.flatMap(getBoxSvgs.bind(undefined, 'yellow'))
	];
}
