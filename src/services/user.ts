import { inject, injectable } from 'inversify';

import { IHandleableUser, User } from '../models/user';
import { StatusCode } from '../constants/statusCode';
import { UserRepository } from '../repositories/user';

import { generateToken } from '../helpers/token';
import { comparePassword } from '../helpers/bcrypt';

import { Payload } from '../shared/types/payload';
import { ResponseError } from '../shared/errors/responseError';

@injectable()
export class UserService {
	public constructor(@inject(UserRepository) private readonly userRepository: UserRepository) {}

	public async register({ username, email, password, address }: Payload): Promise<void> {
		if (!username || !email || !password || !address)
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Todos os dados devem ser preenchidos');

		const userAlreadyExists = await this.userRepository.findByEmail(email);

		if (userAlreadyExists) throw new ResponseError(StatusCode.BAD_REQUEST, 'Usuário já cadastrado');

		const user: Payload = {
			username,
			email,
			password,
			address,
		};

		await this.userRepository.create(user);
	}

	public async login({ email, password }: Payload): Promise<string> {
		if (!email || !password)
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Todos os dados devem ser preenchidos');

		const user = await this.userRepository.findByEmail(email);

		if (!user) throw new ResponseError(StatusCode.BAD_REQUEST, 'Usuário não cadastrado');
		if (!comparePassword(password, user.password))
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Senha incorreta');

		const token = generateToken({ ...user });

		return token;
	}

	public async follow({ targetId, userId }: Payload): Promise<void> {
		if (!targetId) throw new ResponseError(StatusCode.BAD_REQUEST, 'É necessário um alvo');

		if (targetId === userId) {
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Não é possível seguir você mesmo');
		}

		if (await this.verifyIfFollows(userId, targetId)) {
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Você já segue esse usuário');
		}

		const user = await this.userRepository.findById(userId);
		const target = await this.userRepository.findById(targetId);

		if (!target) {
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Alvo não encontrado');
		}

		const follower: IHandleableUser = {
			userId: user._id.toString(),
			profilePhoto: user.profilePhoto,
			username: user.username,
		};

		const following: IHandleableUser = {
			userId: target._id.toString(),
			profilePhoto: target.profilePhoto,
			username: target.username,
		};

		await this.userRepository.addFollower({ ...follower }, targetId);
		await this.userRepository.addFollowing({ ...following }, userId);
	}

	public async unfollow({ userId, targetId }: Payload): Promise<void> {
		if (!targetId) throw new ResponseError(StatusCode.BAD_REQUEST, 'É necessário um alvo');

		if (!(await this.verifyIfFollows(userId, targetId))) {
			throw new ResponseError(
				StatusCode.BAD_REQUEST,
				'Não é possível parar de seguir um usuário que você não segue'
			);
		}

		if (targetId === userId) {
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Não é possível parar de seguir você mesmo');
		}

		await this.userRepository.removeFollower(targetId, userId);
		await this.userRepository.removeFollowing(userId, targetId);
	}

	public async getUser(userId: string): Promise<User> {
		return this.userRepository.findById(userId);
	}

	public async listAll(): Promise<User[]> {
		return this.userRepository.findAll();
	}

	private async verifyIfFollows(userId: string, targetId: string): Promise<boolean> {
		const user = await this.userRepository.findById(userId);

		if (!user) return false;

		return user.following.some((user) => user.userId === targetId);
	}
}
