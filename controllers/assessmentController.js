const mongoose = require('mongoose');
const errorHandler = require('../errorHandler');
const Assessment = mongoose.model('Assessment');
const { validationResult } = require('express-validator/check');

exports.getAssesments = (req, res) => {
    res.send('TO BE IMPLEMENTED');
};

//get an assessment given an id
exports.getAssesment = (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const assessment = Assessment.findOne({ assessmentId: req.params.id }).exec(); 
    
    assessment.then(document => {
        if (!document) {
            res.status(404).json({ "message": "Assessment detail not found" });
        }
        res.status(200).json({ message: "Assement found", data: document });
    }).catch(error => {
        if (error.name === 'CastError') {
            res.status(422).json({ 'message': 'Please enter a correct assessment id (Eg. 1943)' });
        }
    });
};

//create a new assessment
exports.createAssesment = (req, res) => {

    //validate & sanitize the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    //destructuring to avoid mass assignment
    const {assessmentId, vendorName, safety, safetyComment,quality,qualityComment,Notes} = req.body;
    
    const newAssesment = new Assessment({assessmentId,vendorName,safety,safetyComment,quality,qualityComment,Notes});
    
    newAssesment.save()
        .then((document) => res.json({ status: 200, message: 'Assessment created successfully', data: document }))
        .catch(error => {
            let message = errorHandler.getErrorMessage(error);
            res.status(500).json({ status: 500, message: message });
        });
};
