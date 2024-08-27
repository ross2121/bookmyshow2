import Stripe from "stripe"
import dotenv from "dotenv";
dotenv.config();
export const createpayment=async(req,res)=>{
    try {
        const { userId, seats, price } = req.body;
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        // Create a new Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Cinema Booking for ${seats.length} seats`,
                        },
                        unit_amount: price * 100, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: "http://localhost:3000",
            cancel_url: "http://localhost:3000",
            metadata: {
                userId: userId,
                seats: JSON.stringify(seats),
            },
        });

        // Send the session ID back to the client
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};