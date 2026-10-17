const Q="roundready.questions.v1"; const M="roundready.machine.v1";
export const loadQuestions=(fallback)=>{try{const v=localStorage.getItem(Q);return v?JSON.parse(v):fallback}catch{return fallback}};
export const saveQuestions=(v)=>localStorage.setItem(Q,JSON.stringify(v));
export const loadMachine=()=>localStorage.getItem(M)||"Not Started";
export const saveMachine=(v)=>localStorage.setItem(M,v);
export const clearAll=()=>{localStorage.removeItem(Q);localStorage.removeItem(M)};
