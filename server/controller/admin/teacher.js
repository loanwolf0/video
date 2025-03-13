const ObjectId = require('mongoose').Types.ObjectId;
const teacherDao = require('../../dao/admin/teacher.js');
const { httpStatus } = require('../../helper/constants.js');


module.exports.getTeachers = async function (req, res) {
    try {
        // const uid = 

        let teachers = await teacherDao.getTeachers(req.query.skip, req.query.limit, req.query.title)
        res.status(httpStatus.OK).send({ message: "Found data related to Teacher'", success: true, teachers })

    } catch (error) {
        console.log(error, "error");

        res.status(httpStatuss.SERVER_ERROR).send({ message: error.message });
        Log("fetchQuizs", error, req.params?.userId)
    }
}

module.exports.getTeacherDetails = async function (req, res) {
    try {
        let { teacherId } = req.params
        teacherId = new ObjectId(teacherId)

        let teacherDetails = await teacherDao.getTeacherDetails(teacherId)

        res.status(httpStatus.OK).send({ message: "Found data related to Teacher'", success: true, teacherDetails })

    } catch (error) {
        console.log(error, "error");
        res.status(httpStatuss.SERVER_ERROR).send({ message: error.message });
        Log("fetchQuizs", error, req.params?.userId)
    }
}

module.exports.updateTeacher = async function (req, res) {
    try {
        let { teacherId } = req.params;
        const { isActive } = req.body

        const message = isActive ? 'Activated SuccessFully' : 'De-Activated SuccessFully'

        teacherId = new ObjectId(teacherId)

        let searchParams = {}
        const payLoad = {
            isActive: isActive
        }

        let teachers = await teacherDao.updateTeacher(teacherId, payLoad)

        res.status(httpStatus.OK).send({ message: message, success: true, })

    } catch (error) {
        console.log(error, "error");

        res.status(httpStatus.SERVER_ERROR).send({ message: error.message });
        Log("fetchQuizs", error, req.params?.userId)
    }
}