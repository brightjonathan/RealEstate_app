import mongoose from 'mongoose';


const listingSchema  = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    regularPrice: {
        type: Number,
        require: true,
    },
    discountPrice: {
        type: Number,
        require: true,
    },
    bathRooms: {
        type: Number,
        require: true,
    },
    bedRooms: {
        type: Number,
        require: true,
    },
    furnished:{
        type:Boolean,
        require:true
    },
    parking: {
        type:Boolean,
        require: true,
    },
    type: {
        type: String,   //type means RENTED OR SELLs
        require: true,
    },
    offer: {
        type: Boolean,  //offer means OFFER OR NOT
        require: true,
    },
    imageUrls: {
        type: Array,
        require: true,
    },
    userRef: {
        type: String,
        require: true,
    },
}, {timestamps: true});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;
