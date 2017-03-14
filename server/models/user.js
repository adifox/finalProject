/*jshint esversion:6*/
const Consumer = require("./consumer");
const Promoter = require("./promoter");
const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    email:          String,
    password:       String,
    name:           String,
    username:       String,
    postcode:       String,
    image:          String,
    consumer: { type: Schema.Types.ObjectId, ref: 'Consumer' },
    promoter: { type: Schema.Types.ObjectId, ref: 'Promoter' }},
{   timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});


const User = mongoose.model("User", userSchema);
module.exports = User;
