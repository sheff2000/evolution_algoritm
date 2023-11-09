// поисковый агент

export class Agent {
    constructor(exp_pers_items, numberApplicants) {
        this.exp_pers_items = exp_pers_items;
        this.numberApplicants   = numberApplicants;
       
    }
  
    // поисковый агент - должен уметь создаватся
    createAgent(){

        const newAgent = []; // Создаем новый вектор для агента

        for (let i = 0; i < this.numberApplicants; i++) {
            if (Math.random() < this.exp_pers_items) {
                newAgent.push(1);
            } else {
                newAgent.push(0);
            }
        }
        console.log(newAgent);
        return newAgent;
    }
  }
  