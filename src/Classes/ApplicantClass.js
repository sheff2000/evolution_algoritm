// пернтендент
import calculateFitness from "./fitnessFunction.js";  // подсчет фитнеса

export class Applicant {
    constructor(salary, numberSkills, skills) {
      this.salary = salary;     // желаемая зарплата
      this.skills = skills;     // массив навыков с их номерами
      this.numberSkills = numberSkills; // количество навыков
    }
  
    // Метод для подсчета фитнеса
    fitness(requiredSkills) {
      // Логика подсчета фитнеса
      //const fitness = calculateFitness(this.)
      return this.skills.filter(skill => requiredSkills.includes(skill)).length;
    }
  }
  