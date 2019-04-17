const mongoose = require('mongoose');
const Assessment = mongoose.model('Assessment');
const { validationResult } = require('express-validator/check');


//retrieve all the assessments of a user
exports.getAssessments = (req, res) => {
    const userId = mongoose.Types.ObjectId(req.user.id);
    const assessment = Assessment.find({  userId: userId }).exec();

    assessment.then((document) => {
        let message = document ? 'Assessments found' : 'No assessments were created';
        let data = document ? document :[];
        res.status(200).json({ message: message, data: data  });
    }).catch(error => {
        res.status(500).json({ message: 'Internal server error' });
    });

};

//get an assessment by given id
exports.getAssessment = (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const userId = mongoose.Types.ObjectId(req.user.id);
    const assessment = Assessment.findOne({ assessmentId: req.params.assessmentId, userId: userId }).exec();

    assessment.then(document => {
        if (!document) {
            res.status(404).json({ "message": "Assessment detail not found", data: [] });
        }
        res.status(200).json({ message: "Assessment found", data: document });
    }).catch(error => {
        if (error.name === 'CastError') {
            let error = [{ "location": "body", "param": "assessmentId", "value": req.params.assessmentId, "msg": "Assessment already exists" }];
            res.status(422).json({ 'message': 'Please enter a correct assessment id (Eg. 1943)' });
        }
    });
};

//create a new assessment
exports.createAssessment = (req, res) => {

    //validate & sanitize the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    //access the userID from the request
    const userId = mongoose.Types.ObjectId(req.user.id);

    //destructuring to avoid mass assignment
    const { assessmentId, vendorName, safety, safetyComment, quality, qualityComment, Notes } = req.body;

    const newAssessment = new Assessment({ assessmentId, vendorName, safety, safetyComment, quality, qualityComment, Notes, userId });

    //create new assessment
    newAssessment.save()
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

//delete an assessment
exports.deleteAssessment = (req, res) => {
    //validate & sanitize the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const assessmentId = req.params.assessmentId;
    const userId = mongoose.Types.ObjectId(req.user.id);



    Assessment.findOneAndDelete({ assessmentId: assessmentId, userId: userId }, function (error, document) {
        if (error) res.status(500).json({ message: 'Internal server error' });
     
        if (document) {
            res.status(200).json({ message: 'Assessment deleted successfully', data: document });
        } else {
            res.status(404).json({ message: 'No matching assessment found', data: [] });
        }
    });

};

//update an existing assessment
exports.updateAssessment = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    //access the userID from the request
    const userId = mongoose.Types.ObjectId(req.user.id);
    const assessmentId =req.params.assessmentId;
    //destructuring to avoid mass assignment
    const { vendorName, safety, safetyComment, quality, qualityComment, Notes } = req.body;

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