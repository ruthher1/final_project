const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
    },
    comment: {
        type: String,
    },
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    connectionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Connection',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    file: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File', 
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Task', taskSchema)