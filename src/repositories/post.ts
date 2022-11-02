import { inject, injectable } from 'inversify';

import { PostModel } from '../models/post';
import { Payload } from '../shared/types/payload';

@injectable()
export class PostRepository {
	public constructor(@inject(PostModel) private readonly postModel: typeof PostModel) {}

	public async create({ author, media, text }: Payload): Promise<void> {
		await this.postModel.create({ author, media, text });
	}
}
