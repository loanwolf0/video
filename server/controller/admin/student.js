const ObjectId = require('mongoose').Types.ObjectId;
const studentDao = require('../../dao/admin/student.js');
const { httpStatus } = require('../../helper/constants.js');


module.exports.getStudents = async function (req, res) {
    try {
        let students = await studentDao.getStudents(req.query.skip, req.query.limit, req.query.title)
        const studentsCounts = await studentDao.getStudentsCounts(req.query.title)
        res.status(httpStatus.OK).send({ message: "Found data related to Student'", success: true, students, studentsCounts })

    } catch (error) {
        console.log(error, "error");

        res.status(httpStatus.SERVER_ERROR).send({ message: error.message });
        Log("getStudents", error, req.params?.userId)
    }
}

module.exports.getStudentDetails = async function (req, res) {
    try {
        let { studentId } = req.params
        studentId = new ObjectId(studentId)

        let studentDetails = await studentDao.getStudentDetails(studentId)

        res.status(httpStatus.OK).send({ message: "Found data related to Teacher'", success: true, studentDetails })

    } catch (error) {
        console.log(error, "error");
        res.status(httpStatuss.SERVER_ERROR).send({ message: error.message });
        Log("studentDetails", error, req.params?.userId)
    }
}

module.exports.updateStudent = async function (req, res) {
    try {
        let { studentId } = req.params;
        const { isActive } = req.body

        const message = isActive ? 'Activated SuccessFully' : 'De-Activated SuccessFully'

        studentId = new ObjectId(studentId)

        let searchParams = {}
        const payLoad = {
            isActive: isActive
        }

        let Students = await studentDao.updateStudent(studentId, payLoad)
        res.status(httpStatus.OK).send({ message: "Found data related to Teacher'", success: true })

    } catch (error) {
        console.log(error, "error");

        res.status(httpStatus.SERVER_ERROR).send({ message: error.message });
        Log("updateStudent", error, req.params?.userId)
    }
}