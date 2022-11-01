import { Container } from 'inversify';

import { _Binder } from '.';

import { Binder } from '../../constants/binders';
import { UserModel } from '../../models/user';
import { BinderError } from '../../shared/errors/binderError';

class ModelBinder extends _Binder {
	public load(container: Container): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				container.bind(UserModel).toConstantValue(UserModel);

				return resolve(true);
			} catch (error: any) {
				return reject(new BinderError(Binder.MODEL, error.message));
			}
		});
	}
}

export default new ModelBinder();
