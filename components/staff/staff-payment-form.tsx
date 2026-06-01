'use client';

import { useState } from 'react';
import { createPaymentLink } from '@/services/payment';
import {
  STAFF_PRICE,
  PAYMENT_MAX_INSTALLMENTS,
} from '@/hooks/use-registration-form';
import type { PaymentInfo } from '@/shared/registration.interface';

function generateReferenceId() {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `REF-${randomPart}`;
}

function formatCPF(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.replace(/(\d{1,2})/, '($1');
  if (digits.length <= 7) return digits.replace(/(\d{2})(\d+)/, '($1) $2');
  if (digits.length <= 11)
    return digits.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
  return digits;
}

function formatName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

const formattedStaffAmount = (STAFF_PRICE / 100).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface StaffPaymentFormProps {
  embedded?: boolean;
}

export function StaffPaymentForm({ embedded = false }: StaffPaymentFormProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const inputBase =
    'w-full bg-background border rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/50 border-border';

  const validate = () => {
    if (!name.trim()) return 'Nome é obrigatório.';
    const cpfDigits = cpf.replace(/\D/g, '');
    if (cpfDigits.length !== 11) return 'CPF inválido.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'E-mail inválido.';
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) return 'Telefone inválido.';
    return '';
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setPaymentLink(null);
    setReferenceId(null);

    const ref = generateReferenceId();
    const paymentData: PaymentInfo = {
      referenceId: ref,
      amount: STAFF_PRICE,
      name: formatName(name),
      cpf: cpf.replace(/\D/g, ''),
      email: email.trim(),
      phone,
      isStaffType: true,
      maxInstallments: PAYMENT_MAX_INSTALLMENTS,
    };

    try {
      const response = await createPaymentLink(paymentData);
      if (!response.paymentLink) {
        throw new Error('Link de pagamento não retornado.');
      }
      setPaymentLink(response.paymentLink);
      setReferenceId(ref);
    } catch {
      setError('Erro ao gerar link de pagamento. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!paymentLink) return;
    await navigator.clipboard.writeText(paymentLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setName('');
    setCpf('');
    setEmail('');
    setPhone('');
    setPaymentLink(null);
    setReferenceId(null);
    setError('');
    setCopied(false);
  };

  return (
    <div
      className={`w-full space-y-6 ${embedded ? 'max-w-xl' : 'max-w-lg mx-auto'}`}
    >
      {!embedded && (
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
            <span>⛺</span>
            <span>Inscrição da Equipe</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Gerar link de pagamento
          </h1>
          <p className="text-muted-foreground text-sm">
            Preencha os dados do pagador para criar o link PagSeguro
          </p>
        </div>
      )}

      {!paymentLink ? (
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4"
        >
          <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 text-center space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Inscrição staff
            </p>
            <p className="text-2xl font-black text-foreground">
              {formattedStaffAmount}
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Nome completo *
            </label>
            <input
              className={inputBase}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do pagador"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              CPF *
            </label>
            <input
              className={inputBase}
              value={cpf}
              onChange={(e) => setCpf(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              E-mail *
            </label>
            <input
              type="email"
              className={inputBase}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Telefone *
            </label>
            <input
              className={inputBase}
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(44) 90000-0000"
              maxLength={15}
              required
            />
          </div>

          {error && (
            <div className="flex gap-2 items-start bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-3 text-xs text-destructive">
              <span className="flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? 'Gerando link...' : 'Gerar link de pagamento'}
          </button>
        </form>
      ) : (
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <div className="text-center space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Link gerado
            </p>
            <p className="text-2xl font-black text-green-600">
              {formattedStaffAmount}
            </p>
            {referenceId && (
              <p className="text-xs text-muted-foreground font-mono">
                Referência: {referenceId}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground mb-1">Link PagSeguro</p>
            <p className="text-xs font-mono break-all text-foreground">{paymentLink}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted/60 transition-colors"
            >
              {copied ? 'Copiado!' : 'Copiar link'}
            </button>
            <a
              href={paymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-semibold text-center hover:bg-green-700 transition-colors"
            >
              Abrir pagamento
            </a>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full py-3 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:bg-muted/60 transition-colors"
          >
            Gerar outro link
          </button>
        </div>
      )}
    </div>
  );
}
