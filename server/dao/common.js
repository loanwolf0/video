const model = require('../models/index.js')
const mongoose = require('mongoose');

module.exports.getPlans = async function (country = "US", isFreeTrial = true) {
    return await model.plans.find({
        isSpecial: false,
        isActive: true,
        $or: [
            ...(country ? [{ country }] : []),
            {
                isFreeTrial: isFreeTrial,
                country: { $exists: false }
            }
        ]
    });

}


module.exports.getPlanById = async function (planId) {
    return await model.plans.findOne({
        _id: planId,
        isActive: true
    });
}

module.exports.getPlanDetails = async function (userId) {
    return await model.user.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId),
            }
        },
        {
            $lookup: {
                from: 'plans',
                localField: 'currentPlan.planId',
                foreignField: 'planId',
                as: 'planDetails'
            }
        },
        {
            $unwind: "$planDetails" // Unwind the planDetails array
        },
        {
            $project: {
                name: "$planDetails.name",
                planId: "$planDetails.planId",
                interval: "$planDetails.interval",
                amount: "$planDetails.amount",
                totalSessions: "$planDetails.totalSessions",
                sessionDuration: "$planDetails.sessionDuration",
                subscriptionDate: "$currentPlan.subscriptionDate",
                createdAt: "$createdAt"
            }
        }
    ]);
}

module.exports.getPromoPlans = async function (code) {
    return await model.promoCodes.findOne({ code }).populate('planId')
}

module.exports.updatePromoCodeUsed = async function (_id) {
    return await model.plans.updateOne(
        { _id },
        { $inc: { "promoCodeDetail.timesUsed": 1 } });
}

module.exports.tempDomainExist = async function (domain) {
    return await model.tempMails.findOne({ domain })
}

module.exports.shareDetailById = async function (query) {
    return await model.shareDetails.findOne(query)
}

module.exports.getStudentCourseRecords = async function (query) {
    return await model.studentCourseRecord.findOne(query)
}

module.exports.createStudentCourseRecords = async function (options) {
    return await model.studentCourseRecord.create({ ...options })
}

module.exports.updateStudentCourseRecord = async function (match, set) {

    return  await model.studentCourseRecord.findOneAndUpdate(match, { $set: set }, { new: true })
}