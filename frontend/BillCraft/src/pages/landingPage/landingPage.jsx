import Header from "../../components/landing/header";
import Hero from "../../components/landing/hero"
import Features from "../../components/landing/features";
import Testimonials from "../../components/landing/testimonial";
import FAQ from "../../components/landing/FAQ";
import Footer from "../../components/landing/footer";

const LandingPage = () => {
  return (
    <div className="bg-white text-gray-600">
      <Header />
      <main  className="pt-20">
        <Hero/>
        <Features/>
        <Testimonials/>
        <FAQ/>
        <Footer/>
      </main>
    </div>
  );
};

export default LandingPage;