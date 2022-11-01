import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { _Binder } from '.';
import { Binder } from '../../constants/binders';
import { Server } from '../../infra/server';
import { BinderError } from '../../shared/errors/binderError';

export class ServerBinder extends _Binder {
	public load(container: Container): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				container
					.bind(InversifyExpressServer)
					.toConstantValue(new InversifyExpressServer(container));
				container.bind(Server).to(Server).inSingletonScope();

				return resolve(true);
			} catch (error: any) {
				return reject(new BinderError(Binder.SERVER, error.message));
			}
		});
	}
}

export default new ServerBinder();
