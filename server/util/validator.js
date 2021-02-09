import validator from 'validator';
import assert from 'assert';

/**
 * Checks that the given value is a Non-empty String
 * @param {any} value value to validate
 * @param {any} name name of the value
 * @throws {AssertionError} If the given value is not a 
 * string or is empty
 */
function isNonEmptyString(value, name) {
    assert.strictEqual(typeof value, 'string', `${name} must be a string.`);
    assert(!validator.isEmpty(value), `${name} cannot be empty.`);
};

/**
 * Checks that the given value is a letter
 * @param {any} value value to validate
 * @param {any} name name of the value
 * @throws {AssertionError} If the given value is not a letter
 */
function isAlphaString(value, name) {
    isNonEmptyString(value, name)
    assert(validator.isAlpha(value), `${name} must be a letter in a-z, A-Z.`);
}

/**
 * Checks that the given value contains letter and numbers
 * @param {any} value value to validate
 * @param {any} name name of the value
 * @throws {AssertionError} If validation fails
 */
function isAlphaNumString(value, name) {
    isNonEmptyString(value, name)
    assert(validator.isAlphanumeric(value), `${name} can only contain letters and numbers.`);
}

/**
 * validates that the given value is a Integer
 * @param {any} value value to validate
 * @param {any} name name of the value
 * @throws {AssertionError} If the given value is not a Integer
 */
function isInteger(value, name) {
    assert(!Number.isNaN(value),`${name} cannot be Nan.`);
    assert(Number.isInteger(value),`${name} must be a Integer.`);
};

/**
 * validates that the given value is a positive Integer
 * @param {any} value value to validate
 * @param {any} name name of the value
 * @throws {AssertionError} If the given value is not a positive Integer
 */
function isPositiveInteger(value, name) {
    isInteger(value, name)
    assert(value > 0, `${name} must be a positive Integer.`)
};

/**
 * validates that the given value is a email
 * @param {any} value value to validate
 * @param {any} name name of the value
 * @throws {AssertionError} If the given value is not a email
 */
function isEmail(value, name) {
    isNonEmptyString(value, name)
    assert(validator.isEmail(value),`${name} must be a email.`);
};


export {isNonEmptyString, isAlphaString, isAlphaNumString, isInteger, isPositiveInteger, isEmail};