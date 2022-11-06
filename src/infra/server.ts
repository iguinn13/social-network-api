import { inject, injectable } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import express, { NextFunction, Request, Response } from 'express';

import { ErrorHandlerMiddleware } from '../middlewares/errorHandler';

@injectable()
export class Server {
	private port: string;

	public constructor(
		@inject(InversifyExpressServer) private readonly inversifyExpressServer: InversifyExpressServer,
		@inject(ErrorHandlerMiddleware) private readonly errorHandlerMiddleware: ErrorHandlerMiddleware
	) {
		this.setUpMiddlewares();

		this.port = process.env.HTTP_PORT as string;
	}

	private setUpMiddlewares(): void {
		this.inversifyExpressServer.setConfig((app) => {
			app.use(express.json());
		});

		this.inversifyExpressServer.setErrorConfig((app) => {
			app.use((error: any, request: Request, response: Response, next: NextFunction) => {
				this.errorHandlerMiddleware.handle(error, request, response, next);
			});
		});
	}

	public listen(): void {
		const serverInstance = this.inversifyExpressServer.build();

		serverInstance.listen(this.port, () => console.log(`Server is running at port ${this.port}...`));
	}
}
