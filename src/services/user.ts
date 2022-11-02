import { inject, injectable } from 'inversify';

import { User } from '../models/user';
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

		const userAlreadyExists = await this.getByEmail(email);

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

		const user = await this.getByEmail(email);

		if (!user) throw new ResponseError(StatusCode.BAD_REQUEST, 'Usuário não cadastrado');
		if (!comparePassword(password, user.password))
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Senha incorreta');

		const token = generateToken({ ...user });

		return token;
	}

	public async follow({ userToFollowId, userId }: Payload): Promise<void> {
		if (!userToFollowId) throw new ResponseError(StatusCode.BAD_REQUEST, 'É necessário um alvo');

		if (await this.verifyIfFollows(userToFollowId, userId)) {
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Você já segue esse usuário');
		}

		if (userToFollowId === userId)
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Não é possível seguir você mesmo');

		await this.userRepository.addFollower(userToFollowId, userId);
	}

	public async unfollow({ userToUnfollowId, userId }: Payload): Promise<void> {
		if (!userToUnfollowId) throw new ResponseError(StatusCode.BAD_REQUEST, 'É necessário um alvo');

		if (!(await this.verifyIfFollows(userToUnfollowId, userId))) {
			throw new ResponseError(
				StatusCode.BAD_REQUEST,
				'Não é possível parar de seguir um usuário que você não segue'
			);
		}

		if (userToUnfollowId === userId) {
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Não é possível parar de seguir você mesmo');
		}

		await this.userRepository.removeFollower(userToUnfollowId, userId);
	}

	public async getUser(userId: string): Promise<User> {
		const user = await this.userRepository.findById(userId);

		if (!user) throw new ResponseError(StatusCode.BAD_REQUEST, '');

		return user;
	}

	private async verifyIfFollows(targetId: string, userId: string): Promise<boolean> {
		const target = await this.userRepository.findById(targetId);

		if (!target) throw new ResponseError(StatusCode.BAD_REQUEST, '');

		return (target.followers || []).some((follower) => follower.toString() === userId);
	}

	private async getByEmail(email: string): Promise<User> {
		return this.userRepository.findByEmail(email);
	}

	public async listAll(): Promise<User[]> {
		return this.userRepository.findAll();
	}
}
