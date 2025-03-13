const model = require('../models')

module.exports.registerUser = async function (options) {
    return await model.user.create({ ...options })
};


module.exports.getUserByEmail = async function (email) {
    return await model.user.find({ email })
};

module.exports.getUserById = async function (_id) {
    return await model.user.find({ _id })
};

module.exports.getUser = async function (options = {}) {
    return await model.user.findOne({ ...options })
}

module.exports.updateUser = async function (_id, options) {
    return await model.user.findOneAndUpdate({ _id }, { $set: options })
}

module.exports.createToken = async function (userTokenDetails) {
    return await model.userTokens.create(userTokenDetails)
}

module.exports.getClientToken = async function (token) {
    return await model.userTokens.findOne({ token })
}

module.exports.createPaymentHistory = async function (paymentObj) {
    return await model.userPayments.create(paymentObj)
}

module.exports.getAccessToken = async function () {
    return await model.userTokens.findOne({
        userId: null
    })
}