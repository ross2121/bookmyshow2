import Seats from "../models/seats";
import Payment from "../models/payment";
import Booking from "../models/booking";
import badrequest from "../errors/badrequest";
import notfound from "../errors/notfound";
 

const processPayment=(paymentDetails)=> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const success = Math.random() > 0.2;
            resolve(success);
        }, 2000);
    });
}
export const seatbooking=async(req,res)=>{
    const {seat_id,paymentDetails,booking_id,user_id}=req.params;
    if(!seat_id||!paymentDetails||booking_id||user_id){
throw new badrequest("Error in the ticket");
    }
    const seat=Seats.findById(seat_id);
    if(seat.status==="Booked"){
        throw new notfound("Ticket is alredy booked");
    }
    seat.status==="Pending";
    await seat.save();
    const booking=new Booking({
        user_id,
        seat_id,
       status:"Pending"
    })
    booking.save();
    const paymentSuccess = await processPayment(paymentDetails); 
    if (paymentSuccess) {
        booking.status = 'confirmed';
        await booking.save();
        seat.status = 'booked';
        await seat.save();
        const payment = new Payment({
            bookingId: booking._id,
            status: 'completed',
            amount: paymentDetails.amount,
            paymentMethod: paymentDetails.method
        });
        await payment.save();
}
else{
    seat.status = 'available';
    await seat.save();

    await Booking.findByIdAndDelete(booking._id); 

    return res.status(400).json({ message: 'Payment failed, seat released' });
}
}