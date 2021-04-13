const Campsite = require('../models/campsite');
const { cloudinary } = require('../cloud');
const mbgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCode =  mbgeocoding({ accessToken: mapBoxToken});

module.exports.index = async (req,res) => {
    const cs = await Campsite.find({});
    res.render('campground/index' , { cs })
}

module.exports.newForm = (req,res) => {
    res.render('campground/new')
}

module.exports.createCampsite = async (req,res,next) => {
   // if(!req.body.campground) throw new ExpressError('Invalid campsite details', 400)

    const response = await geoCode.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
        
    }).send()
    const campground = new Campsite(req.body.campground);
    campground.geometry = response.body.features[0].geometry;
    campground.Images = req.files.map(f => ({ url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Succesfully made a new Campsite!')
    res.redirect(`/campsites/${campground._id}`)
}

module.exports.showCampsite = async (req,res) => {
    const campground = await Campsite.findById(req.params.id).populate(
        { 
            path: 'reviews',
            populate:{
                path:'author'
            }
        }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot Find Campsite');
        return res.redirect('/campsites');
    }
    res.render('campground/show', { campground })
}

module.exports.editForm = async (req,res) => {
    const {id} = req.params;
    const campground = await Campsite.findById(id);
    if(!campground) {
         req.flash('error', 'Cannot Find Campsite');
       return res.redirect('/campsites');
    }    
    res.render('campground/edit', { campground });
}

module.exports.updateCampsite = async (req,res) => {
    const { id } = req.params;
    const campground = await Campsite.findByIdAndUpdate(id , {...req.body.campground})
    const img = req.files.map(f => ({ url: f.path, filename: f.filename}));
    campground.Images.push(...img);
    await campground.save();
    if(req.body.deleteImages) {
         for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await campground.updateOne({ $pull : { Images: { filename: { $in : req.body.deleteImages}}}});
       console.log(campground);
    }
     req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campsites/${campground._id}`);
}

module.exports.deleteCampsite = async (req,res) => {
    const { id } = req.params;
    await Campsite.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campsites')
}