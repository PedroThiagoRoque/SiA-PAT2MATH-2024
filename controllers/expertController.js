const StepAnalyzer = require('./stepAnalyzer');

exports.evaluateStep = (req, res) => {
  const { equation, userStep } = req.body;
  const isValid = StepAnalyzer.analyzeStep(equation, userStep);
  const feedback = StepAnalyzer.getFeedback(isValid);
  res.json({ isValid, feedback });
};
