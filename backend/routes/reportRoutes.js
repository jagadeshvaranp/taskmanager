const express = require('express');
const router = express.Router();
const{protect,adminonly} = require('../middleware/authMiddleware')
const { exportTasksReport, exportUsersReport } = require('../controller/reportController');

router.get("/export/tasks",protect,adminonly,exportTasksReport); //export all task as excel /pdf
router.get("/export/users",protect,adminonly,exportUsersReport); //export all users as excel /pdf
module.exports = router;