const express = require('express');
const router = express.Router();

const asyncHandler = require('../utils/asyncHandler');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');
const Campsite = require('../models/campsite');
const campsites = require('../controllers/campsites');
const multer = require('multer');
const { storage }= require('../cloud');
const upload = multer({ storage });

const { isLoggedIn, validateCamp, isAuthor } = require('../loginMiddleware');


router.get('/' , asyncHandler(campsites.index));

router.get('/new', isLoggedIn, campsites.newForm);

router.post('/', isLoggedIn, upload.array('images'), validateCamp ,asyncHandler(campsites.createCampsite));

router.get('/:id', asyncHandler(campsites.showCampsite));

router.get('/:id/edit', isLoggedIn, isAuthor, asyncHandler(campsites.editForm));

router.put('/:id',isLoggedIn, isAuthor, upload.array('images'), validateCamp, asyncHandler(campsites.updateCampsite));

router.delete('/:id',isLoggedIn, isAuthor, asyncHandler(campsites.deleteCampsite));

module.exports = router;