import { Binder } from '../../constants/binders';

export class BinderError extends Error {
	public binder: Binder;
	public message: string;

	public constructor(binder: Binder, message: string) {
		super(message);

		this.binder = binder;
		this.message = message;
	}
}
