const mongoose = require('mongoose');

const StudyLogSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    study_hours : {
        type : Number,
        required : true
    },
    sleep_hours : {
        type : Number,
        required : true
    },
    breaks_taken : {
        type : Number,
        required : true
    },
    attendance : {
        type : Number,
        required : true
    },
    past_score : {
        type : Number,
    },
    predicted_score : {
        type : Number,
    },
    cluster_label : {
        type : String,
    },
    recommendations : {
        type : [String],
    },
    date : {
        type : Date,
        default : Date.now
    }
});

const StudyLog = mongoose.model('StudyLog', StudyLogSchema);

module.exports = StudyLog;