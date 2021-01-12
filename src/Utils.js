const crypto = require('crypto');


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
    let reqData = req.body
    for (var field of requiredFields) {
        if (!reqData[field]) throw new Error(`Requset ${req.originalUrl} must contain field:${field}`)
    }
    for (var field in reqData) {
        if (!requiredFields.includes(field) && !optionalFields.includes(field)) throw new Error(`Requset ${req.originalUrl} contains unneccecery field: ${field}`)
    }
    return true
}

function validateDataWrite(data) {
    for (var field in data) {
        if (typeof (data[field]) === typeof (undefined))
            throw new Error(`Cannot write data: field: ${field} is undefined`)
    }
    return true
}

module.exports = {
    generateId,
    validateRequest,
    validateDataWrite
}