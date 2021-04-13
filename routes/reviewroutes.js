const express = require('express');
const router = express.Router({ mergeParams:true });
const Campsite = require('../models/campsite');
const Review = require('../models/review');
const asyncHandler = require('../utils/asyncHandler');
const ExpressError = require('../utils/ExpressError'); 
const { validateReview, isLoggedIn, isReviewAuthor } = require('../loginMiddleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, asyncHandler(reviews.createReview));

router.delete('/:reviewId',isLoggedIn, isReviewAuthor, asyncHandler(reviews.deleteReview));

module.exports = router;