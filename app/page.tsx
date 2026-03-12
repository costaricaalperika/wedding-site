import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Story from "@/components/Story";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import RsvpForm from "@/components/RsvpForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Countdown />
      <Story />
      <EventDetails />
      <Gallery />
      <RsvpForm />
      <Footer />
    </main>
  );
}
