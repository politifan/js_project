import 'dotenv/config';
import { createApp } from './app.js';

const port = Number.parseInt(process.env.PORT ?? '3002', 10);
const app = createApp();

app.listen(port, () => {
  console.log(`Auth Lab is running on http://localhost:${port}`);
});
