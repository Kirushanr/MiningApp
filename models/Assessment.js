const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assesmentSchema = new mongoose.Schema({

    assessmentId: {
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
        required : true
    },
    qualityComment:{
        type: String,
        max : 150,
        required: true
    },
    Notes:{
        type: String,
    },
    userId: {type: Schema.Types.ObjectId, ref: 'User', required:true},
});

module.exports = mongoose.model('Assessment', assesmentSchema);