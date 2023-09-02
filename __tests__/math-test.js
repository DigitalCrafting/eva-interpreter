const assert = require("assert");

module.exports = (eva) => {
    // Addition
    assert.strictEqual(eva.eval(['+', 1, 5]), 6);
    assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);
    // Subtraction
    assert.strictEqual(eva.eval(['-', 1, 5]), -4);
    assert.strictEqual(eva.eval(['+', ['-', 3, 2], 5]), 6);
    // Multiplication
    assert.strictEqual(eva.eval(['*', 2, 5]), 10);
    assert.strictEqual(eva.eval(['+', ['*', 3, 2], 5]), 11);
    // Division
    assert.strictEqual(eva.eval(['/', 4, 2]), 2);
    assert.strictEqual(eva.eval(['+', ['/', 4, 2], 5]), 7);
    // Modulo
    assert.strictEqual(eva.eval(['%', 4, 2]), 0);
    assert.strictEqual(eva.eval(['%', 5, 2]), 1);
    assert.strictEqual(eva.eval(['+', ['%', 5, 2], 5]), 6);
}