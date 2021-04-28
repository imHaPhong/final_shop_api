const mongoose = require('mongoose');

const postReportSchema = new mongoose.Schema({
    uId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User"
    },
    pId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Posts"
    },
    content: {
        type: String,
        required: true,
    }
})

const PostReport = mongoose.model("PostReport", postReportSchema)

module.exports =PostReport