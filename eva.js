const assert = require('assert');

const Environment = require('./environment');

/**
 * Eva interpreter
 * */
class Eva {
    /**
     * Creates an Eva instance with a global environment.
     * */
    constructor(global = GlobalEnvironment) {
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
        if (this._isNumber(exp)) {
            return exp;
        }

        if (this._isString(exp)) {
            return exp.slice(1, -1);
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
        if (this._isVariableName(exp)) {
            return env.lookup(exp);
        }

        // -------------------------------------------------------------
        // if-expression
        if (exp[0] === 'if') {
            const [_tag, condition, consequent, alternate] = exp;
            if (this.eval(condition, env)) {
                return this.eval(consequent, env);
            }
            return this.eval(alternate, env);
        }

        // -------------------------------------------------------------
        // while loop
        if (exp[0] === 'while') {
            const [_tag, condition, body] = exp;
            let result;
            while (this.eval(condition, env)) {
                result = this.eval(body, env);
            }
            return result;
        }

        // -------------------------------------------------------------
        // Function calls: (print "Hello world!") | (+ x 5) | (> foo bar)
        if (Array.isArray(exp)) {
            const fn = this.eval(exp[0], env);
            const args = exp
                .slice(1)
                .map(arg => this.eval(arg, env));
            // 1. Native functions:
            if (typeof fn === 'function') {
                return fn(...args);
            }

            // 2. User-defined functions:
            // TODO
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

    _isNumber(exp) {
        return typeof exp === 'number';
    }

    _isString(exp) {
        return typeof exp === 'string' && exp[0] === '"' && exp[exp.length - 1] === '"';
    }

    _isVariableName(exp) {
        return typeof exp === 'string' && /^[+\-*/<>=%a-zA-Z0-9_]*$/.test(exp);
    }
}

/**
 * Default Global Environment.
 * */
const GlobalEnvironment = new Environment({
    null: null,

    true: true,
    false: false,

    VERSION: '1.0',

    // Operators:
    '+'(op1, op2) {
        return op1 + op2;
    },
    '-'(op1, op2 = null) {
        if (op2 == null) {
            return -op1;
        }
        return op1 - op2;
    },
    '*'(op1, op2) {
        return op1 * op2;
    },
    '/'(op1, op2) {
        return op1 / op2;
    },
    '%'(op1, op2) {
        return op1 % op2;
    },

    // Comparison:
    '<'(op1, op2) {
        return op1 < op2;
    },
    '<='(op1, op2) {
        return op1 <= op2;
    },
    '>'(op1, op2) {
        return op1 > op2;
    },
    '>='(op1, op2) {
        return op1 >= op2;
    },
    '=='(op1, op2) {
        return op1 === op2;
    },

    // Console output:
    print(...args) {
        console.log(...args);
    }
})

module.exports = Eva;