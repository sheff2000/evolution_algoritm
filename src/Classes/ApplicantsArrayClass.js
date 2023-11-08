import { Applicant } from './ApplicantClass.js';

export class ApplicantsArray {
  constructor() {
    this.applicants = [];
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

  // ... Другие методы для работы с массивом претендентов
}
