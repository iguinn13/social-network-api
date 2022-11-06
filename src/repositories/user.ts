import { inject, injectable } from 'inversify';

import { User, UserModel } from '../models/user';
import { Payload } from '../shared/types/payload';

@injectable()
export class UserRepository {
	public constructor(@inject(UserModel) private readonly userModel: typeof UserModel) {}

	public async create({ username, email, password, address }: Payload): Promise<void> {
		await this.userModel.create({ username, email, password, address });
	}

	public async findById(id: string): Promise<User> {
		return this.userModel.findOne({ _id: id }, { __v: 0 }).lean();
	}

	public async findByEmail(email: string): Promise<User> {
		return this.userModel.findOne({ email }, { __v: 0 }).lean();
	}

	public async findAll(): Promise<User[]> {
		return this.userModel.find({}, { __v: 0 }).lean();
	}

	public async addFollower(follower: Payload, userId: string): Promise<void> {
		await this.userModel.updateOne(
			{ _id: userId },
			{
				$push: {
					followers: { ...follower },
				},
			}
		);
	}

	public async addFollowing(following: Payload, userId: string): Promise<void> {
		await this.userModel.updateOne(
			{ _id: userId },
			{
				$push: {
					following: { ...following },
				},
			}
		);
	}

	public async removeFollower(targetId: string, userId: string): Promise<void> {
		await this.userModel.updateOne({ _id: targetId }, { $pull: { followers: { userId } } });
	}

	public async removeFollowing(userId: string, targetId: string): Promise<void> {
		await this.userModel.updateOne({ _id: userId }, { $pull: { following: { userId: targetId } } });
	}
}
