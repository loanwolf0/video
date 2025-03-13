const express = require('express');
const router = express.Router();
const { userAuthentication } = require('../../utils/authentication');
const studentController = require('../../controller/admin/student');

router.get("/", userAuthentication, studentController.getStudents)
router.get("/:studentId", userAuthentication, studentController.getStudentDetails)
router.put("/:studentId", userAuthentication, studentController.updateStudent)

module.exports = router;