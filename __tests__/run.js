const Eva = require("../eva");

const tests = [
    require("./self-eval-test"),
    require("./math-test"),
    require("./comparison-test"),
    require("./variables-test"),
    require("./blocks-test"),
    require("./if-test"),
    require("./while-test"),
    require("./built-in-function-test"),
    require("./user-defined-function-test"),
    require("./lambda-function-test")
];

const eva = new Eva();

tests.forEach(test => test(eva));

console.log("All assertions passed!");