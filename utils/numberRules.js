// numberRules.js


// 🔹 Global sequence helper (starts from 1)
function nextSequence(lastSeq) {
  return lastSeq + 1;
}


// 🔹 FD receipt number builder (global sequence)
function buildFDReceipt(seq) {
  return `RPD/FD/${1000 + seq}`;
}



module.exports = { nextSequence, buildFDReceipt };
