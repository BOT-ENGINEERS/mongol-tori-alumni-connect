import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AlumniSection from "@/components/AlumniSection";
import JobsSection from "@/components/JobsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <AlumniSection />
        <JobsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
