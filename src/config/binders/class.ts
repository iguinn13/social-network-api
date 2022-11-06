import { Container } from 'inversify';

import { _Binder } from '.';
import { Binder } from '../../constants/binders';
import { BinderError } from '../../shared/errors/binderError';

import { PostService } from '../../services/post';
import { UserService } from '../../services/user';

import { PostRepository } from '../../repositories/post';
import { UserRepository } from '../../repositories/user';

class ClassBinder extends _Binder {
	public load(container: Container): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				container.bind(UserService).to(UserService).inSingletonScope();
				container.bind(PostService).to(PostService).inSingletonScope();

				container.bind(PostRepository).to(PostRepository).inSingletonScope();
				container.bind(UserRepository).to(UserRepository).inSingletonScope();

				return Promise.resolve();
			} catch (error: any) {
				return reject(new BinderError(Binder.CLASS, error.message));
			}
		});
	}
}

export default new ClassBinder();
