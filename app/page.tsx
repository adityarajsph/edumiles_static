"use client";

import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PackageSearch from "./components/PackageSearch";
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

export default function Home() {
  const [modalOpen, setModalOpen]   = useState(false);
  const [modalSubject, setModalSubject] = useState<string | undefined>();

  const openContact = useCallback((subject?: string) => {
    setModalSubject(subject);
    setModalOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <main>
      <Navbar />
      <Hero onOpenContact={openContact} />
      <PackageSearch onOpenContact={openContact} />
      <PopularDestinations />
      <FeaturedPackages onOpenContact={openContact} />
      <TicketBooking onOpenContact={openContact} />
      <WhyChooseUs onOpenContact={openContact} />
      <Categories />
      <Testimonials />
      <Gallery />
      <About />
      <CTA onOpenContact={openContact} />
      <Footer />
      <ContactModal open={modalOpen} onClose={closeContact} subject={modalSubject} />
    </main>
  );
}
