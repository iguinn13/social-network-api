import mongoose from 'mongoose';
import { encryptPassword } from '../helpers/bcrypt';
import { getModelForClass, pre, prop } from '@typegoose/typegoose';

export interface IUserAddres {
	state: string;
	city: string;
	country: string;
}

export interface IHandleableUser {
	userId: string;
	profilePhoto: string;
	username: string;
}

@pre<User>('save', function () {
	this._id = new mongoose.Types.ObjectId();
	this.password = encryptPassword(this.password);
	this.profilePhoto = 'https://thepowerofthedream.org/wp-content/uploads/2015/09/generic-profile-picture.jpg';
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

	@prop({ required: false })
	public profilePhoto!: string;

	@prop({ required: true })
	public address!: IUserAddres;

	@prop({ required: false })
	public followers!: Array<IHandleableUser>;

	@prop({ required: false })
	public following!: Array<IHandleableUser>;
}

export const UserModel = getModelForClass(User);
