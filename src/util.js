// Cribbed from: https://www.emailregex.com/
const emailRegex = new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/')

const hasValidEmail = str => emailRegex.test(str)
const hasLength = str => str.length > 0
const hasValue = x => x != null
const ageIsGte18 = num => num >= 18

const validators = {
    email: x => [hasValue(x), hasLength(x), hasValidEmail(x)].every(y => y === true),
    name:  x => [hasValue(x), hasLength(x)].every(y => y === true),
    age:   x => [hasValue(x), ageIsGte18(x)].every(y => y === true)
}

const errors = {
    invalidEmail: "Error: please enter a valid email address.",
    emptyValue: "Error: mandatory field.",
    tooYoung: "Error: you must be 18 or older."
}


export default { validators, errors }