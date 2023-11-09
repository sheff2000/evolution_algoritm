import { params } from '../params.js';
import { Algoritm } from '../Classes/AlgoritmClass.js';


export const startAlgoritm = (req, res) => {
  
    const algoritm = new Algoritm();
    console.log('in startAlgoritm - controller');

    //if (!algoritm.agents) {
      const lastVector =  algoritm.start();
    //}
    console.log('params.applicantsArray - ', params.applicantsArray);

    const toReturn = {
        applicants:params.applicantsArray,
        numberSkills:params.numberSkills,
        lastVector:lastVector,
        agents:algoritm.agents,
        best:algoritm.best
    }
    res.json(toReturn);
  
};