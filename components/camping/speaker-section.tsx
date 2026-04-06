'use client';

import { motion } from 'framer-motion';
import { Mic2, Quote } from 'lucide-react';
import Image from 'next/image';

export function SpeakerSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-3 bg-primary/20 rounded-xl">
            <Mic2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-medium">
              Preletor
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Quem Vai Estar Com Você
            </h2>
          </div>
        </motion.div>

        <motion.div
          className="bg-card rounded-3xl border border-border overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative md:w-2/5 aspect-square md:aspect-auto bg-gradient-to-br from-primary/30 via-accent/20 to-secondary flex items-center justify-center h-70">
              <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent md:bg-gradient-to-r" />

              <a
                href="https://instagram.com/tonon.lucass"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.div className="relative z-10 p-1 rounded-full bg-gradient-to-br from-primary to-accent">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden">
                    <Image
                      src="https://mcusercontent.com/7431ecec0175e179b64e6e523/images/3723a54f-b3a2-a179-5a04-a42cecf59b9c.jpeg"
                      alt="Preletor"
                      fill
                      className="object-cover"
                    />
                  </div>
                </motion.div>
              </a>
            </div>

            {/* Content */}
            <div className="p-8 md:w-3/5 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent text-center">
                  Pastor Lucas
                </h3>

                <p className="text-primary font-medium mb-6 text-center">
                  Pastor de Novas Gerações <br /> 1ª Igreja Batista de Tupã
                </p>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                  <p className="text-muted-foreground leading-relaxed pl-6">
                    Há mais de 10 anos no ministério, é casado com Nathália e
                    dedica sua vida a ajudar adolescentes e jovens a descobrirem
                    uma fé verdadeira em meio a um mundo de aparências.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
