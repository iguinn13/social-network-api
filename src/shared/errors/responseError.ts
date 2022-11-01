import { StatusCode } from '../../constants/statusCode';

export class ResponseError extends Error {
	public status: StatusCode;
	public message: string;

	public constructor(status: StatusCode, message: string) {
		super(message);

		this.status = status;
		this.message = message;
	}
}
