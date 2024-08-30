import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/booking.js";
import { StatusCodes } from "http-status-codes"; // Ensure you import StatusCodes

dotenv.config();

export const createpayment = async (req, res) => {
  try {
    const { userId, cinemaName, movieName, seats, price } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: movieName || "Default Movie Name",
              description: cinemaName || "Default Cinema Name",
            },
            unit_amount: price * 100, // Price in smallest currency unit (e.g., paise)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    //   metadata: {
    //     userId,
    //     cinemaName,
    //     movieName,
    //     seats: JSON.stringify(seats),
    //   },
    });

    // Save the booking only after the Stripe session is successfully created
    const booking = new Booking({
      user_id: userId,
      status: "confirmed",
      cinema: cinemaName,
      movie_id: movieName,
      // You can include seats if necessary
      // seat_id: seats.map(seat => ({
      //   row: seat.row,
      //   column: seat.column,
      // })),
    });
    await booking.save();

    // Send the session ID in the response
    res.status(StatusCodes.CREATED).json({ sessionId: session.id, booking });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
