/*jshint esversion:6*/
var express = require('express');
var router = express.Router();
const User = require('../models/user');
const upload = require('../configs/multer');
const Consumer = require("../models/consumer");
const Promoter = require("../models/promoter");

const mongoose      = require('mongoose');

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


/* GET a User. */
router.get('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  User.findById(req.params.id, (err, Users) => {
      if (err) {
        return res.send(err);
      }

      return res.json(Users);
    });
});

// image: req.file.path
/* UPDATE a User. upload.single('file'), */
router.post('/edit', (req, res) => {
    // console.log('Hola here user: ', req.body);
    User.findByIdAndUpdate(req.body.userData._id, {
        name: req.body.updatedData.name,
        username: req.body.updatedData.username,
        postcode: req.body.updatedData.postalcode
    })
    .then((user) => {
        var newConsumer = new Consumer({
            interests: req.body.interests,
            birthdate: req.body.updatedData.birthday,
            gender: req.body.updatedData.gender
        });
        newConsumer.save((err, consumer) => {
            if(err){
                return res.status(500).json({message:"Error"});
            }
            user.consumer = consumer._id;
            console.log("Created consumer: " + consumer);
            user.save((err)=> {
                if (err) {
                    console.log('Error HERE!!!!!: ', err);
                    return res.status(500).json({message:"Error on saving consumer"});
                } else {
                    console.log('User!!!! HERE!!!!: ', user);
                    return res.status(200).json({message:"Saved Consumer data"});
                }
            });
        });
    });
});

router.post('/picupload/:id', upload.single('file'), (req, res) => {
    console.log("Uploading file for user: " + req.params.id);
    console.log('THIS IS PICUPLOAD: ', req.file.path);
    User.findByIdAndUpdate(req.params.id, {
        image: req.file.path
    })
    .then( (user) => {
        console.log('HAAAA   LLLEGADO ');
    });
    return res.json({
        message: 'Picture uploaded',
        image: req.file.path
    });
});


/* UPDATE a Promoter. */
router.post('/promoedit', (req, res) => {
    console.log('Here Promoter Data: ', req.body);
    User.findByIdAndUpdate(req.body.userData._id, {
        name: req.body.updatedData.name,
        username: req.body.updatedData.username,
        postcode: req.body.updatedData.postalcode
    })
    .then((user) => {
        console.log("interests", req.body.interests);
        console.log("promoterType", req.body.updatedData.promoterType);
        var newPromoter = {
            interests: req.body.interests,
            promoterType: req.body.updatedData.promoterType
        };
        Promoter.create(newPromoter, (err, promoter) => {
            console.log("inside create promoter - interests", req.body.interests);
            if (err) console.log("There was an error ", err);
            return res.status(200).json({
                messsage:"Saved Promoter data",
                interests: req.body.interests
                });
        });
    });
});


// update the user

router.post('/updated', (req,res, next) => {
    console.log('This is ID data in updated: ', req.body.userid);
    console.log('This is user-info-new!!!!! ',req.body.edited);
    var salt     = bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(req.body.edited.password, salt);
    User.findByIdAndUpdate(req.body.userid, {
        name: req.body.edited.name,
        username: req.body.edited.username,
        email: req.body.edited.email,
        password: hashPass
    },{new: true})
    .exec((err, user) => {
        if (err) { console.log(err);return;}
        if (!user) {
            console.log("there is no user");
            return;
        } else{
        return res.status(200).json(user);
        }
    });

});



router.post('/videoload/:id', upload.single('file'), (req, res) => {
    console.log("Uploading file for user: " + req.params.id);
    console.log('THIS IS VIDEEOOOO UPLOAD: ', req.file.path);
    User.findByIdAndUpdate(req.params.id, {
        video: req.file.path
    })
    .then( (user) => {
        console.log('HAAAA   LLLEGADO ');
    });
    return res.json({
        message: 'Picture uploaded',
        video: req.file.path
    });
});


/* DELETE a User. */
router.delete('/:id', (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Specified id is not valid' });
  }

  User.remove({ _id: req.params.id }, (err) => {
    if (err) {
      return res.send(err);
    }

    return res.json({
      message: 'User has been removed!'
    });
    });
});


module.exports = router;
