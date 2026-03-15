'use client'

import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo */}
          <div className="mb-6">
            <h3 className="text-2xl font-black tracking-tight">
              <span className="text-foreground">MOV</span>
              <span className="text-primary">TEENS</span>
            </h3>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
              Ministério de Adolescentes IPVO
            </p>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-border w-full">
            <p className="text-sm text-muted-foreground">
              © 2026 IPVO • Design by Matheus Tonon
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
