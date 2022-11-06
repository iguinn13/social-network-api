import mongoose from 'mongoose';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';

@pre<Post>('save', function () {
	this._id = new mongoose.Types.ObjectId();
	this.comments = [];
	this.createdAt = new Date();
	this.likes = [];
	this.text = '';
	this.media = '';
})
export class Post {
	@prop({ required: false })
	public _id!: mongoose.Types.ObjectId;

	@prop({ required: true })
	public author!: string;

	@prop({ required: false })
	public createdAt!: Date;

	@prop({ required: false })
	public comments!: string[];

	@prop({ required: false })
	public likes!: Array<{
		userId: string;
		username: string;
		profilePhoto: string;
	}>;

	@prop({ required: false })
	public media!: string;

	@prop({ required: false })
	public text!: string;
}

export const PostModel = getModelForClass(Post);
