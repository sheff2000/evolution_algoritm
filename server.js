import express from 'express';
const app = express();
const port = 3000;


app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/calculate', (req, res) => {
    // Обработка данных и отправка ответа
  });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
