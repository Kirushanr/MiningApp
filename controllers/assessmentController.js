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
            res.status(404).json({ "message": "Assessment detail not found", data:[] });
        }
        res.status(200).json({ message: "Assessment found", data: document });
    }).catch(error => {
        if (error.name === 'CastError') {
            let error = [{ "location": "body", "param": "assessmentId", "value": req.params.id, "msg": "Assessment already exists" }];
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

    //access the userID from the request
    const userId = mongoose.Types.ObjectId(req.user.id);

    //destructuring to avoid mass assignment
    const { assessmentId, vendorName, safety, safetyComment, quality, qualityComment, Notes } = req.body;

    const newAssesment = new Assessment({ assessmentId, vendorName, safety, safetyComment, quality, qualityComment, Notes, userId });

    //create new assesment
    newAssesment.save()
        .then((document) => res.status(200).json({ message: 'Assessment created successfully', data: document }))
        .catch(error => {

            if (error.name === 'MongoError' && error.code === 11000) {
                let error = [{ "location": "body", "param": "assessmentId", "value": assessmentId, "msg": "Assessment already exists" }];
                res.status(422).json({ errors: error });
            }
            else {

                res.status(500).json({ message: 'Internal server error' });
            }

        });
};

exports.deleteAssesment = (req, res) =>{
    //validate & sanitize the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const assessmentId  = req.params.id;
    const userId = mongoose.Types.ObjectId(req.user.id);
    console.log(userId + " " + assessmentId);

    
    Assessment.findOneAndDelete({ assessmentId: assessmentId, userId: userId }, function (error, document) {
        if (error) res.status(500).json({ message: 'Internal server error' });
        console.log(document)
        if (document) {
            res.status(200).json({ message: 'Assessment deleted successfully', data:document});
        } else {
            res.status(404).json({ message: 'No matching assessment found', data:[] });
        }
    });

};

exports.updateAssessment = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //access the userID from the request
    const userId = mongoose.Types.ObjectId(req.user.id);

    //destructuring to avoid mass assignment
    const { assessmentId, vendorName, safety, safetyComment, quality, qualityComment, Notes } = req.body;

    Assessment.findOneAndUpdate({ userId: userId, assessmentId: assessmentId }, { vendorName, safety, safetyComment, quality, qualityComment, Notes },
        { new: true }, function (error, document) {
            if (error) res.status(500).json({ message: 'Internal server error' });

            if (document) {
                res.status(200).json({ message: 'Assessment updated successfully', data: document });
            }
            else {
                res.status(404).json({ message: 'Assessment not found', data: [] });
            }
        });
};