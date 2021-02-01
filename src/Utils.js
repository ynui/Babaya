const crypto = require('crypto');

const ENCRYPTION = 'sha1'


function createError(message, code = null, status = null) {
    let error = new Error(message);
    error.status = status
    error.code = code
    return error
}

function generateHashId(input) {
    return crypto.createHash(ENCRYPTION).update(JSON.stringify(input)).digest('hex')
}

function convertJsonIntToString(data) {
    for (var field in data) {
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
        req.method = 'Call'
        req.originalUrl = '==='
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

function dataValidator(data, validator, isArray = false, additionalData = null) {
    let valid = false
    switch (validator) {
        case 'number':
            valid = isOnlyNumbers(data)
            break;
        case 'date':
            valid = isDate(data)
            break;
        case 'groups':
            valid = isGroupsListValid(data, additionalData)//additional data will be list of existing groups?
            break;
        case 'string':
            valid = isString(data)
            break;
        case 'id':
            if (isArray)
                valid = isIdsArray(data)
            else
                valid = isSingleId(data)
            break;
    }
    return valid
}

function isOnlyNumbers(number) {
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
    let valid = false
    if (!Array.isArray(ids))
        throw createError(`Input must be an array`, 'input-not-valid')
    if (ids.length === 0) {
        valid = true
    } else {
        for (var id of ids) {
            valid = isSingleId(id)
        }
    }
    return true
}

function isGroupsListValid(groups) {
    let valid = false
    if (!Array.isArray(groups))
        throw createError(`Input must be an array`, 'input-not-valid')

    // TODO

    valid = true;
    return valid
}

function isString(data, isArray = false) {
    let valid = false;
    if (isArray) {
        if (!Array.isArray(data))
            throw createError(`Input must be an array`, 'input-not-valid')
        for (var str of data) {
            valid = isString(str)
            if (!valid) {
                break;
            }
        }
    } else {
        if (Array.isArray(data))
            throw createError(`Array is not a valid input`, 'input-not-valid')
        if (!(typeof data === 'string'))
            throw createError(`Input must be a string`, 'input-not-valid')
        if (data === "")
            throw createError(`Input must not be empty`, 'input-not-valid')
        valid = true
    }
    return valid
}

module.exports = {
    generateHashId,
    validateRequest,
    validateDataWrite,
    createError,
    isRequestValid,
    removeTrailingSlash,
    applyMiddleware,
    convertJsonIntToString,
    isCallValid,
    dataValidator,
    validateCall
}