import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/booking.js";

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
        unit_amount: price * 100, // Stripe expects amount in the smallest currency unit (paise for INR)
      },
      quantity: 1,
    }));

    console.log("Line items generated:", line_items);

    // Check if any line items were created
    if (line_items.length === 0) {
      return res.status(400).json({ error: "No line items provided" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
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
