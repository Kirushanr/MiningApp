const express = require('express');
const router = express.Router();
const assessment= require('../controllers/assessmentController'); 
const {validate} = require('../validator');
const {verifyToken} = require('../auth/token');


router.get('/assessments',[verifyToken,assessment.getAssessments]);

router.get('/assessments/:id',[verifyToken,validate('AssessmentId'),assessment.getAssessment]);

router.post('/assessments',[verifyToken,validate('Assessment'),assessment.createAssessment]);

router.delete('/assessments/:id',[verifyToken,validate('AssessmentId'),assessment.deleteAssessment]);

router.put('/assessments/:id',[verifyToken,validate('Assessment'),assessment.updateAssessment]);

module.exports = router;
