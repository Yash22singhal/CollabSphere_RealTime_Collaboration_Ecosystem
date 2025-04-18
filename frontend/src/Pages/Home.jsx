import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import DemoSection from '../components/DemoSection'
import TestimonialsSection from '../components/TestimonialSection'

const Home = () => {
  return (
    <div>
        <Hero />

        <Features />

        <DemoSection />

        <TestimonialsSection />
    </div>
  )
}

export default Home