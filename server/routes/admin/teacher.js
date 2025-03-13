const express = require('express');
const router = express.Router();
const { userAuthentication } = require('../../utils/authentication');
const teacherController = require('../../controller/admin/teacher');

router.get("/", userAuthentication, teacherController.getTeachers)
router.get("/:teacherId", userAuthentication, teacherController.getTeacherDetails)
router.put("/:teacherId", userAuthentication, teacherController.updateTeacher)

module.exports = router;