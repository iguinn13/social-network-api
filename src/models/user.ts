import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { encryptPassword } from '../helpers/bcrypt';

export interface IUserAddres {
	state: string;
	city: string;
	country: string;
}

@pre<User>('save', function () {
	this._id = new mongoose.Types.ObjectId();
	this.password = encryptPassword(this.password);
	this.followers = [];
	this.following = [];
})
export class User {
	@prop({ required: false })
	public _id!: mongoose.Types.ObjectId;

	@prop({ required: true })
	public username!: string;

	@prop({ required: true })
	public email!: string;

	@prop({ required: true })
	public password!: string;

	@prop({ required: true })
	public address!: IUserAddres;

	@prop({ required: false })
	public followers!: string[];

	@prop({ required: false })
	public following!: string[];
}

export const UserModel = getModelForClass(User);
