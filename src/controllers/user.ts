import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPatch, httpPost, httpPut } from 'inversify-express-utils';
import { StatusCode } from '../constants/statusCode';
import { VerifySessionMiddleware } from '../middlewares/verifySession';
import { UserService } from '../services/user';

@controller('/users')
export class UserController {
	public constructor(@inject(UserService) private readonly userService: UserService) {}

	@httpPost('/')
	public async create(request: Request, response: Response): Promise<Response> {
		try {
			const { username, email, password, address } = request.body;

			await this.userService.register({ username, email, password, address });

			return response.status(StatusCode.CREATED).send();
		} catch (error: any) {
			return response
				.status(error.status ? error.status : StatusCode.INTERNAL_ERROR)
				.json({ error: error.message });
		}
	}

	@httpPost('/authenticate')
	public async authenticate(request: Request, response: Response): Promise<Response> {
		try {
			const { email, password } = request.body;

			const token = await this.userService.login({ email, password });

			return response.status(StatusCode.OK).json({ token });
		} catch (error: any) {
			return response
				.status(error.status ? error.status : StatusCode.INTERNAL_ERROR)
				.json({ error: error.message });
		}
	}

	@httpGet('/')
	public async getAll(request: Request, response: Response): Promise<Response> {
		try {
			const users = await this.userService.listAll();

			return response.status(StatusCode.OK).json({ users });
		} catch (error: any) {
			return response
				.status(error.status ? error.status : StatusCode.INTERNAL_ERROR)
				.json({ error: error.message });
		}
	}

	@httpPatch('/follow/:userId', VerifySessionMiddleware)
	public async follow(request: Request, response: Response): Promise<Response> {
		try {
			const { user_id: userId } = request.headers;
			const { userId: userToFollowId } = request.params;

			await this.userService.follow({ userId, userToFollowId });

			return response.status(StatusCode.OK).send();
		} catch (error: any) {
			return response
				.status(error.status ? error.status : StatusCode.INTERNAL_ERROR)
				.json({ error: error.message });
		}
	}

	@httpPatch('/unfollow/:userId', VerifySessionMiddleware)
	public async unfollow(request: Request, response: Response): Promise<Response> {
		try {
			const { user_id: userId } = request.headers;
			const { userId: userToUnfollowId } = request.params;

			await this.userService.unfollow({ userId, userToUnfollowId });

			return response.status(StatusCode.OK).send();
		} catch (error: any) {
			return response
				.status(error.status ? error.status : StatusCode.INTERNAL_ERROR)
				.json({ error: error.message });
		}
	}
}
