import { Container } from 'inversify';

import { _Binder } from '.';
import { Binder } from '../../constants/binders';
import { UserRepository } from '../../repositories/user';
import { UserService } from '../../services/user';

import { BinderError } from '../../shared/errors/binderError';

class ClassBinder extends _Binder {
	public load(container: Container): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				container.bind(UserService).to(UserService).inSingletonScope();
				container.bind(UserRepository).to(UserRepository).inSingletonScope();

				return resolve(true);
			} catch (error: any) {
				return reject(new BinderError(Binder.CLASS, error.message));
			}
		});
	}
}

export default new ClassBinder();
