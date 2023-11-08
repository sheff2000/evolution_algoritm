// загрузка файлов и данных
import fs from 'fs';
import readline from 'readline';
import { params } from '../params.js';

// Функция для обработки загруженного файла
export const processUpload = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = file.path;

  // Создаем поток для чтения файла
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let firstLine = true;
  
  let applicants = [];

  rl.on('line', (line) => {
    if (firstLine) {
      // Парсинг первой строки для получения общей информации
      [params.numberSkills, params.numberApplicants] = line.split(' ').map(Number);
      firstLine = false;
    } else {
      // Парсинг остальных строк для получения данных о претендентах
      const [salary, numSkills, ...skills] = line.split(' ').map(Number);

      params.applicantsArray.addApplicant(salary, numSkills, skills);
    }
  }).on('close', () => {
    // Теперь у нас есть все данные, можно обработать их
    console.log(params.numberSkills, params.numberApplicants);

    // Удаление временного файла
    

    //res.send('File has been processed.');
    const applicantsData = JSON.stringify(params.applicantsArray.getAllApplicants());

    fs.unlinkSync(filePath);

    //res.render('applicants', { applicantsData: applicantsData });
    res.json({ applicantsData: applicantsData });
  });
};

