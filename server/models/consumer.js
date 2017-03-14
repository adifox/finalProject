/*jshint esversion:6*/
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const consumerSchema = new Schema({
    interests: [{type: String}],
    birthdate:      { type: Date },
    gender: { type: String, enum:["female","male"]}
});
module.exports = mongoose.model("Consumer", consumerSchema);
