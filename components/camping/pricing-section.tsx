'use client'

import { motion } from 'framer-motion'
import { Button } from '@heroui/react'
import { CreditCard, Smartphone, BadgeCheck, X } from 'lucide-react'

const paymentMethods = [
  { icon: Smartphone, label: 'PIX', available: true },
  { icon: CreditCard, label: 'Cartão de Crédito', available: true },
  { icon: CreditCard, label: 'Cartão de Débito', available: true },
]

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
      
      <div className="max-w-4xl mx-auto relative">
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
            Um investimento em algo que realmente importa.
          </p>
        </motion.div>

        <motion.div
          className="bg-card rounded-3xl border border-border p-8 sm:p-12 text-center relative overflow-hidden"
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
            <span className="inline-flex items-center gap-1 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-b-lg">
              <BadgeCheck className="w-4 h-4" />
              Valor Unico
            </span>
          </motion.div>

          {/* Price */}
          <motion.div
            className="mt-6 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-medium text-muted-foreground">R$</span>
              <span className="text-7xl sm:text-8xl px-2 font-black tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                280
              </span>
              <span className="text-2xl font-medium text-muted-foreground">,00</span>
            </div>
            <p className="text-muted-foreground mt-2">por participante</p>
          </motion.div>

          {/* What's included */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {['Hospedagem', 'Alimentação', 'Programação'].map((item) => (
              <span
                key={item}
                className="px-4 py-2 bg-secondary rounded-full text-sm font-medium text-secondary-foreground"
              >
                {item}
              </span>
            ))}
          </motion.div>

          {/* Payment methods */}
          <motion.div
            className="border-t border-border pt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider">
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
                <span className="text-destructive font-medium">(Indisponível)</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
