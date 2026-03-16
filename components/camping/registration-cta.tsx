'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Checkbox } from '@heroui/react'
import { ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function RegistrationCTA() {
  const [termsAccepted, setTermsAccepted] = useState({
    info: false,
    terms: false,
  })

  const canProceed = termsAccepted.info && termsAccepted.terms

  const router = useRouter()

  const handleNextStep = () => {
    if (canProceed) {
      router.push('/registration')
    }
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-gradient-to-t from-primary/20 to-transparent blur-3xl pointer-events-none"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <div className="max-w-2xl mx-auto relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Pronto Para Participar?
          </h2>
          <p className="text-muted-foreground text-lg">
            Confirme as informações e avance para a inscrição
          </p>
        </motion.div>

        <motion.div
          className="bg-card rounded-3xl border border-border p-8"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Checkboxes */}
          <div className="space-y-4 mb-8">
            <label
              className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                termsAccepted.info
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-secondary/50 border border-transparent hover:bg-secondary'
              }`}
            >
              <Checkbox
                isSelected={termsAccepted.info}
                onValueChange={(checked) =>
                  setTermsAccepted((prev) => ({ ...prev, info: checked }))
                }
                color="success"
                classNames={{
                  wrapper: 'mt-0.5',
                  base: "scale-50"
                }}
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Li e compreendi todas as informacoes do acampamento
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Incluindo data, local, idade e valor do investimento
                </p>
              </div>
              {termsAccepted.info && (
                <Check className="w-5 h-5 text-primary shrink-0" />
              )}
            </label>

            <label
              className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                termsAccepted.terms
                  ? 'bg-primary/10 border border-primary/30'
                  : 'bg-secondary/50 border border-transparent hover:bg-secondary'
              }`}
            >
              <Checkbox
                isSelected={termsAccepted.terms}
                onValueChange={(checked) =>
                  setTermsAccepted((prev) => ({ ...prev, terms: checked }))
                }
                color="success"
                classNames={{
                  wrapper: 'mt-0.5',
                  base: "scale-50"
                }}
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  Aceito os termos e condicoes do acampamento
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Concordo com as regras e diretrizes estabelecidas
                </p>
              </div>
              {termsAccepted.terms && (
                <Check className="w-5 h-5 text-primary shrink-0" />
              )}
            </label>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className={`w-full font-bold text-lg py-7 rounded-xl transition-all duration-300 ${
              canProceed
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-[1.02]'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
            isDisabled={!canProceed}
            onPress={handleNextStep}
          >
            <span>Próximo Passo</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          {!canProceed && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              Marque as opcoes acima para continuar
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
