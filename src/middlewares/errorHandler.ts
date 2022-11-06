import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../constants/statusCode';

@injectable()
export class ErrorHandlerMiddleware {
	public handle(error: any, request: Request, response: Response, next: NextFunction): Response {
		return response.status(error.status ? error.status : StatusCode.INTERNAL_ERROR).json({ error: error.message });
	}
}
