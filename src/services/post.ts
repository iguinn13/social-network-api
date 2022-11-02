import { inject, injectable } from 'inversify';

import { StatusCode } from '../constants/statusCode';
import { PostRepository } from '../repositories/post';

import { ResponseError } from '../shared/errors/responseError';
import { Payload } from '../shared/types/payload';

@injectable()
export class PostService {
	public constructor(@inject(PostRepository) private readonly postRepository: PostRepository) {}

	public async post({ author, media, text }: Payload): Promise<void> {
		if (!author) throw new ResponseError(StatusCode.BAD_REQUEST, 'É necessário um autor');

		const post = {
			author,
			media,
			text,
		};

		await this.postRepository.create({ ...post });
	}

	public async delete({ postId }: Payload): Promise<void> {
		await this.postRepository.deleteOne(postId);
	}
}
