const crypto = require('crypto');

function createError(message, code = null) {
    let error = new Error(message);
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
    let success = false
    let reqData = req.body
    if (requiredFields) {
        for (var field of requiredFields) {
            if (!reqData[field]) throw createError(`Requset ${req.originalUrl} must contain field: ${field}`)
        }
    }
    if (reqData) {
        for (var field in reqData) {
            if (!requiredFields.includes(field) && !optionalFields.includes(field)) throw createError(`Requset ${req.originalUrl} contains unneccecery field: ${field}`)
        }
    }
    success = true
    return success
}

function validateDataWrite(data) {
    for (var field in data) {
        if (typeof (data[field]) === typeof (undefined))
            throw createError(`Cannot write data: field: ${field} is undefined`)
    }
    return true
}

module.exports = {
    generateId,
    validateRequest,
    validateDataWrite,
    createError
}