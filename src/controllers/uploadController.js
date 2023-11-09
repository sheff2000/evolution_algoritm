// загрузка файлов и данных
import fs from 'fs';
import readline from 'readline';
import { params } from '../params.js';
import { ApplicantsArray } from '../Classes/ApplicantsArrayClass.js';

// Функция для обработки загруженного файла
export const processUpload = (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).send('No file uploaded.');
  }

  // другие параметры
  const fields  = req.body;
  console.log('Load data - analyze form | fields = ', fields);
  params.tMax   = fields.tMax;
  params.mu     = fields.mu;
  params.lam    = fields.lam;
  params.mut_level_0    = fields.mut_level_0;
  params.P_cross = fields.P_cross;
  params.shtraf = fields.shtraf;


  // парсим файл
  const filePath = file.path;

  // Создаем поток для чтения файла
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let firstLine = true;
  
  let applicants = [];
  //создали экземплар претендентов с их навыками
  params.applicantsArray = new ApplicantsArray();

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

    //res.send('File has been processed.');
    //const applicantsData = JSON.stringify(params.applicantsArray.getAllApplicants());
    const applicantsData = params.applicantsArray.getAllApplicants();

    // Удаление временного файла
    fs.unlinkSync(filePath);

    // генерация основных массивов 
    params.applicantsArray.generateMainArray();


    params.exp_pers_items = params.numberSkills / params.numberApplicants;

    //res.render('applicants', { applicantsData: applicantsData });
    const toReturn = {
        applicantsData: applicantsData,
        salaryArray:params.applicantsArray.salary,
        matrix:params.applicantsArray.matrixSkills,
        numberSkills: params.numberSkills,
        numberApplicants: params.numberApplicants
    }
    res.json(toReturn);
  });
};