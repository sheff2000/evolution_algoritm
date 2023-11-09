// поиск решения
import { params } from "../params.js";

export class Algoritm {
    constructor() {
        this.agents = [];  //наши поисковые агенты
        /*agents = [{
            vector:[],  // геном агента
            fitmess: 0, // значение фитнеса
            p_det:0     // вероятность наследника
        }];*/
        
        this.best = []; // лучший результат для каждого поколения
    }
  
    // Метод для подсчета фитнеса
    fitness(vector, C = params.applicantsArray.salary, A = params.applicantsArray.matrixSkills) {
        let fitness = 0;
        let owerstack = new Array(params.numberSkills).fill(0); // переработка
        // обход массива зарплат
        C.forEach((salar, j) => {
            // передаем сюда одного поискового агента
            // смотрим текущий скилл у него 0 или 1
            if (vector[j] > 0) {
                // если 1 - то увеличиваем значение фитнеса + салар
                fitness = fitness + salar;
                // и проходим в цыкле по всем скиллам
                for (let k = 0; k < params.numberSkills; k++) {
                    // если в матрице скил претендента  == 1
                        // оверстак[номер скилла] = +1
                    if (A[j][k] == 1) {
                        owerstack[k] += 1;
                    }
                }
            }
            
        });

        let owerjob = 0;
        // цикл от 0 до количества скилов
        for (let k = 0; k < params.numberSkills; k++) {
            owerjob = owerjob + Math.abs(owerstack[k] - 1);
                
        }
        fitness = fitness + params.shtraf * owerjob;
        return fitness; 
    } 
 

    generateFirst(){ 
        this.agents = [];
        //console.log('IN generateFirst. exp_pers_items - ', params.exp_pers_items, ' | mu - ', params.mu);
        
        for (let j = 0; j < params.mu; j++) {
            // формируем геном
            let vector = [];
            for (let i = 0; i < params.numberApplicants; i++) {
                if (Math.random() < params.exp_pers_items) {
                    vector.push(1);
                } else {
                    vector.push(0);
                }
            }

            const newAgent = {
                vector: vector,  // геном агента
                fitness: 0, // значение фитнеса
                p_det:0     // вероятность наследника
            };
            this.agents.push(newAgent); // Добавляем нового агента в массив
        }
    }

    //функция выбирает пару особей с максимальным расстоянием Хэмминга.
    outbreedingSelector(population = this.agents) {
        let maxDistance = 0;
        let pair = [];
       
        for (let i = 0; i < population.length; i++) {
          for (let j = i + 1; j < population.length; j++) {
            let distance = this._hammingDistance(population[i].vector, population[j].vector);
            if (distance > maxDistance) {
              maxDistance = distance;
             
              pair = [this.agents[i], this.agents[j]];
            }
          }
        }
        
        return pair;
      }
    
    uniformCrossover(parent1, parent2, P_cross) {
        let child1 = {
            vector: [],  
            fitness: 0, 
            p_det:0    
        };
        let child2 = {
            vector: [],  
            fitness: 0, 
            p_det:0   
        };
      
        if (Math.random() < P_cross) {

            let b_point = Math.floor(Math.random() * (params.mu + 1));

            for (let i = 0; i < parent1.vector.length; i++) {
                if (i < b_point) {
                child1.vector.push(parent1.vector[i]);
                child2.vector.push(parent2.vector[i]);
                } else {
                child1.vector.push(parent2.vector[i]);
                child2.vector.push(parent1.vector[i]);
                }
            }
        } else {
          // Если кроссовер не происходит, дети идентичны родителям
          child1.vector = [...parent1.vector];
          child2.vector = [...parent2.vector];
        }
        return [child1, child2];
    }

    // Шаг 6: Выбор одного ребенка с вероятностью 0.5
    selectChild(children) {
        return Math.random() < 0.5 ? children[0] : children[1];
    }
    
    // Шаг 7: Оператор мутации
    mutate(individual, P_mut) {
        for (let i = 0; i < individual.vector.length; i++) {
        if (Math.random() < P_mut) {
            // Пример мутации: инвертировать значение гена
            individual.vector[i] = 1 - individual.vector[i];
        }
        }
        return individual;
    }

    mutateFromPy(children, P_mut, mut_level) {

        let Y = [];
        children.forEach((child, j)=>{
            let d = [...child.vector];
            if (Math.random() < P_mut) {
                for (let i = 0; i < mut_level; i++) {
                    let num_mut = Math.floor(Math.random() * d.length);
                    d = [...d]; // Создаем новую копию массива перед мутацией
                    d[num_mut] = 1 - d[num_mut];
                }
            }
            const mut_child = {
                vector: d,
                fitness:0,
                p_det:0
            }
            Y.push(mut_child);
            
        });
        
        return Y;
    }
    
    // Шаг 8: Оператор инверсии
    invert(individual, P_inv) {
        //console.log('IN INVERT, individual - ', individual);
        if (Math.random() < P_inv) {
            //console.log('YES its INVERT');
            individual.vector.reverse()
            return individual;
        }
        return individual;
    }

    new_population(population, child){
        //console.log('new population CHILD', child);
        child.fitness = this.fitness(child.vector);

        let new_population = population;
        new_population.push(child);
        new_population.sort((a, b) => a.fitness - b.fitness);
        new_population.pop();

        return new_population;
    }

    new_populationFromPy(population, children){
        const originalLength = population.length;
        children.forEach((child, index) => {
            children[index].fitness = this.fitness(child.vector);
        });
       
        //let new_population = population.concat.children;
        let new_population = [...population, ...children];
        
        new_population.sort((a, b) => a.fitness - b.fitness);
        //console.log('Pupolation + children', new_population);
        
        return new_population.slice(0, originalLength);
    }

    start() {
        const P_mut_max = 0.95;
        const P_mut_min = 0.4;
        let mut_level;
        /*
        Крок 1. Ініціалізація початкового моменту часу t = 0. */
       
        /*
        Крок 2. Випадковим чином сформувати початкову популяцію, що
        складається з k індивідів. A = A , A ,..., A . 12k */
        this.generateFirst();
        for (let nowT = 0; nowT < params.tMax; nowT++) {
            mut_level = Math.ceil(params.mut_level_0 * (params.tMax - nowT + 1) / params.tMax);
            params.P_mut = P_mut_min+(P_mut_max-P_mut_min)*nowT/params.tMax;

            console.log('nowT = ', nowT);
            //console.log('Number population - ', this.agents);
                /*
            Крок 3. Обчислити пристосованість кожного індивіда F = fit(A ), i =1,k Ai i
            та популяції в цілому FA = fit(A), де fit(A) - фітнес-функція (fitness-function). Значення цієї функції вказує на те, 
            наскільки оптимальним є індивід, що
            описується даною хромосомою, для розв'язання задачі. */
            //console.log('Now population - ', this.agents);
            this.agents.forEach((agent, index) => {
                this.agents[index].fitness = this.fitness(agent.vector);
            });
            // сортировка
            this.agents.sort((a, b) => a.fitness - b.fitness);
            //console.log('First population - ', this.agents);
            // первый бэст
            this.best.push(this.agents[0].fitness);
            //console.log('BEST - ', this.best);
            // селекция
            // выбрали 2х особей с максимальным растоянием по геномам
            const selectedPair = this.outbreedingSelector();
            //console.log('Select PAIR', selectedPair);
            const children = this.uniformCrossover(selectedPair[0], selectedPair[1], params.P_cross);
            //console.log('CHILDREN - ', children);
  
            const Y = this.mutateFromPy(children, params.P_mut, mut_level);
            
//            let child = this.selectChild(children);
//            //console.log('CHILD select ONE - ', child);
//            child = this.mutate(child, params.P_mut);
//            //console.log('CHILD MUTATE ONE - ', child);
//            child = this.invert(child, params.P_inv);
//            child.fitness = this.fitness(child.vector);


            //console.log('child after  = ', Y);
            /*
            Крок 4. За певним принципом обрати індивіда parrent1 з популяції
            parrent1  A.
            Крок 5. За тим самим принципом обрати другого індивіда з популяції parrent 2  A та з певною, наперед заданою ймовірністю (ймовірністю кросоверу
            P ) виконати оператор (child ,child )=Cross(Parrent ,Parrent ) кросоверу. cros 1212
            Крок 6. 3 ймовірністю 0,5 з (child1,child2 ) відібрати одного індивіда B=childi.
            inv
            ) виконати оператор інверсії B = Invers(B).
            


            Крок 9. Помістити отриману хромосому в популяцію A = A  B .
            Крок 10. Оцінити пристосованість нового індивіда у порівняні з іншими
            індивідами. Вилучити з популяції найгірш пристосовану особину A = A | Aworst .*/
//            this.agents = this.new_population(this.agents, child);
            this.agents = this.new_populationFromPy(this.agents, Y);

            /*
            Крок 11. Збільшити номер поточної епохи t = t +1.
            Крок 12. Якщо виконується умова зупинки (гранична кількість епох, 
                збіжність популяції, граничне значення часу роботи алгоритму), 
                то завершити роботу, інакше перейти на крок 3. [2]
            */
            
        }

        return this.agents[0].vector;
        
    }


    // функция вычисляет расстояние Хэмминга между двумя бинарными векторами
    _hammingDistance(a, b) {
        let distance = 0;
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) distance++;
        }
        return distance;
      }
      
  }
  