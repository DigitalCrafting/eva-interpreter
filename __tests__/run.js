const Eva = require("../eva");

const tests = [
    require("./self-eval-test"),
    require("./math-test"),
    require("./comparison-test"),
    require("./variables-test"),
    require("./blocks-test"),
    require("./if-test"),
    require("./while-test"),
    require("./built-in-function-test")
];

const eva = new Eva();

eva.eval(['print', '"Hello,"', '"World!"']);

tests.forEach(test => test(eva));

console.log("All assertions passed!");