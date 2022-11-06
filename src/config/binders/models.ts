import { Container } from 'inversify';

import { _Binder } from '.';
import { Binder } from '../../constants/binders';
import { BinderError } from '../../shared/errors/binderError';

import { PostModel } from '../../models/post';
import { UserModel } from '../../models/user';

class ModelBinder extends _Binder {
	public load(container: Container): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				container.bind(UserModel).toConstantValue(UserModel);
				container.bind(PostModel).toConstantValue(PostModel);

				return Promise.resolve();
			} catch (error: any) {
				return reject(new BinderError(Binder.MODEL, error.message));
			}
		});
	}
}

export default new ModelBinder();
