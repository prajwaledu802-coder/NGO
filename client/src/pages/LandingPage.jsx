import CTABanner from '../components/landing/CTABanner';
import FeaturesSection from '../components/landing/FeaturesSection';
import HeroSection from '../components/landing/HeroSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import LandingFooter from '../components/landing/LandingFooter';
import LandingNavbar from '../components/landing/LandingNavbar';

const LandingPage = () => (
  <div className="min-h-screen">
    <LandingNavbar />
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <CTABanner />
    <LandingFooter />
  </div>
);

export default LandingPage;
