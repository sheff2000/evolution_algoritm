// глобальные параметры
import { ApplicantsArray } from './Classes/ApplicantsArrayClass.js';


export const params = {
    numberSkills: false,            // количество нужных скилов
    numberApplicants: false,        // количество претендентов
    applicantsArray: new ApplicantsArray() // Инициализация массива претендентов
  };