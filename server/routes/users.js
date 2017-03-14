/*jshint esversion:6*/
var express = require('express');
var router = express.Router();
const User = require('../models/user');
const upload = require('../configs/multer');
const Consumer = require("../models/consumer");
const Promoter = require("../models/promoter");

const mongoose      = require('mongoose');


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
            console.log("Created consumer: " + consumer);
            return res.status(200).json({message:"Saved Consumer data"});
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
            console.log("inside create promoter¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶¶");
            if (err) console.log("There was an error ", err);
            return res.status(200).json({messsage:"Saved Promoter data"});
        });
    });
});

// router.post('/', upload.single('file'), function(req, res) {
//   const phone = new Phone({
//     name: req.body.name,
//     brand: req.body.brand,
//     image: `/uploads/${req.file.filename}`,
//     specs: JSON.parse(req.body.specs) || []
//   });
//        // image: req.file.path
//   phone.save((err) => {
//     if (err) {
//       return res.send(err);
//     }
//
//     return res.json({
//       message: 'New Phone created!',
//       phone: phone
//     });
//   });
// });



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
