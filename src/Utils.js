const { exec } = require('child_process');
const crypto = require('crypto');

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

function validateRequest(req, requiredFields, optionalFields) {
    let resault = {
        valid: false,
        error: null
    }
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

module.exports = {
    generateId,
    validateRequest,
    validateDataWrite,
    createError,
    isRequestValid,
    removeTrailingSlash,
    applyMiddleware
}