const Utils = require('../Utils')

const RequestValidators = {
    POST: {
        required: [
            'query'
        ],
        optional: [
            'lang'
        ]
    }
}
function validateRequest(req, res, next, required = [], optional = []) {
    let originalUrl = Utils.removeTrailingSlash(req.originalUrl)
    req.valid = false
    switch (req.method) {
        case 'POST':
            required = RequestValidators.POST.required
            optional = RequestValidators.POST.optional
            break;
        default:
            if (required.length == 0 && optional.length == 0) {
                console.warn(`No validators provided for ${originalUrl}`)
            }
            break;
    }
    let validateResault = Utils.validateRequest(req, required, optional);
    if (validateResault.error) return next(validateResault.error)
    else req.valid = validateResault.valid
    return next()
}

module.exports = {
    validateRequest
}