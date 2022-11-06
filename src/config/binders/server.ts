import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { _Binder } from '.';
import { Server } from '../../infra/server';
import { Binder } from '../../constants/binders';
import { BinderError } from '../../shared/errors/binderError';

export class ServerBinder extends _Binder {
	public load(container: Container): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				container.bind(Server).to(Server).inSingletonScope();
				container.bind(InversifyExpressServer).toConstantValue(new InversifyExpressServer(container));

				return Promise.resolve();
			} catch (error: any) {
				return reject(new BinderError(Binder.SERVER, error.message));
			}
		});
	}
}

export default new ServerBinder();
