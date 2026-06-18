    import React from 'react'
import Title from './Title';
import { assets } from '../assets/assets';
    
    const Testimonial = () => {
        const testimonials = [
        {   name: "Emma Rodriguez", 
            address: "Barcelona, Spain", 
            image: assets.testimonial_image_1, 
            rating: 5, 
            testimonial: "I've rented cars from various companies, but the experience with CarRental was exceptional"},
       { id: 2, 
            name: "Harper Wilson",
            address: "New York, USA", 
            image: assets.testimonial_image_2, 
            rating: 4, 
            testimonial: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!" },
        { id: 3, 
            name: "Sophia Lee", 
            address: "Seoul, South Korea", 
            image: assets.testimonial_image_1, 
            rating: 5, 
            testimonial: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service." }
    ];
      return (
         <div className="  px-6 py-28 md:px-16 lg:px-24 xl:px-44">
            <Title title={"What Our Customers Say"} subtitle={"Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                {testimonials.map((testimonial,index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg  hover:-translate-y-3
                    duration-500 transition-all ">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className=" text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.address}</p>
                            </div>
                        </div>
                       <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                                <img src={assets.star_icon} key={index} alt="star"/>
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </div>
                ))}
            </div>
        </div>
      )
    }
    
    export default Testimonial
    