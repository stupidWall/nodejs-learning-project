import express from 'express';
import cors from 'cors';
import { findAvailablePort } from './shared/port';

import router from './router';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use('/api/v1', router);

findAvailablePort(app, Number(PORT))
    .then((port) => app.listen(port, () => console.log(`⚡️[server]: Server is running at https://localhost:${port}`)))
    .catch(err => console.error(err));
