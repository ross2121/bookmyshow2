import mongoose from "mongoose";
import Movie from "../models/movie.js";
import Manager from "../models/manager.js";
import badrequest from "../errors/badrequest.js";
import notfound from "../errors/notfound.js";
import { StatusCodes } from "http-status-codes";
import Screen from "../models/screentime.js";
import Cinema from "../models/cinema.js";

export const createMovie=async(req,res)=>{
    const{title, posterUrl,releaseDate,genre}=req.body;
    req.body.Agent=Manager._id;
    // const user=await User.findById(req.user.id);
    if(!title||!posterUrl||!releaseDate||!genre){
        throw new badrequest("Please provode  all values");
    }
    const movie=await Movie.create(req.body);
    res.status(StatusCodes.CREATED).json({Movie: movie});
};
export const updatemovie=async(req,res)=>{
    const { id: movieId } = req.params; 
    const { title,genre,director,releaseDate } = req.body;
    if (!name || !Address) {
        throw new badrequest('Please provide all values');
    }
    const cinema = await Movie.findOne({ _id: movieId });  
    if (!cinema) {
        throw new NotFoundError(`No cinema with id: ${movieId}`);
    }
    const updateMovie = await Movie.findOneAndUpdate(
        { _id: movieId },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(StatusCodes.OK).json({ updateMovie });
};
export const deletemovie=async(req,res)=>{
     const {id:MovieId}=req.params;
    const property=Movie.findById(MovieId);
    if(!property){
        throw new notfound("No movie is found");
    }
    const deleatemovie=await Movie.findByIdAndDelete(MovieId);
        req.status(StatusCodes.OK).json({ deleatemovie});
    
}
export const getallmovie=async(req,res,next)=>{
    try{
         const property=await Movie.find().populate("title genre director");
         return res.status(200).json(property);
    }catch(err){
        next(err);
    }
};
export const getmoviebyId=async(req,res,next)=>{
    try {
        const property=await Movie.findById(req.params.id).populate("title genre director");
        res.status(200).json(property);
    } catch (err) {
        next(err);
    }
}
// export const getseat=async(req,res,next)=>{
//     try { 
//      const screentime=await Screen.findById(req.params.id).populate("screenId");
//       if (!screentime) {
//         return res.status(404).json({ message: 'Showtime not found' });
//       }
//       const screenId = screentime.screenId;
//       const cinema = await cinema.findOne({ 'screens._id': screenId });
//       if (!cinema) {
//         return res.status(404).json({ message: 'Cinema not found' });
//       }
//       const screen = cinema.screens.id(screenId);
//       if (!screen) {
//         return res.status(404).json({ message: 'Screen not found' });
//       }
//       const screenData = {
//         rows: screen.rows,
//         columns: screen.columns,
//         price: screen.price,
//         projectiontype:screen.projectionType,
//         soundtype:screen.soundType,
//       };
  
//       res.status(200).json(screenData);
//     } catch (error) {
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
  
  
export const getCinemaDetails = async (req, res) => {
    try{  const movie=req.params.id;
        // console.log(movie);
     const moviename=await Movie.findById(movie);
    //  console.log(moviename);
     const screentime=await Screen.find({movieId:movie});
    //  console.log(screentime);
     if (!screentime) {
       return res.status(404).json({ message: 'Showtime not found' });
     }
     const screenIds = screentime.map(screen => screen.screenId);
     console.log(screenIds);
  const cinemain=await Cinema.find({'screens._id':screenIds})
  if (!Cinema) {
     return res.status(404).json({ message: 'Cinema not found' });
   }
   console.log(cinemain);
   const cinemadat = cinemain.map(cinema => {
    // Find the showtimes for the current cinema
    const cinemaShowtimes = screentime.filter(screen => screen.screenId === cinema.screens[0]._id.toString());
    
    return {
        moviename: moviename.title,
        name: cinema.name,
        address: cinema.Address,
        screenid:screenIds[0],
        time: cinemaShowtimes.map(screen => screen.showtimes) || 'No showtime available',
    };
});
 
   res.status(200).json(cinemadat)
 } catch (error) {
     res.status(500).json({message:'servore eror'})
 }}