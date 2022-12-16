import { Express } from 'express';

export const findAvailablePort = (app: Express, port: number) => {
    return new Promise((resolve, reject) => {
        const server = app
            .listen(port, () => {
                server.close();
                resolve(port);
            })
            .on('error', (err: Error) => {
                if ((err as Error & { code: string }).code === 'EADDRINUSE') {
                    findAvailablePort(app, port + 1)
                        .then(resolve)
                        .catch(reject);
                } else {
                    reject(err);
                }
            });
    });
};
