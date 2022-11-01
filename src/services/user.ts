import { inject, injectable } from 'inversify';
import { StatusCode } from '../constants/statusCode';
import { User } from '../models/user';
import { UserRepository } from '../repositories/user';
import { ResponseError } from '../shared/errors/responseError';
import { Payload } from '../shared/types/payload';

@injectable()
export class UserService {
	public constructor(@inject(UserRepository) private readonly userRepository: UserRepository) {}

	public async register({ username, email, password, address }: Payload): Promise<void> {
		if (!username || !email || !password || !address)
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Todos os dados devem ser preenchidos');

		const userAlreadyExists = await this.userRepository.findByEmail(email);

		if (userAlreadyExists)
			throw new ResponseError(StatusCode.BAD_REQUEST, 'Usuário já cadastrado');

		const user: Payload = {
			username,
			email,
			password,
			address,
		};

		await this.userRepository.create(user);
	}

	public async listAll(): Promise<User[]> {
		return this.userRepository.findAll();
	}
}
