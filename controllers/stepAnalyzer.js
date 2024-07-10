const math = require('mathjs');
const StepGenerator = require('./stepGenerator');

class StepAnalyzer {
  static analyzeStep(equation, userStep) {
    const possibleSteps = StepGenerator.generateNextSteps(equation);
    const isValid = possibleSteps.includes(userStep);
    return isValid;
  }

  static getFeedback(isValid) {
    return isValid ? 'Correct step!' : 'Incorrect step. Try again!';
  }
}

module.exports = StepAnalyzer;
