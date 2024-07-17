const mathsteps = require('mathsteps');

const solveEquation = (equation) => {
  const steps = mathsteps.solveEquation(equation);
  return steps.map(step => step.newEquation.ascii());
};

module.exports = {
  solveEquation
};
