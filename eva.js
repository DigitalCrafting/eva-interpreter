const assert = require('assert');

const Environment = require('./environment');

/**
 * Eva interpreter
 * */
class Eva {
    /**
     * Creates an Eva instance with a global environment.
     * */
    constructor(global = new Environment()) {
        this.global = global;
    }

    /**
     * Evaluates an expression in a given environment.
     *
     * Exp ::= Number
     * | String
     * | [+ Exp Exp]
     * | [var Name Exp]
     * | [set Name Exp]
     * | Name
     * | [begin Exp...]
     * ;
     * */
    eval(exp, env = this.global) {
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
            return this.eval(exp[1], env) + this.eval(exp[2], env);
        }

        if (exp[0] === '-') {
            return this.eval(exp[1], env) - this.eval(exp[2], env);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1], env) * this.eval(exp[2], env);
        }

        if (exp[0] === '/') {
            return this.eval(exp[1], env) / this.eval(exp[2], env);
        }

        if (exp[0] === '%') {
            return this.eval(exp[1], env) % this.eval(exp[2], env);
        }

        // -------------------------------------------------------------
        // Block: sequence of expressions
        if (exp[0] === 'begin') {
            const blockEnv = new Environment({}, env);
            return this._evalBlock(exp, blockEnv);
        }

        // -------------------------------------------------------------
        // Variable declaration: (var x 10)
        if (exp[0] === 'var') {
            const [_, name, value] = exp;
            return env.define(name, this.eval(value, env));
        }

        // -------------------------------------------------------------
        // Variable update: (set x 10)
        if (exp[0] === 'set') {
            const [_, name, value] = exp;
            return env.assign(name, this.eval(value, env));
        }

        // -------------------------------------------------------------
        // Variable access: x
        if (isVariableName(exp)) {
            return env.lookup(exp);
        }

        throw `Unimplemented: ${JSON.stringify(exp)}`;
    }

    _evalBlock(block, env) {
        let result;

        const [_tag, ...expressions] = block;
        expressions.forEach(exp => {
            result = this.eval(exp, env);
        });

        return result;
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp[exp.length - 1] === '"';
}

function isVariableName(exp) {
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

// -------------------------------------------------------------
// tests
const eva = new Eva(new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '1.0'
}));

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

// -------------------------------------------------------------
// Variables
assert.strictEqual(eva.eval(['var', 'x', 10]), 10);
assert.strictEqual(eva.eval('x'), 10);
assert.strictEqual(eva.eval(['var', 'y', 100]), 100);
assert.strictEqual(eva.eval('y'), 100);

assert.strictEqual(eva.eval(['var', 'isUser', 'true']), true);
assert.strictEqual(eva.eval('VERSION'), '1.0');

assert.strictEqual(eva.eval(['var', 'z', ['*', 2, 2]]), 4);
assert.strictEqual(eva.eval('z'), 4);

// -------------------------------------------------------------
// Blocks
assert.strictEqual(eva.eval(
        ['begin',
            ['var', 'x', 10],
            ['var', 'y', 20],
            ['+', ['*', 'x', 'y'], 30]
        ]
    ),
    230);

assert.strictEqual(eva.eval(
        ['begin',
            ['var', 'x', 10],
            ['begin',
                ['var', 'x', 20],
                'x'
            ],
            'x'
        ]
    ),
    10);

assert.strictEqual(
    eva.eval(
        ['begin',
            ['var', 'value', 10],
            ['var', 'result',
                [
                    'begin',
                    ['var', 'x', ['+', 'value', 10]],
                    'x'
                ]
            ],
            'result'
        ]
    ),
    20);

assert.strictEqual(
    eva.eval(
        ['begin',
            ['var', 'data', 10],
            [
                'begin',
                ['set', 'data', 100]
            ],
            'data'
        ]
    ),
    100);


console.log("All assertions passed!");