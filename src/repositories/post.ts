import { inject, injectable } from 'inversify';

import { Post, PostModel } from '../models/post';
import { Payload } from '../shared/types/payload';

@injectable()
export class PostRepository {
	public constructor(@inject(PostModel) private readonly postModel: typeof PostModel) {}

	public async create({ author, media, text }: Payload): Promise<void> {
		await this.postModel.create({ author, media, text });
	}

	public async deleteOne(postId: string): Promise<void> {
		await this.postModel.deleteOne({ _id: postId });
	}

	public async findOneById(postId: string): Promise<Post> {
		return this.postModel.findById({ _id: postId }, { __v: 0 }).lean();
	}

	public async addComment({ postId, author, media, text, likes, createdAt }: Payload): Promise<void> {
		await this.postModel.updateOne(
			{ _id: postId },
			{
				$push: {
					comments: {
						author: { ...author },
						media,
						text,
						likes,
						createdAt,
					},
				},
			}
		);
	}
}
