import * as monaco from 'monaco-editor';
import schema from '$lib/schema.json';

// Import the workers in a production-safe way.
// This is different than in Monaco's documentation for Vite,
// but avoids a weird error ("Unexpected usage") at runtime
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { configureMonacoYaml } from 'monaco-yaml';
import yamlWorker from './yaml-worker?worker';

self.MonacoEnvironment = {
	getWorker: function (_, label) {
		switch (label) {
			case 'editorWorkerService':
				return new editorWorker();
			case 'yaml':
				return new yamlWorker();
			default:
				throw new Error(`Unknown label ${label}`);
		}
	}
};

configureMonacoYaml(monaco, {
	schemas: [
		{
			fileMatch: ['**/storymapping.yaml'],
			uri: 'foo://schema.json',
			// @ts-ignore imported schema is valid
			schema
		}
	]
});

export default monaco;
