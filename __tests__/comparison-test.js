const assert = require("assert");

module.exports = (eva) => {
    assert.strictEqual(eva.eval(['<', 1, 5]), true);
    assert.strictEqual(eva.eval(['<=', 5, 5]), true);
    assert.strictEqual(eva.eval(['<=', 6, 5]), false);
    assert.strictEqual(eva.eval(['>', ['-', 3, 2], 5]), false);
    assert.strictEqual(eva.eval(['>=', ['-', 7, 2], 5]), true);
}