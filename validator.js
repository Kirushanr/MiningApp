/**
 * Middleware to validate  
 * user inputs
 */
const { check } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');
const { body } = require('express-validator/check');

exports.validate = (method) => {
    switch (method) {
        case 'Assessment': {
            return [
                body('assessmentId')
                .isInt().withMessage('Please enter a valid assessment number E.g. 19465 '),
                
                body('vendorName').not()
                .isEmpty().withMessage('Please enter vendor name').trim().escape(),

                body('safety')
                .isInt({gt: 0, lt: 6}).withMessage('Safety value must be between 1-5'),

                body('safetyComment').not()
                .isEmpty().withMessage('Please enter your comment on safety')
                .isLength({max:150}).withMessage("Safety cannot exceed 150 characters")
                .trim().escape(),

                body('quality').isIn(['Bad', 'Average', 'Good', 'Excellent'])
                .withMessage('Enter a quality (Bad, Average, Good or Excellent)')
                .trim().escape(),

                body('qualityComment').not()
                .isEmpty().withMessage('Please enter your comment on quality')
                .isLength({max:150}).withMessage("Safety comment should not exceed 150 characters")
                .trim().escape(),

                body('Notes').trim().escape()

            ];
            
        }
        case 'AssessmentId':{
            return [
                check('id').isInt().withMessage('Please enter a valid assessment number E.g. 19465 ')
            ];
        }
    }
};

