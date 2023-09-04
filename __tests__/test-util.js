const assert = require("assert");
const evaParser = require("../parser/eva-parser")

function test(eva, code, expected) {
    const exp = evaParser.parse(code);
    assert.strictEqual(eva.eval(exp), expected);
}

module.exports = {test};