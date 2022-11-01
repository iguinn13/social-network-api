import 'reflect-metadata';

import { Container } from 'inversify';

import ClassBinder from './binders/class';
import ModelBinder from './binders/model';
import ServerBinder from './binders/server';
import ControllerBinder from './binders/controller';

const container = new Container();

function loadBinders(): Promise<unknown> {
	const binders = [
		ControllerBinder.load(),
		ClassBinder.load(container),
		ModelBinder.load(container),
		ServerBinder.load(container),
	];

	return Promise.all(binders);
}

(async (): Promise<void> => {
	try {
		await loadBinders();
	} catch (error: any) {
		console.error(`Error on binder ${error.binder}: `, error.message);
		process.exit(1);
	}
})();

export { container };
