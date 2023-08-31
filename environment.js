/**
 * Environment: names storage.
 * */
class Environment {
    /**
     * Creates environment with given record.
     * */
    constructor(record = {}) {
        this.record = record;
    }

    /**
     * Creates a variable with given name and value.
     * */
    define(name, value) {
        this.record[name] = value;
        return value;
    }

    /**
     * Returns a value of defined variable, or throws if the variable is not defined.
     * */
    lookup(name) {
        if (this.record.hasOwnProperty(name)) {
            return this.record[name];
        }
        throw new ReferenceError(`Variable "${name}" is not defined.`);
    }
}

module.exports = Environment;