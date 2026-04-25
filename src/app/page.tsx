"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Partners from "@/components/Partners";
import Portfolio from "@/components/Portfolio";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import RegisterModal from "@/components/RegisterModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const open  = () => setModalOpen(true);
  const close = () => setModalOpen(false);

  return (
    <>
      <Navbar onOpenModal={open} />
      <main>
        <Hero        onOpenModal={open} />
        <About />
        <Stats />
        <Services />
        <Partners   onOpenModal={open} />
        <Portfolio  onOpenModal={open} />
        <Events />
        <Testimonials onOpenModal={open} />
        <FAQ         onOpenModal={open} />
        <Contact />
      </main>
      <Footer onOpenModal={open} />

      <RegisterModal open={modalOpen} onClose={close} />
    </>
  );
}
