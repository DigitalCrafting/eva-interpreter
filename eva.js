const assert = require('assert');

/**
 * Eva interpreter
 * */
class Eva {
    /*
    * Exp ::= Number
    * | String
    * | [+ Exp Exp]
    * ;
    * */
    eval(exp) {
        // -------------------------------------------------------------
        // Self-evaluating expressions
        if (isNumber(exp)) {
            return exp;
        }

        if (isString(exp)) {
            return exp.slice(1, -1);
        }

        // -------------------------------------------------------------
        // Math operations
        if (exp[0] === '+') {
            return this.eval(exp[1]) + this.eval(exp[2]);
        }

        if (exp[0] === '-') {
            return this.eval(exp[1]) - this.eval(exp[2]);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1]) * this.eval(exp[2]);
        }

        if (exp[0] === '/') {
            return this.eval(exp[1]) / this.eval(exp[2]);
        }

        if (exp[0] === '%') {
            return this.eval(exp[1]) % this.eval(exp[2]);
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

// -------------------------------------------------------------
// Self-evaluating expressions
assert.strictEqual(eva.eval(1), 1);
assert.strictEqual(eva.eval('"hello"'), 'hello');

// -------------------------------------------------------------
// Math operations
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

console.log("All assertions passed!");