// This is your test secret API key.
import  stripe from "stripe"
import express from "express";
const stripe = stripe('sk_test_51PngCWDnV1J5iPkhjADPh6ywXKK9PwrAq412HaqxXiALc3DP2BkvvWHchIjl2BsmKFIaJukq3zOFNojVCA3vxbvR003fr1OQRo');

// const express = require('express');
const app = express();
app.use(express.static('public'));

export  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
    
        price: '{{PRICE_ID}}',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`, 
  });
  res.redirect(303, session.url);
;

app.listen(4242, () => console.log('Running on port 4242'));