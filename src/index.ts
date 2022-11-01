import * as dotenv from 'dotenv';
dotenv.config();

import { container } from './config/container';

import { Server } from './infra/server';
import { connectDatabase } from './infra/database';

connectDatabase()
	.then(() => {
		container.get(Server).listen();
	})
	.catch((error) => {
		console.error(error.message);
		process.exit(1);
	});
