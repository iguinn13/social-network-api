import { _Binder } from '.';
import { Binder } from '../../constants/binders';
import { BinderError } from '../../shared/errors/binderError';

class ControllerBinder extends _Binder {
	public load(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				require('../../controllers/user');

				resolve(true);
			} catch (error: any) {
				reject(new BinderError(Binder.CONTROLLER, error.message));
			}
		});
	}
}

export default new ControllerBinder();
