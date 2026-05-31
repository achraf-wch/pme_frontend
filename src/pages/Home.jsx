import HeroSection from '../components/home/HeroSection';
import FeaturedNews from '../components/home/FeaturedNews';
import UpcomingEvents from '../components/home/UpcomingEvents';
import CallToAction from '../components/home/CallToAction';
import DigitalFeatures from '../components/home/DigitalFeatures';

export default function Home() {
    return (
        <>
            <HeroSection />
            <DigitalFeatures />
            <FeaturedNews />
            <UpcomingEvents />
            <CallToAction />
        </>
    );
}
