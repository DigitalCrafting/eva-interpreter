const Environment = require("../environment");
const Eva = require("../eva");

const tests = [
    require("./self-eval-test"),
    require("./math-test"),
    require("./variables-test"),
    require("./blocks-test")
];

const eva = new Eva(new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '1.0'
}));

tests.forEach(test => test(eva));

console.log("All assertions passed!");