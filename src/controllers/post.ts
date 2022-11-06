import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpDelete, httpPost } from 'inversify-express-utils';

import { PostService } from '../services/post';
import { StatusCode } from '../constants/statusCode';
import { VerifySessionMiddleware } from '../middlewares/verifySession';

@controller('/posts')
export class PostController {
	public constructor(@inject(PostService) private readonly postService: PostService) {}

	@httpPost('/', VerifySessionMiddleware)
	public async create(request: Request, response: Response): Promise<Response> {
		const { author, media, text } = request.body;

		await this.postService.post({ author, media, text });

		return response.status(StatusCode.CREATED).send();
	}

	@httpDelete('/:postId', VerifySessionMiddleware)
	public async delete(request: Request, response: Response): Promise<Response> {
		const { postId } = request.params;

		await this.postService.delete({ postId });

		return response.status(StatusCode.OK).send();
	}
}
