export default function calc(quality : number, previousDays : number, repetitions : number, previousEaseFactor : number){
   
  let days;
  let easeFactor;
  
    if (quality >= 3) {
        switch (repetitions) {
        case 0:
            days = 1;
            break;
        case 1:
            days = 6;
            break;
        default:
        days = Math.round((previousDays * previousEaseFactor));
    }
        repetitions++;
        easeFactor = previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
        repetitions = 0;
        days = 1;
        easeFactor = previousEaseFactor;
    }
        if (easeFactor < 1.3) {
            easeFactor = 1.3;
    }
    
    return {
        days: days, repetitions: repetitions, easeFactor: easeFactor
    }
}
      

