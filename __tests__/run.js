const Environment = require("../environment");
const Eva = require("../eva");

const selfEvalTest = require("./self-eval-test");
const mathTest = require("./math-test");
const variablesTest = require("./variables-test");
const blocksTest = require("./blocks-test");

const eva = new Eva(new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '1.0'
}));

selfEvalTest(eva);
mathTest(eva);
variablesTest(eva);
blocksTest(eva);

console.log("All assertions passed!");