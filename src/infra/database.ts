import mongoose from 'mongoose';

export function connectDatabase(): Promise<unknown> {
	return new Promise((resolve, reject) => {
		mongoose.connect(
			`mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
		);

		mongoose.connection.on('connected', () => {
			console.log('MongoDB connected successfully!');
			resolve(true);
		});

		mongoose.connection.on('error', (error) => {
			console.log('MongoDB connection failed: ', error);
			reject(error);
		});
	});
}
