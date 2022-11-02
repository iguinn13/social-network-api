import express from 'express';

import { inject, injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

@injectable()
export class Server {
	private port: string;

	public constructor(
		@inject(InversifyExpressServer)
		private readonly inversifyExpressServer: InversifyExpressServer
	) {
		this.setUpMiddlewares();

		this.port = process.env.HTTP_PORT as string;
	}

	private setUpMiddlewares(): void {
		this.inversifyExpressServer.setConfig((app) => {
			app.use(express.json());
		});
	}

	public listen(): void {
		const serverInstance = this.inversifyExpressServer.build();
		serverInstance.listen(this.port, () => console.log(`Server is running at port ${this.port}...`));
	}
}
