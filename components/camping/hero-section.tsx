"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { CalendarDays, MapPin, ChevronDown } from "lucide-react";

export function HeroSection() {
  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />

      {/* Background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-background.jpg')" }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-widest uppercase bg-primary/20 text-primary rounded-full border border-primary/30">
            3ª Edição
          </span>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="block text-foreground">ACAMPA</span>
          <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            TEENS
          </span>
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl md:text-3xl font-black tracking-[0.3em] mb-2"
          style={{ fontFamily: "'Courier New', Courier, monospace" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span
            className="bg-black text-white px-8 py-2 inline-block"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
            }}
          >
            DEEP FAKE
          </span>
        </motion.p>

        <motion.p
          className="text-base sm:text-lg text-muted-foreground/70 max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Num mundo de falsas versões,
          <br /> descubra quem você realmente é em Cristo.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center gap-2 text-foreground/80">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span className="font-medium">05 - 07 Junho</span>
          </div>
          <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="flex items-center gap-2 text-foreground/80">
            <MapPin className="w-5 h-5 text-accent" />
            <span className="font-medium">Acampamento Maanaim</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground font-bold text-lg px-10 py-7 rounded-full hover:scale-105 transition-transform shadow-lg shadow-primary/30"
            onPress={scrollToContent}
          >
            Quero Participar
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToContent}
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
}
