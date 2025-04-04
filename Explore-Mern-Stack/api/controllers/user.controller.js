import { errorHandler } from "../utils/error.js";  // ✅ Fixed: Added `.js`
import bcrypt from "bcryptjs";  // ✅ Fixed: Corrected bcryptjs import
import User from "../models/user.model.js";  // ✅ Make sure User model is imported
import Listing from "../models/listing.model.js"

export const test = (req, res) =>{
    res.json({
        message: 'Api routes is working!',
    });
};


export const updateUser = async(req, res, next) =>{
    console.log("Request Received for User ID:", req.params.id);
    console.log("Received Data from Frontend:", req.body);
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only update your own account!'))

        try {
           if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10)
           } 

           const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set:{
               username: req.body.username,
               email: req.body.email,
               password: req.body.password,
               avatar: req.body.avatar,
            }

           }, {new: true})

           const {password, ...rest} = updatedUser._doc

           res.status(200).json(rest);
        } catch (error) {
            next(error)
            
        }

};


export const deleteUser = async(req, res, next) =>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account'))
        try {
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json('User han been deleted!')
        } catch (error) {
            next(error)
        }
}

export const getUserListings = async (req, res) => {
    try {
      const listingId = req.params.id; // Get listing ID from URL params
      const listing = await Listing.findById(listingId); // Find listing by ID
  
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
  
      res.status(200).json(listing);
    } catch (error) {
      res.status(500).json({ message: "Error fetching listing", error: error.message });
    }
  };



  export const getUser = async (req, res, next) => {
    try {
       const user = await User.findById(req.params.id);
    if(!user) return next(errorHandler(404, 'User not found'));
  
    const {password: pass, ...rest} = user._doc
    res.status(200).json(rest)
    } catch (error) {
      next(error)
    }
   
    
  }