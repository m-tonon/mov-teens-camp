'use client';

import { motion } from 'framer-motion';
import {
  CreditCard,
  Smartphone,
  BadgeCheck,
  X,
  Users,
  User,
  UserPlus,
} from 'lucide-react';

const paymentMethods = [
  { icon: Smartphone, label: 'PIX', available: true },
  { icon: CreditCard, label: 'Cartão de Crédito', available: true },
  { icon: CreditCard, label: 'Cartão de Débito', available: true },
];

const installmentsAvailable = true;

export function PricingSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Investimento
          </h2>
          <p className="text-muted-foreground text-lg">
            Escolha a melhor opção para você
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Individual Card */}
          <motion.div
            className="bg-card rounded-3xl border border-border p-8 sm:p-10 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Badge */}
            <motion.div
              className="absolute -top-1 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="inline-flex items-center gap-1 px-4 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-b-lg">
                <User className="w-4 h-4" />
                Individual
              </span>
            </motion.div>

            {/* Price */}
            <motion.div
              className="mt-6 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-xl font-medium text-muted-foreground">
                  R$
                </span>
                <span className="text-6xl sm:text-7xl px-2 font-black tracking-tighter bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  280
                </span>
                <span className="text-xl font-medium text-muted-foreground">
                  ,00
                </span>
              </div>
              <p className="text-muted-foreground mt-2">por pessoa</p>
            </motion.div>

            {/* Features */}
            <motion.div
              className="space-y-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <span>1 Participante</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <span>Acomodação compartilhada</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Suite Card */}
          <motion.div
            className="bg-card rounded-3xl border-2 border-primary/30 p-8 sm:p-10 text-center relative overflow-hidden shadow-lg shadow-primary/10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Popular Badge */}
            <motion.div
              className="absolute -top-1 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="inline-flex items-center gap-1 px-4 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-b-lg">
                <UserPlus className="w-4 h-4" />
                Suite
              </span>
            </motion.div>

            {/* Suite Badge */}
            <motion.div
              className="absolute top-12 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">
                <Users className="w-3 h-3" />
                Suíte para Casal
              </span>
            </motion.div>

            {/* Price */}
            <motion.div
              className="mt-16 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-2xl font-medium text-muted-foreground">
                  R$
                </span>
                <span className="text-7xl sm:text-8xl px-2 font-black tracking-tighter bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
                  880
                </span>
                <span className="text-2xl font-medium text-muted-foreground">
                  ,00
                </span>
              </div>
              <p className="text-muted-foreground mt-2">para o casal</p>
            </motion.div>

            {/* Features */}
            <motion.div
              className="space-y-2 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center justify-center gap-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <span>2 Participantes</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <span>Suíte privativa</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* What's included - Common to both */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {['Hospedagem', 'Alimentação Completa', 'Toda Programação'].map(
            (item) => (
              <span
                key={item}
                className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground"
              >
                {item}
              </span>
            ),
          )}
        </motion.div>

        {/* Payment methods */}
        <motion.div
          className="mt-12 bg-card rounded-2xl border border-border p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider text-center">
            Formas de Pagamento
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {paymentMethods.map((method) => (
              <div
                key={method.label}
                className="flex items-center gap-2 px-4 py-2 bg-secondary/50 rounded-lg"
              >
                <method.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">{method.label}</span>
              </div>
            ))}
          </div>

          {/* Installment notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {installmentsAvailable ? (
              <BadgeCheck className="w-4 h-4 text-green-500" />
            ) : (
              <X className="w-4 h-4 text-destructive" />
            )}

            <span>Parcelamento em até 10x no cartão</span>

            {!installmentsAvailable && (
              <span className="text-destructive font-medium">
                (Indisponível)
              </span>
            )}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          className="text-center text-xs text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          * Para suíte, ambos os participantes devem ter 18 anos ou mais e ser
          casados.
        </motion.p>
      </div>
    </section>
  );
}
