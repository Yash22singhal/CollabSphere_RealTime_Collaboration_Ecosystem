// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper modules
// import { Pagination, Autoplay } from "swiper/modules";

// // Import the testimonials data from your data file
// import { testimonials } from "../assets/data"; 

// const TestimonialsSection = () => {
//   return (
//     <section id="testimonials" className="py-20 px-4 bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">
//           Trusted by Industry Leaders
//         </h2>
//         <Swiper
//           modules={[Pagination, Autoplay]} // Use the modules here
//           spaceBetween={30}
//           slidesPerView={1}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 5000 }}
//           className="pb-12"
//         >
//           {testimonials.map((testimonial, index) => (
//             <SwiperSlide key={index}>
//               <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
//                 <div className="flex items-center mb-6">
//                   <img
//                     src={testimonial.image}
//                     alt={testimonial.name}
//                     className="w-16 h-16 rounded-full object-cover border-4 border-indigo-500"
//                   />
//                   <div className="ml-6">
//                     <h4 className="text-xl font-semibold text-gray-800">
//                       {testimonial.name}
//                     </h4>
//                     <p className="text-sm text-gray-500">
//                       {testimonial.position} at {testimonial.company}
//                     </p>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 italic text-lg">{testimonial.quote}</p>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </section>
//   );
// };

// export default TestimonialsSection;



import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper modules
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

// Import the testimonials data from your data file
import { testimonials } from "../assets/data";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-16">
          Trusted by Industry Leaders
        </h2>
        <Swiper
          modules={[Pagination, Autoplay]} // Use the modules here
          spaceBetween={30}
          slidesPerView={1} // Default for small screens
          breakpoints={{
            640: { slidesPerView: 1 }, // One slide per view on smaller screens
            1024: { slidesPerView: 2 }, // Two slides per view on larger screens
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="pb-12"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-indigo-500"
                  />
                  <div className="ml-6">
                    <h4 className="text-xl font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {testimonial.position} at {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 italic text-lg">{testimonial.quote}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialsSection;
