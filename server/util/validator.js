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

export {isNonEmptyString, isAlphaString, isAlphaNumString};