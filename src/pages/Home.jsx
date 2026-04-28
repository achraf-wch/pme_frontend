import HeroSection from '../components/home/HeroSection';
import FeaturedNews from '../components/home/FeaturedNews';
import UpcomingEvents from '../components/home/UpcomingEvents';
import CallToAction from '../components/home/CallToAction';

export default function Home() {
    return (
        <>
            <HeroSection />
            <FeaturedNews />
            <UpcomingEvents />
            <CallToAction />
        </>
    );
}