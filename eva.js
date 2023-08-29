const assert = require('assert');

/**
 * Eva interpreter
 * */
class Eva {
    eval(exp) {
        if (isNumber(exp)) {
            return exp;
        }

        if (isString(exp)) {
            return exp.slice(1, -1);
        }

        if (exp[0] === '+') {
            const firstOperand = this.eval(exp[1]);
            const secondOperand = this.eval(exp[2]);
            return firstOperand + secondOperand;
        }

        throw 'Unimplemented';
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp[exp.length - 1] === '"';
}

// -------------------------------------------------------------
// tests
const eva = new Eva();

assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"hello"'), 'hello');
assert.strictEqual(eva.eval(['+', 1, 5]), 6);
assert.strictEqual(eva.eval(['+', ['+', 3, 2], 5]), 10);

console.log("All assertions passed!");