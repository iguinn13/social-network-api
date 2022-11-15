import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPatch, httpPost, httpPut } from 'inversify-express-utils';

import { UserService } from '../services/user';
import { StatusCode } from '../constants/statusCode';
import { VerifySessionMiddleware } from '../middlewares/verifySession';

@controller('/users')
export class UserController {
    public constructor(@inject(UserService) private readonly userService: UserService) {}

    @httpPost('/')
    public async create(request: Request, response: Response): Promise<Response> {
        const { username, email, password, address } = request.body;

        await this.userService.register({ username, email, password, address });

        return response.status(StatusCode.CREATED).send();
    }

    @httpPut('/', VerifySessionMiddleware)
    public async updateInfo(request: Request, response: Response): Promise<Response> {
        const { username, profilePhoto, bio, address } = request.body;
        const { user_id: userId } = request.headers;

        await this.userService.updateProfileInfo({ userId, username, profilePhoto, bio, address });

        return response.status(StatusCode.OK).send();
    }

    @httpGet('/:userId', VerifySessionMiddleware)
    public async getById(request: Request, response: Response): Promise<Response> {
        const { userId } = request.params;

        const user = await this.userService.getUser(userId);

        return response.status(StatusCode.OK).json({ user });
    }

    @httpDelete('/', VerifySessionMiddleware)
    public async delete(request: Request, response: Response): Promise<Response> {
        const { user_id: userId } = request.headers;

        await this.userService.desactivateAccount({ userId });

        return response.status(StatusCode.OK).send();
    }

    @httpPost('/authenticate')
    public async authenticate(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const token = await this.userService.login({ email, password });

        return response.status(StatusCode.OK).json({ token });
    }

    @httpPost('/block/:targetId')
    public async blockUser(request: Request, response: Response): Promise<Response> {
        const { targetId } = request.params;
        const { user_id: userId } = request.headers;

        await this.userService.addUserToBlacklist({ userId, targetId });

        return response.status(StatusCode.OK).send();
    }

    @httpPost('/unblock/:targetId')
    public async unblockUser(request: Request, response: Response): Promise<Response> {
        const { targetId } = request.params;
        const { user_id: userId } = request.headers;

        await this.userService.removeUserFromBlacklist({ userId, targetId });

        return response.status(StatusCode.OK).send();
    }

    @httpPatch('/follow/:targetId', VerifySessionMiddleware)
    public async follow(request: Request, response: Response): Promise<Response> {
        const { targetId } = request.params;
        const { user_id: userId } = request.headers;

        await this.userService.follow({ targetId, userId });

        return response.status(StatusCode.OK).send();
    }

    @httpPatch('/unfollow/:targetId', VerifySessionMiddleware)
    public async unfollow(request: Request, response: Response): Promise<Response> {
        const { targetId } = request.params;
        const { user_id: userId } = request.headers;

        await this.userService.unfollow({ userId, targetId });

        return response.status(StatusCode.OK).send();
    }
}
