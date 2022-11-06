import { Container } from 'inversify';

import { _Binder } from '.';
import { Binder } from '../../constants/binders';
import { BinderError } from '../../shared/errors/binderError';
import { VerifySessionMiddleware } from '../../middlewares/verifySession';

class MiddlewareBinder extends _Binder {
	public load(container: Container): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				container.bind(VerifySessionMiddleware).to(VerifySessionMiddleware);

				return Promise.resolve();
			} catch (error: any) {
				return reject(new BinderError(Binder.MIDDLEWARE, error.message));
			}
		});
	}
}

export default new MiddlewareBinder();
