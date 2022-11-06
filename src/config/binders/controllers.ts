import path from 'path';

import { _Binder } from '.';
import { Binder } from '../../constants/binders';
import { loadModules } from '../../helpers/loadModules';
import { BinderError } from '../../shared/errors/binderError';

class ControllerBinder extends _Binder {
	public load(): Promise<boolean> {
		return new Promise(async (resolve, reject) => {
			try {
				await loadModules(path.resolve('./dist/controllers'));

				resolve(true);
			} catch (error: any) {
				reject(new BinderError(Binder.CONTROLLER, error.message));
			}
		});
	}
}

export default new ControllerBinder();
