// глобальные параметры
import { ApplicantsArray } from './Classes/ApplicantsArrayClass.js';


export const params = {
    numberSkills: false,            // количество нужных скилов
    numberApplicants: false,        // количество претендентов
    exp_pers_items: false,
    shtraf: 1, // наш штраф
    mu: false, // количество родителей в поколении
    lam: false, // количество детей в поколенииы
    tMax: 3, // кличество поколений
    applicantsArray: false,// Инициализация массива претендентов
    P_cross: 0.9, // Вероятность кроссовера
    P_mut: 0.7, // Вероятность мутации
    P_inv: 0.1, // Вероятность инверсии
    mut_level_0: 5 
  };