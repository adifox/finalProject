/*jshint esversion:6*/
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const promoterSchema = new Schema({
    promoterType: { type: String, enum:["private","company"],
    },
    interests: [{type: String}]
});

module.exports = mongoose.model("Promoter", promoterSchema);
