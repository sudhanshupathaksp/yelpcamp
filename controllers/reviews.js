const Campsite = require('../models/campsite');
const Review = require('../models/review');

module.exports.createReview = async (req, res,) => {
    const campground = await Campsite.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/campsites/${campground._id}`);
}

module.exports.deleteReview = async (req,res) => {
    const { id , reviewId } = req.params;
    await Campsite.findByIdAndUpdate(id , { $pull : {reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted Successfully!');
    res.redirect(`/campsites/${id}`);
}