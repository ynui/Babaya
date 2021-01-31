const { exec } = require('child_process');
const crypto = require('crypto');

const ENCRYPTION = 'sha1'


function createError(message, code = null, status = null) {
    let error = new Error(message);
    error.status = status
    error.code = code
    return error
}

function generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let resID = '';
    while (resID.length < 20) {
        const bytes = crypto.randomBytes(40);
        bytes.forEach(b => {
            const maxValue = 62 * 4 - 1;
            if (resID.length < 20 && b <= maxValue) {
                resID += chars.charAt(b % 62);
            }
        });
    }
    return resID;
}

function generateHashId(input) {
    return crypto.createHash(ENCRYPTION).update(JSON.stringify(input)).digest('hex')
}

function convertJsonIntToString(data) {
    for (field in data) {
        if (typeof data[field] === 'number')
            data[field] = data[field].toString()
        if (typeof data[field] === 'object')
            data[field] = convertJsonIntToString(data[field])

    }
    return data
}

function validateRequest(req, requiredFields, optionalFields) {
    let resault = {
        valid: false,
        error: null
    }
    req.body = convertJsonIntToString(req.body)
    let reqData = req.body
    let invalidFound = false
    if (requiredFields && !invalidFound) {
        for (var field of requiredFields) {
            if (!reqData[field]) {
                // if (reqData[field] === 0) continue;
                invalidFound = true
                resault.valid = false
                resault.error = createError(`${req.method} requset on ${req.originalUrl} must contain field: ${field}`)
                break;
            }
        }
    }
    if (reqData && !invalidFound) {
        for (var field in reqData) {
            if (!requiredFields.includes(field) && !optionalFields.includes(field)) {
                resault.valid = false
                resault.error = createError(`${req.method} requset on ${req.originalUrl} contains unrelated field: ${field}`, 'unrequired-field')
                break;
            }
        }
    }
    if (!resault.error) {
        resault.valid = true
    }
    return resault
}

function isCallValid(data, requiredFields, optionalFields) {
    let valid = false;
    let req = {}
    try {
        req.body = data
        valid = validateRequest(req, requiredFields, optionalFields).valid
    } catch (error) {
        throw error
    }
    return valid
}

function validateCall(data, requiredFields, optionalFields) {
    let resault = false
    data = convertJsonIntToString(data)
    let invalidFound = false
    if (requiredFields && !invalidFound) {
        for (var field of requiredFields) {
            if (!data[field]) {
                // if (reqData[field] === 0) continue;
                throw createError(`Call must contain field: ${field}`)
            }
        }
    }
    if (data && !invalidFound) {
        for (var field in data) {
            if (!requiredFields.includes(field) && !optionalFields.includes(field)) {
                throw createError(`Call contains unrelated field: ${field}`, 'unrequired-field')
            }
        }
    }
    resault = true
    return resault
}

function validateDataWrite(data) {
    let success = false;
    if (data) {
        for (var field in data) {
            if (typeof (data[field]) === typeof (undefined))
                throw createError(`Cannot write data: field: ${field} is undefined`, 'invalid-data-write')
        }
        success = true
    }
    return success
}

function isRequestValid(req, res, next) {
    if (!req.valid) {
        let error = createError('Request does not contain a valid flag', 'invalid-request')
        return next(error)
    }
    return next()
}

function removeTrailingSlash(str) {
    return str.replace(/\/+$/, '');
}

function applyMiddleware(middleware, req, res, next) {
    try {
        for (var func of middleware) {
            func(req, res, next)
        }
    } catch (error) {
        throw error
    }
}

function validateUserData(data, validators) {
    let validatingField = null
    let valid = true;
    try {
        for (var field in data) {
            validatingField = field
            let value = data[field]
            switch (field) {
                case 'phoneNumber':
                    valid = isPhoneNumber(value);
                    break;
                case 'dataOfBirth':
                    valid = isDate(value)
                    break;
                case 'languageId':
                case 'userType':
                case 'genderId':
                case 'maritalStatus':
                    valid = isSingleId(value);
                    break;
                case 'workingPlace':
                case 'areaOfInterest':
                case 'expertise':
                    valid = isIdsArray(value);
                    break;
                case 'demographic':
                    valid = isDemographic(value, validators.demographic)
                    break;
                case 'demographicsOther':
                    valid = isDemographicsOther(value, validators.demographic)
                    break;
                case 'groups':
                    valid = isGroupsListValid(value)
                    break;
                default:
                    //TODO
                    break;
            }
            if (!valid) break;
        }
    } catch (error) {
        throw createError(`Error on ${validatingField}, ${error.message}`, error.code)
    }
    return valid
}

function isPhoneNumber(number) {
    number = number.toString()
    var onlyNumbers = number.replace(/\D/g, "");
    if (number !== onlyNumbers)
        throw createError(`Phone number must only contain numbers`, 'input-not-valid')
    return true
}

function isDate(date) {
    //TODO
    return true;
}

function isSingleId(id) {
    if (Array.isArray(id))
        throw createError(`Array is not a valid input`, 'input-not-valid')
    let tryParse = Number.parseInt(id)
    if (Number.isNaN(tryParse))
        throw createError(`Input is not a number`, 'input-not-valid')
    return true
}

function isIdsArray(ids) {
    if (!Array.isArray(ids))
        throw createError(`Input is not an array`, 'input-not-valid')
    for (id of ids) {
        isSingleId(id)
    }
    return true
}

function isDemographic(data, validators) {
    let valid = false
    if (Array.isArray(data))
        throw createError(`Array is not a valid input`, 'input-not-valid')
    valid = validateCall(data, validators.required, validators.optional)
    return valid
}

function isDemographicsOther(data, validators) {
    let valid = false
    if (!Array.isArray(data))
        throw createError(`Input is not an array`, 'input-not-valid')
    for (var demog of data) {
        valid = validateCall(demog, validators.required, validators.optional)
    }
    return valid
}

function isGroupsListValid(groups) {
    let valid = false
    if (!Array.isArray(groups))
        throw createError(`Input is not an array`, 'input-not-valid')

    // TODO

    valid = true;
    return valid
}
module.exports = {
    generateId,
    generateHashId,
    validateRequest,
    validateDataWrite,
    createError,
    isRequestValid,
    removeTrailingSlash,
    applyMiddleware,
    convertJsonIntToString,
    isCallValid,
    validateUserData,
    validateCall
}