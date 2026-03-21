"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";

const highlights = [
  {
    icon: Calendar,
    label: "Data",
    value: "05 a 07 de Junho",
    description: "3 dias de imersão",
    color: "bg-primary/20 text-primary",
  },
  {
    icon: MapPin,
    label: "Local",
    value: "Acampamento Maanaim",
    description: "Acampamento Evangélico",
    color: "bg-accent/20 text-accent",
  },
  {
    icon: Users,
    label: "Idade",
    value: "A partir de 12 anos",
    description: "Faixa etária do acampamento",
    color: "bg-chart-3/20 text-chart-3",
  },
  {
    icon: Sparkles,
    label: "Tema",
    value: "Deepfake",
    description:
      "Num mundo de falsas versões, descubra quem você realmente é em Cristo.",
    color: "bg-chart-4/20 text-chart-4",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function EventHighlights() {
  return (
    <section className="py-20 px-6 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Informações
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Tudo que voce precisa saber sobre o acampamento
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {highlights.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 text-center"
            >
              <div className={`inline-flex p-3 rounded-xl ${item.color} mb-4`}>
                <item.icon className="w-6 h-6" />
              </div>

              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                {item.label}
              </p>

              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">
                {item.value}
              </h3>

              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

        {/* Important Notice */}
        <motion.div
          className="mt-8 p-6 bg-accent/10 border border-accent/30 rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-accent/20 rounded-lg shrink-0">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h4 className="font-bold text-foreground mb-1">Importante</h4>
              <p className="text-sm text-muted-foreground">
                Sua vaga so esta garantida mediante pagamento.
                <br /> Garanta ja a sua e lembre-se de convidar algum amigo!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
