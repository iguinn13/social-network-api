import fs from 'fs';

export function loadModules(path: string): Promise<void> {
	return new Promise(() => {
		fs.readdir(path, (error, files) => {
			if (error) return;

			for (const file of files) require(`${path}/${file}`);
		});

		Promise.resolve();
	});
}
