// This is your test secret API key.
import  stripe from "stripe"
import express from "express";
const stripe = stripe('sk_test_51PngCWDnV1J5iPkhjADPh6ywXKK9PwrAq412HaqxXiALc3DP2BkvvWHchIjl2BsmKFIaJukq3zOFNojVCA3vxbvR003fr1OQRo');

// const express = require('express');
const app = express();
app.use(express.static('public'));

export  const session=async(req,res) => {
  const { userId, cinemaName, movieName, seats, price } = req.body;

  try {
    // Create a Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: movieName,
              description: `${cinemaName} - ${seats.join(", ")}`,
            },
            unit_amount: price * 100, // Price in smallest currency unit (e.g., paise)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    res.status(500).json({ error: "Failed to create Stripe session" });
  }
}
