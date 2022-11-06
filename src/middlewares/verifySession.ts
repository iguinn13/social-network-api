import { ParsedQs } from 'qs';
import { BaseMiddleware } from 'inversify-express-utils';
import { NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { verifyToken } from '../helpers/token';
import { container } from '../config/container';
import { StatusCode } from '../constants/statusCode';
import { UserRepository } from '../repositories/user';
import { ResponseError } from '../shared/errors/responseError';

export class VerifySessionMiddleware extends BaseMiddleware {
	public async handler(
		request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
		response: Response<any, Record<string, any>>,
		next: NextFunction
	): Promise<Response | void> {
		try {
			const { token, user_id } = request.headers;

			if (!token || !user_id) throw new ResponseError(StatusCode.FORBIDDEN, '');

			const providedUser = verifyToken(token as string);

			if (!providedUser) throw new ResponseError(StatusCode.UNAUTHORIZED, '');

			const user = await container
				.get(UserRepository)
				.findByEmail((providedUser as { [key: string]: any }).email);

			if (!user) throw new ResponseError(StatusCode.FORBIDDEN, '');

			return next();
		} catch (error: any) {
			return response
				.status(error.status ? error.status : StatusCode.INTERNAL_ERROR)
				.json({ error: error.message });
		}
	}
}
