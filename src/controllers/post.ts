import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPost } from 'inversify-express-utils';

import { StatusCode } from '../constants/statusCode';
import { VerifySessionMiddleware } from '../middlewares/verifySession';
import { PostService } from '../services/post';

@controller('/posts')
export class PostController {
	public constructor(@inject(PostService) private readonly postService: PostService) {}

	@httpPost('/', VerifySessionMiddleware)
	public async create(request: Request, response: Response): Promise<Response> {
		try {
			const { author, media, text } = request.body;

			await this.postService.post({ author, media, text });

			return response.status(StatusCode.CREATED).send();
		} catch (error: any) {
			return response
				.status(error.status ? error.status : StatusCode.INTERNAL_ERROR)
				.json({ error: error.message });
		}
	}
}
