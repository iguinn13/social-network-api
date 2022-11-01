import bcrypt from 'bcrypt';

export function encryptPassword(password: string, salt = 10): string {
	return bcrypt.hashSync(password, salt);
}

export function comparePassword(password: string, passwordToCompare: string): boolean {
	return bcrypt.compareSync(password, passwordToCompare);
}
