import express from 'express';
import { router as uploadRouter } from './src/routes/uploadRoute.js';
import { router as algoritmRouter } from './src/routes/algoritmRoute.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3005;



app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/upload', uploadRouter);
app.use('/start-algoritm',algoritmRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/upload.html');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
