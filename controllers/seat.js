import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/booking.js";

dotenv.config();

export const createpayment = async (req, res) => {
  try {
    const { userId, cinemaName, movieName, seats, price, screen_id } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    //   metadata: {
    //     userId: userId,
    //     // userEmail: userEmail,  
    //     cinemaName: cinemaName,
    //     movieName: movieName,
    //     screen_id: screen_id,
    //     // seats: row-column, 
    //   },
    });

    // const booking = new Booking({
    //   user_id: userId,
    //   status: "confirmed",
    //   cinema: cinemaName,
    //   movie_id: movieName,
    //   screen_id: screen_id,
    //   seat_id: seats.map(seat => ({ row: seat.row, column: seat.column })),
    // });
    // await booking.save();

    // // Send booking confirmation email
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    //   port: 465,
    //   secure: true,
    //   host: 'smtp.gmail.com',
    // });
    // const user=await Customer.findOne({_id:userId});
    // console.log(user);
    // const emails=user.email;
    // const confirmationEmail = {
    //   from: process.env.EMAIL_USERNAME,
    //   to: emails,
    //   subject: 'Booking Confirmation - BookMyShow',
    //   html: `
    //     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
    //       <h1 style="color: #854CE6; text-align: center;">Booking Confirmation</h1>
    //       <p>Thank you for your booking!</p>
    //       <p><strong>Movie:</strong> ${movieName}</p>
    //       <p><strong>Cinema:</strong> ${cinemaName}</p>
    //       <p><strong>Showtime:</strong> ${new Date().toLocaleString()}</p>
    //       <p><strong>Seats:</strong> ${seats.map(seat => `${seat.row}-${seat.column}`).join(', ')}</p>
    //       <p><strong>Total Amount:</strong> ₹${price}</p>
    //       <p>Your booking is confirmed. Enjoy the show!</p>
    //       <p>Best regards,<br>The BookMyShow Team</p>
    //     </div>
    //   `,
    // };
    // transporter.sendMail(confirmationEmail, (err) => {
    //   if (err) {
    //     console.error("Error sending email:", err);
    //     return res.status(500).send({ message: "Failed to send confirmation email" });
    //   } else {
    //     return res.status(StatusCodes.CREATED).json({ sessionId: session.id, booking });
    //   }
    // });

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
        seat: booking.seat_id,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.log(error);
  }
};
