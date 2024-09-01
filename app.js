import express from "express";
import mongoose from "mongoose";
import connectDB from "./db/connect.js";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import adminroutes from "./routes/admin.js";
import cinemaroute from "./routes/cinema.js";
import movieroute from "./routes/movie.js";
import customerroutes from "./routes/customer.js";
import managerroutes from "./routes/manager.js";
import screenroute from "./routes/screen.js";
import Booking from "./models/booking.js";
import Customer from "./models/customer.js";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import Stripe from "stripe";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({
    verify: function (req, res, buf) {
        var url = req.originalUrl;
        if (url.startsWith('/api/screen/webhooks')) { 
            req.rawBody = buf.toString();
        }
    }
}));
app.post("/api/screen/webhooks", express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { userId, cinemaName, movieName, screen_id, seats,movie_id } = session.metadata;
            let parsedSeats;
            try {
                parsedSeats = JSON.parse(seats);
            
            } catch (error) {
                console.error("Error parsing seats metadata:", error);
                return res.status(400).json({ error: "Invalid seats format" });
            } console.log(parsedSeats);

            const booking = new Booking({
                user_id: userId,
                status: "confirmed",
                cinema: cinemaName,
                moviename: movieName,
                screen_id: screen_id,
                seat_id: parsedSeats,
                movie_id:movie_id,
                total_price: session.amount_total / 100, 
            }); console.log(booking);
            const successUrl = `https://showtimehub.vercel.app/success/${booking._id}`;
            const cancelUrl = `https://showtimehub.vercel.app/cancel/${booking._id}`;

            try {
                await booking.save();
                console.log("Booking successfully saved!");
            } catch (error) {
                console.error("Error saving booking:", error);
                return res.status(500).json({ error: "Booking save failed" });
            }
            
            const updatedSession = await stripe.checkout.sessions.update(session.id, {
                success_url: successUrl,
                cancel_url: cancelUrl,
            });


           
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
                port: 465,
                secure: true,
                host: 'smtp.gmail.com',
            });

            try {
                const user = await Customer.findById(userId);
                const confirmationEmail = {
                    from: process.env.EMAIL_USERNAME,
                    to: user.email,
                    subject: 'Booking Confirmation - BookMyShow',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                          <h1 style="color: #854CE6; text-align: center;">Booking Confirmation</h1>
                          <p>Thank you for your booking!</p>
                          <p><strong>Movie:</strong> ${movieName}</p>
                          <p><strong>Cinema:</strong> ${cinemaName}</p>
                          <p><strong>Showtime:</strong> ${new Date().toLocaleString()}</p>
                          <p><strong>Seats:</strong> ${parsedSeats.map(seat => `${seat.row}-${seat.column}`).join(', ')}</p>
                          <p><strong>Total Amount:</strong> ₹${session.amount_total / 100}</p>
                          <p>Your booking is confirmed. Enjoy the show!</p>
                          <p>Best regards,<br>The BookMyShow Team</p>
                        </div>
                    `,
                };

                await transporter.sendMail(confirmationEmail);
                res.status(201).json({ sessionId: session.id, booking });

            } catch (error) {
                console.error("Error sending email:", error);
                res.status(500).send({ message: "Failed to send confirmation email" });
            }
        } else {
            res.json({ received: true });
        }
    } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
});


// Other middlewares and routes
app.use(cors({ credentials: true, origin: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Define routes
app.use("/api/screen", screenroute);
app.use("/api/customer", customerroutes);
app.use("/api/cinema", cinemaroute);
app.use("/api/movie", movieroute);
app.use("/api/admin", adminroutes);
app.use("/api/manager", managerroutes);

// Error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

// Start server
const start = async () => {
    try {
        mongoose.set("strictQuery", false);
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => {
            console.log(`Server is running at ${port}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

start();
