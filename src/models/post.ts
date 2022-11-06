import mongoose from 'mongoose';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';

import { IHandleableUser } from './user';

export interface IComment {
	author: IHandleableUser;
	text: string;
	media: string;
	likes: Array<IHandleableUser>;
	createdAt: Date;
}

@pre<Post>('save', function () {
	this._id = new mongoose.Types.ObjectId();
	this.likes = [];
	this.comments = [];
	this.text = '';
	this.media = '';
	this.createdAt = new Date();
})
export class Post {
	@prop({ required: false })
	public _id!: mongoose.Types.ObjectId;

	@prop({ required: true })
	public author!: string;

	@prop({ required: false })
	public createdAt!: Date;

	@prop({ required: false })
	public comments!: Array<IComment>;

	@prop({ required: false })
	public likes!: Array<IHandleableUser>;

	@prop({ required: false })
	public media!: string;

	@prop({ required: false })
	public text!: string;
}

export const PostModel = getModelForClass(Post);
