import express from 'express';
import { findAvailablePort } from './shared/port';

import router from './router';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/api/v1', router);

findAvailablePort(app, Number(PORT))
    .then((port) => {
        port !== PORT &&
      console.log(
          `Port ${PORT} is in use by another process. choosed ${port} port and start the server now.`
      );
        app.listen(port, () =>
            console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
        );
    })
    .catch((err) => console.error(err));
