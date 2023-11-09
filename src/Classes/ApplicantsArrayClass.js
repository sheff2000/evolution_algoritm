import { Applicant } from './ApplicantClass.js';
import { params } from '../params.js';

export class ApplicantsArray {
  constructor() {
    this.applicants = [];
    this._initArray();
  }

  _initArray(){
    this.salary = [];  //массив всех зарплат
    this.matrixSkills = []   // матрица претендент х умение (0 или 1)
  } 

  // Добавление претендента в массив
  addApplicant(salary, numberSkills, skills) {
    const newApplicant = new Applicant(salary, numberSkills, skills);
    this.applicants.push(newApplicant);
  }

  getAllApplicants(){
    return this.applicants;
  }

  // Метод для получения всех претендентов с определенным навыком
  getApplicantsWithSkill(skill) {
    return this.applicants.filter(applicant => applicant.skills.includes(skill));
  }

  // метод формирования основных матриц и массивов
  generateMainArray(){
    this._initArray();
    console.log('Start ganerate array ...');
    // проходим в цыкле всех претендентов
    for (let index = 0; index < this.applicants.length; index++) {
       
        this.salary[index] = this.applicants[index].salary;
        //console.log('index = ', index, 'Salar[index] = ', this.salary[index]);
        // проходим все скили
        //console.log('number Skills = ', params.numberSkills);
        //let skillsRow = new Array(params.numberSkills).fill(0); // Инициализируем массив нулями

        const skillsRow = Array.from({ length: params.numberSkills }, (v, i) => {
            if (this.applicants[index].skills.includes(i+1)) {
                return 1; // Если навык есть, ставим 1
            } else {
                return 0;
            }
        });

        //console.log('skills row = ', skillsRow);
        //for (let n = 0; n < params.numberSkills; n++) {
        //    if (this.applicants[index].skills.includes(n+1)) {
        //        skillsRow[n] = 1; // Если навык есть, ставим 1
        //    }
        //}
        this.matrixSkills[index] = skillsRow;
    }

    //console.log(this.matrixSkills);
    //console.log('Salary', this.salary);
    console.log('Salary - ', this.salary.length);
    console.log('Matrix rows - ', this.matrixSkills.length);
    console.log('Number Skills - ', params.numberSkills);
    console.log('Number Applicants - ', params.numberApplicants);
  }

  // ... Другие методы для работы с массивом претендентов
}
