"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import Story from "@/components/Story";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import RsvpForm from "@/components/RsvpForm";
import Footer from "@/components/Footer";
import MusicPlayer from "@/components/MusicPlayer";
import InvitationCover from "@/components/InvitationCover";
import PassageBreak from "@/components/PassageBreak";

export default function Home() {
  const [invitationOpened, setInvitationOpened] = useState(false);
  const handleInvitationOpen = useCallback(() => setInvitationOpened(true), []);

  return (
    <>
      <InvitationCover onOpen={handleInvitationOpen} />
      <main>
        <Navbar />
        <Hero />
        <Countdown />
        <PassageBreak src="/passage1.png" dense />
        <Story />
        <PassageBreak src="/passage2.png" compact dense />
        <EventDetails />
        <Gallery />
        <PassageBreak src="/passage3.png" tightTop />
        <RsvpForm invitationOpened={invitationOpened} />
        <Footer />
        <MusicPlayer shouldStart={invitationOpened} />
      </main>
    </>
  );
}
