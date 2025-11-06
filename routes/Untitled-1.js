//CIN-1001
//01


const text = "CIN-1001";
const lastTwoDigits = text.slice(-2);

console.log(lastTwoDigits); 


const customerumber = lastTwoDigits;
const loanType = 'MI';


//RPD/MI/0101

const lastreceipt = '05';
currentReceipt = lastreceipt + 1;
setData('RPD/'+loanType+customerumber+currentReceipt)
