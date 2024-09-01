import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/booking.js";
import movie from "../models/movie.js";
import Screen from "../models/screentime.js";

dotenv.config();

export const createpayment = async (req, res) => {
  try {
    const { userId, cinemaName, movieName, seats = [], price, screen_id } = req.body;

    console.log('Received seats:', seats);
    console.log('Price:', price);

    // Ensure seats is an array
    if (!Array.isArray(seats)) {
      return res.status(400).json({ error: "Seats must be an array" });
    }


    if (typeof price !== 'number' || isNaN(price)) {
      return res.status(400).json({ error: "Price must be a valid number" });
    }

    // Map seats to line items
    const line_items = seats.map(({ row, column }) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: movieName || "Default Movie Name",
          description: `Cinema: ${cinemaName} - Seat: ${row}-${column}`,
        },
        unit_amount: price * 100,
      },
      quantity: 1,
    }));

    console.log("Line items generated:", line_items);
    if (line_items.length === 0) {
      return res.status(400).json({ error: "No line items provided" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "https://showtimehub.vercel.app/success/:id",
      cancel_url: "https://showtimehub.vercel.app/cancel/:id",
      metadata: {
        userId: userId,
        cinemaName: cinemaName,
        movieName: movieName,
        screen_id: screen_id,
        seats: JSON.stringify(seats),
      },
    });
    console.log(session.metadata);

    console.log('Session created:', session.id);

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
export const afterconfirmation=async(req,res)=>{
 
  const bookingID = req.params.id;
console.log("Booking ID:", bookingID);

const book = await Booking.findById(bookingID).populate("status cinema");
console.log("Booking:", book);

if (!book) {
    return res.status(404).json({ message: "Booking not found" });
}

const screeid = await Screen.findOne({
  'showtimes._id': book.screen_id
}).populate('movieId showtimes');
console.log("Screen ID:", screeid);

if (!screeid) {
    return res.status(404).json({ message: "Screen not found" });
}

const movieid = await movie.findById(screeid.movieId).populate("Trailer");
console.log("Movie ID:", movieid);

res.status(200).json({ movieid, book, screeid });

 
}
export const deleteshowtime = async (req, res) => {
  try {
    const { id: showtimeId } = req.params;
    const screen = await Screen.findOne({ "showtimes._id": showtimeId });
    if (!screen) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    const updatedScreen = await Screen.findOneAndUpdate(
      { "showtimes._id": showtimeId },
      { $pull: { showtimes: { _id: showtimeId } } },
      { new: true }
    );
    if (updatedScreen.showtimes.length === 0) {
      await Screen.deleteOne({ _id: updatedScreen._id });
      return res.status(200).json({ message: "Showtime and Screen deleted" });
    }

    res.status(200).json({ updatedScreen });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const screeafterbooked = async (req, res) => {
  const { id: screenId } = req.params;
  console.log(screenId);
  try {
    const bookedSeats = await Booking.find({ screen_id: screenId })
      .select('seat_id.row seat_id.column -_id')
      .lean();

    res.json({
      bookedSeats: bookedSeats.map(booking => ({
        seat: booking.seat_id,  // Adjust if your seat structure is different
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error);
  }
};
