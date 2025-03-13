const userDao = require('../dao/user.js')

const commonHelper = require('../helper/common.js')
const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const { Log } = require("../utils/logger.js")
const { sendEmail, setEmailTemplate, sendInternalEmail } = require('../utils/email.js');
const { messages, httpStatus, emailTypes } = require('../helper/constants.js');
const ObjectId = require('mongoose').Types.ObjectId
const dayjs = require('dayjs')
// const pricingDao = require('../dao/pricing.js')

module.exports.checkEmail = async function (req, res) {
    try {
        console.log(req.params.email)
        const user = await userDao.getUserByEmail(req.params.email)
        if (user.length) {
            return res.status(200).send({ emailExist: true, tempMailFound: false, message: messages.EMAIL_EXISTS });
        } else {
            const tempDomain = await commonDao.tempDomainExist(req.params.email.split('@')[1])
            if (tempDomain) {
                return res.status(200).send({ emailExist: false, tempMailFound: true, message: messages.TEMP_DOMAIN_USED });
            }
        }

        return res.status(200).send({ emailExist: false, tempMailFound: false });

    } catch (error) {
        res.status(500).send({ message: messages.INTERNAL_SERVER_ERROR });
        Log("checkEmail", error)
    }
}

const createAndUpdateStudentCourse = async function (obj) {
    let shareDetails = await commonDao.shareDetailById({ _id: new ObjectId(obj.shareToken) })
    let studentCourseDetails = await commonDao.getStudentCourseRecords({ studentId: obj.user._id, courseIds: shareDetails.courseId })
    let courseDetails = await courseDao.getCourseDetails([shareDetails.courseId])

    let studentCourseObj = {
        studentId: obj.user._id,
        courseIds: shareDetails.courseId,
        teacherIds: shareDetails.uid,
    }
    if (studentCourseDetails) {
        let topicDetails = []
        if (shareDetails.isTopic) {
            for (let i = 0; i < shareDetails.topicDetails.length; i++) {
                const element = array[i];
                let topicObj = studentCourseDetails.topicDetails.find(item => {
                    if (JSON.stringify(item.topicId) == JSON.stringify(element)) {
                        return item
                    }
                })
                if (topicObj) {
                    topicDetails.push(topicObj)
                } else {
                    topicDetails.push({ topicId: new ObjectId(element), purchaseStatus: false })
                }
            }
        } else {
            for (let i = 0; i < courseDetails[0].topicsDetails.length; i++) {
                const element = courseDetails[0].topicsDetails[i];
                let topicObj = studentCourseDetails.topicDetails.find(item => {
                    if (JSON.stringify(item.topicId) == JSON.stringify(element._id)) {
                        return item
                    }
                })
                if (topicObj) {
                    topicDetails.push(topicObj)
                } else {
                    topicDetails.push({ topicId: new ObjectId(element._id), purchaseStatus: false })
                }
            }

        }
        studentCourseObj.topicDetails = topicDetails
        await commonDao.updateStudentCourseRecord({ _id: studentCourseDetails._id }, { topicDetails: topicDetails })
    } else {
        let topicDetails = []
        if (shareDetails.isTopic) {
            for (let i = 0; i < shareDetails.topicDetails.length; i++) {
                const element = array[i];
                let topicObj = studentCourseDetails.topicDetails.find(item => {
                    if (JSON.stringify(item.topicId) == JSON.stringify(element)) {
                        return item
                    }
                })
                if (topicObj) {
                    topicDetails.push(topicObj)
                } else {
                    topicDetails.push({ topicId: new ObjectId(element), purchaseStatus: false })
                }
            }
        } else {
            for (let i = 0; i < courseDetails[0].topicsDetails.length; i++) {
                const element = courseDetails[0].topicsDetails[i];
                topicDetails.push({ topicId: new ObjectId(element._id), purchaseStatus: false })
            }
        }
        studentCourseObj.topicDetails = topicDetails
        await commonDao.createStudentCourseRecords(studentCourseObj)
    }
}

module.exports.registerUser = async function (req, res) {
    try {
        console.log(`😱 😓 😒 ~ req.body: register user`, req.body)

        // Check user exist 
        const userExist = await userDao.getUserByEmail(req.body.email)
        console.log(userExist, "userExist");
        if(userExist.length > 0){
            return res.status(200).send({status: false, message: 'Email Already Registered!' });
        }

        req.body.password = await commonHelper.hashPassword(req.body.password)
        const user = await userDao.registerUser(req.body)


        let verificationToken = crypto.randomBytes(16).toString('hex');
        userDao.createToken({ userId: user._id, token: verificationToken })
        let link = `${process.env.ORIGIN_URL}/verify-email?token=${verificationToken}`

        let emailHTML = await setEmailTemplate(emailTypes.VERIFY_EMAIL, { firstName: user.firstName, link })

        sendEmail({ to: req.body.email, subject: "VidyaNova Email Verification", html: emailHTML })
        res.status(200).send({ message: 'Account Registered Successfully!', status: true });

        // emailHTML = await setEmailTemplate(emailTypes.INTERNAL_EMAIL, { firstName: 'admin', fullName: user.firstName + ' ' + user.lastName, email: req.body.email })
        // sendInternalEmail({ subject: "New User Registered", html: emailHTML })

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Registration Failed' });
        Log("registerUser", error)
    }
}

module.exports.loginUser = async function (req, res) {
    try {
        console.log("🚀 ~ req.body:", req.body)
        const user = await userDao.getUser({ email: req.body.email })
        console.log("🚀 ~ user:", user)
        if (!user) {
            res.status(200).send({ status: false, message: messages.USER_NOT_EXIST });
            return;
        }
        if (!user.isVerified) {
            res.status(200).send({ status: false, message: messages.VERIFY_EMAIL, showVerification: true });
            return;
        }
        passwordMatched = await commonHelper.comparePasswords(req.body.password, user.password)
        if (passwordMatched) {
          
            let plan = 'Free Trial'
            let subscription = {
                subscriptionId: 'Free',
                features:[]
            }
            let randomToken = crypto.randomBytes(16).toString('hex');
            const token = jwt.sign(
                { token: randomToken, uid: user.id, email: user.email, planId: user.planId },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '24h' }
            )


            let userObj = {
                fullName: user.firstName + " " + user.lastName,
                userId: user._id,
                email: user.email,
                planId: user.planId,
                planName: plan?.name ?? null,
                subscriptionId: subscription?.subscriptionId ?? null,
                features: subscription?.features ?? [],
                userType: user.userType,
                jwtToken: token
            }
            if (user.userType != 'admin' && user.userType != 'student' && plan.isFreeTrial) {
                const createdDate = dayjs(user?.createdAt);
                const daysElapsed = dayjs().diff(createdDate, 'day');
                const remainingTrialDays = Math.max((plan?.trialDays || 0) - daysElapsed, 0);

                userObj.isFreeTrial = plan?.isFreeTrial || false;
                userObj.remainingTrialDays = remainingTrialDays;

                if (remainingTrialDays === 0) {
                    return res.status(200).json({ trialEnded: true, status: true, userObj });
                }
            }
            if (user.userType == 'student' && req.body.shareToken) {
                // await createAndUpdateStudentCourse({user:user,...req.body})
            }

            res.status(200).send({ trialEnded: false, status: true, userObj });
            return
        }
        res.status(200).send({ status: false, message: 'Invalid Credentials' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Login Failed' });
        Log("loginUser", error)

    }
}

// exports.loginUser({
//     body: {
//         email: 'vishalmishra2320@gmail.com',
//         shareToken: '67b42cec99b16ce4d53559b5',
//         password: 'Admin@123'
//     }
// })
// module.exports.getPresignedData = async function (req, res) {
//     let url = await generatePreSignedGetUrl(req.query.path)
//     res.status(200).send(url);
// }

module.exports.verifyNewUser = async function (req, res) {
    try {
        const userToken = await userDao.getClientToken(req.params.verificationToken);
        if (!userToken) {
            return res.status(httpStatus.OK).send({ status: false, message: messages.INVALID_VERIFICATION_LINK });
        }
        await userDao.updateUser(userToken.userId, { isActive: true, isVerified: true });

        res.status(httpStatus.OK).send({ success: true, message: messages.USER_VERIFIED });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).send({ message: messages.SERVER_ERROR });
    }
}

module.exports.resetPassword = async function (req, res) {
    try {
        const user = await userDao.getUser({ email: req.body.email });
        if (!user) {
            return res.status(httpStatus.OK).send({ status: false, message: messages.USER_NOT_EXIST });
        }
        let resetToken = crypto.randomBytes(16).toString('hex');
        userDao.createToken({ userId: user._id, token: resetToken })

        let link = `${process.env.ORIGIN_URL}/reset-password?token=${resetToken}`

        let emailHTML = await setEmailTemplate(emailTypes.RESET_PASSWORD, { firstName: user.firstName, link })

        await sendEmail({ to: req.body.email, subject: "VidyaNova Password Reset", html: emailHTML })

        res.status(httpStatus.OK).send({ status: true, message: messages.RESET_EMAIL_SENT });
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).send({ message: messages.SERVER_ERROR });
        Log("resetPassword", error)
    }
}

module.exports.updatePassword = async function (req, res) {
    try {
        const userToken = await userDao.getClientToken(req.body.token);
        if (!userToken) {
            return res.status(httpStatus.OK).send({ status: false, message: messages.INVALID_VERIFICATION_LINK });
        }
        let password = await commonHelper.hashPassword(req.body.password)
        await userDao.updateUser(userToken.userId, { password })

        res.status(httpStatus.OK).send({ status: true, message: messages.PASSWORD_UPDATED });
    } catch (error) {
        Log("updatePassword", error)
        res.status(httpStatus.SERVER_ERROR).send({ message: messages.SERVER_ERROR });

    }

}