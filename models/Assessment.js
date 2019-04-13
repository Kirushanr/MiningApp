const mongoose = require('mongoose');

const assesmentSchema = new mongoose.Schema({

    assesmentId: {
        type: Number,
        unique: true,
        required:true
    },
    vendorName: {
        type: String,
        required: true,
        trim: true
    },
    safety: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    safetyComment: {
        type: String,
        max : 150,
        required: true
    },
    quality:{
        type : String,
        enum : ['Bad', 'Average', 'Good', 'Excellent'],
        required : true
    },
    qualityComment:{
        type: String,
        max : 150,
        required: true
    },
    Notes:{
        type: String,
    }
});

module.exports = mongoose.model('Assessment', assesmentSchema);