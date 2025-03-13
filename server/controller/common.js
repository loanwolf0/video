const userDao = require('../dao/user.js')
const commonDao = require('../dao/common.js')
const paymentDao = require('../dao/payment.js')
const guruDao = require('../dao/guru.js')
const { Log } = require("../utils/logger.js")
const { messages, httpStatus, emailTypes } = require('../helper/constants.js');
const courseLibraryDao = require("../dao/course-library.js")
const { getFeatureByModuleName } = require('../helper/common.js')

module.exports.getPlans = async (req, res) => {
    try {
        let plans = await commonDao.getPlans(req.query.country)
        res.status(httpStatus.OK).send({ plans });

    } catch (error) {
        Log("getPlans", error)
        res.status(httpStatus.SERVER_ERROR).send({ message: messages.SERVER_ERROR });
    }
}

module.exports.getUpgradePlans = async (req, res) => {
    try {
        let current = await commonDao.getPlanById(req.query.planId)
        let usedVideoCount = await courseLibraryDao.getCourseLibraryListCount(req.query.userId);
        let subscription = await paymentDao.getSubscription({ userId: req.query.userId, isActive: true });

        const currentPlan = {
            currentVideoCount: req.query.isFreeTrial ? 0 : getFeatureByModuleName(subscription, "VIDEO")?.quantity || 1,
            usedVideoCount: usedVideoCount,
            dueDate: subscription.dueDate,
            amount: subscription.amount,
            trialDays: current.trialDays,
            name: current.name,
        }
        if (req.query.isFreeTrial) {
            plans = await commonDao.getPlans(req.query.country, false)
        } else {
            plans = [current]
        }

        res.status(httpStatus.OK).send({ plans, currentPlan });

    } catch (error) {
        Log("getPlans", error)
        res.status(httpStatus.SERVER_ERROR).send({ message: messages.SERVER_ERROR });
    }
}