import express from 'express';
import cors from 'cors';

import router from './router';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use('/api/v1', router);

app.listen(PORT, () => console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`));
