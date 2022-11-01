import { getModelForClass, pre, prop } from '@typegoose/typegoose';
import { encryptPassword } from '../helpers/bcrypt';

export interface IUserAddres {
	state: string;
	city: string;
	country: string;
}

@pre<User>('save', function () {
	this.password = encryptPassword(this.password);
})
export class User {
	@prop({ required: true })
	public username!: string;

	@prop({ required: true })
	public email!: string;

	@prop({ required: true })
	public password!: string;

	@prop({ required: true })
	public address!: IUserAddres;
}

export const UserModel = getModelForClass(User);
