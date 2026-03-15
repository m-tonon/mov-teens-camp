'use client'

import { motion } from 'framer-motion'
import { Phone, MessageCircle, Building2 } from 'lucide-react'

const contacts = [
  {
    icon: Building2,
    name: 'Secretaria IPVO',
    phone: '(44) 3226-4473',
    description: 'Informacoes gerais',
    color: 'from-primary/20 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    icon: MessageCircle,
    name: 'Anjinho',
    phone: '(44) 9 9846-0089',
    description: 'WhatsApp',
    color: 'from-accent/20 to-accent/5',
    iconColor: 'text-accent',
  },
]

export function ContactSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex p-3 bg-secondary rounded-xl mb-4">
            <Phone className="w-6 h-6 text-foreground" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Contatos
          </h2>
          <p className="text-muted-foreground text-lg">
            Ficou com duvidas? Entre em contato conosco
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {contacts.map((contact, index) => (
            <motion.a
              key={contact.name}
              href={`tel:${contact.phone.replace(/\D/g, '')}`}
              className="group block"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className={`relative bg-gradient-to-br ${contact.color} rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden`}>
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-start gap-4">
                  <div className={`p-3 bg-card rounded-xl ${contact.iconColor}`}>
                    <contact.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      {contact.description}
                    </p>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      {contact.name}
                    </h3>
                    <p className="text-xl font-black text-primary group-hover:text-accent transition-colors">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
