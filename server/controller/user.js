const sessionDao = require('../dao/sessions.js');
const commonHelper = require('../helper/common.js')
const { messages, httpStatus, PLAN_SESSIONS } = require('../helper/constants.js');
const { Log } = require('../utils/logger.js');
const dayjs = require('dayjs');
const short = require('short-uuid');


module.exports.fetchProfile = async function (req, res) {
    try {
        let searchParams = JSON.parse(req.query.searchParams)
        let sessions = await sessionDao.fetchSessions(req.params.userId, req.query.skip, req.query.limit, searchParams)
        res.status(httpStatus.OK).send(sessions);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).send({ message: error.message });
        Log("fetchSessions", error, req.params?.userId)
    }
}


module.exports.fetchBankDetails = async function (req, res) {
    try {
        let searchParams = JSON.parse(req.query.searchParams)
        let sessions = await sessionDao.fetchSessions(req.params.userId, req.query.skip, req.query.limit, searchParams)
        res.status(httpStatus.OK).send(sessions);
    } catch (error) {
        res.status(httpStatus.SERVER_ERROR).send({ message: error.message });
        Log("fetchSessions", error, req.params?.userId)
    }
}
