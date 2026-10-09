"use client";

import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PopularDestinations from "./components/PopularDestinations";
import FeaturedPackages from "./components/FeaturedPackages";
import TicketBooking from "./components/TicketBooking";
import WhyChooseUs from "./components/WhyChooseUs";
import Categories from "./components/Categories";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";
import EnquiryModal from "./components/EnquiryModal";
import BusEnquiryModal from "./components/BusEnquiryModal";

export default function Home() {
  const [modalOpen, setModalOpen]         = useState(false);
  const [modalSubject, setModalSubject]   = useState<string | undefined>();
  const [enquiryOpen, setEnquiryOpen]     = useState(false);
  const [busEnquiryOpen, setBusEnquiryOpen] = useState(false);

  const openContact     = useCallback((subject?: string) => { setModalSubject(subject); setModalOpen(true); }, []);
  const closeContact    = useCallback(() => setModalOpen(false), []);
  const openEnquiry     = useCallback(() => setEnquiryOpen(true), []);
  const closeEnquiry    = useCallback(() => setEnquiryOpen(false), []);
  const openBusEnquiry  = useCallback(() => setBusEnquiryOpen(true), []);
  const closeBusEnquiry = useCallback(() => setBusEnquiryOpen(false), []);

  return (
    <main>
      <Navbar />
      <Hero onOpenContact={openContact} onOpenEnquiry={openEnquiry} />
      <PopularDestinations />
      <FeaturedPackages onOpenContact={openContact} />
      <TicketBooking onOpenContact={openContact} onOpenEnquiry={openEnquiry} onOpenBusEnquiry={openBusEnquiry} />
      <WhyChooseUs onOpenContact={openContact} />
      <Categories />
      <Testimonials />
      <Gallery />
      <About />
      <CTA onOpenContact={openContact} />
      <Footer />
      <ContactModal open={modalOpen} onClose={closeContact} subject={modalSubject} />
      <EnquiryModal open={enquiryOpen} onClose={closeEnquiry} />
      <BusEnquiryModal open={busEnquiryOpen} onClose={closeBusEnquiry} />
    </main>
  );
}
