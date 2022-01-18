module.exports = {
  skipFiles: ['test'],
  // Reduce instrumentation footprint - volume of solidity code
  // passed to compiler causes it to crash
  // Line and branch coverage will still be reported.
  measureStatementCoverage: false,
  measureFunctionCoverage: false,
};
