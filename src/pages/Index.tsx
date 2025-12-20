import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AlumniSection from "@/components/AlumniSection";
import AdvisorsSection from "@/components/AdvisorsSection";
import JobsSection from "@/components/JobsSection";
import AchievementsSection from "@/components/AchievementsSection";
import NewsSection from "@/components/NewsSection";
import MerchandiseSection from "@/components/MerchandiseSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AlumniSection />
        <AdvisorsSection />
        <JobsSection />
        <AchievementsSection />
        <NewsSection />
        <MerchandiseSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;