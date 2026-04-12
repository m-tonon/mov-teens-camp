'use client';

import { useState, useEffect } from 'react';
import {
  PaymentInfo,
  RegistrationFormData,
} from '@/shared/registration.interface';
import { saveRegistration } from '@/services/registration';

interface Props {
  onSubmit: (data: RegistrationFormData) => void;
}

type FormStep = 'participant' | 'suitePartner' | 'responsible';

const STEP_LABELS: Record<FormStep, string> = {
  participant: 'Dados do Acampante',
  suitePartner: 'Dados do Acompanhante',
  responsible: 'Informações do Responsável',
};

const SUITE_PRICE = 80000;
const INDIVIDUAL_PRICE = 28000;

export function RegistrationForm({ onSubmit }: Props) {
  const [currentStep, setCurrentStep] = useState<FormStep>('participant');
  const [isSuite, setIsSuite] = useState(false);

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    birthDate: '',
    age: null,
    gender: '',
    identityDocument: '',
    address: '',
    churchMembership: '',
    churchName: '',
    healthInsurance: '',
    medications: '',
    allergies: '',
    specialNeeds: '',
    responsibleInfo: {
      name: '',
      document: '',
      phone: '',
      email: '',
      relation: '',
    },
    parentalAuthorization: false,
    payment: {
      referenceId: '',
      paymentConfirmed: false,
      amount: INDIVIDUAL_PRICE,
      paymentLink: '',
    },
    isSuiteRegistration: false,
  });

  const [suitePartner, setSuitePartner] = useState<RegistrationFormData>({
    name: '',
    birthDate: '',
    age: null,
    gender: '',
    identityDocument: '',
    address: '',
    churchMembership: '',
    churchName: '',
    healthInsurance: '',
    medications: '',
    allergies: '',
    specialNeeds: '',
    responsibleInfo: {
      name: '',
      document: '',
      phone: '',
      email: '',
      relation: '',
    },
    parentalAuthorization: false,
    payment: {
      referenceId: '',
      paymentConfirmed: false,
      amount: 0,
      paymentLink: '',
    },
    isSuiteRegistration: true,
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update amount when suite toggle changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        amount: isSuite ? SUITE_PRICE : INDIVIDUAL_PRICE,
      },
      isSuiteRegistration: isSuite,
    }));
  }, [isSuite]);

  const calculateAge = (birthDate: string) => {
    const date = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age;
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits.replace(/(\d{1,2})/, '($1');
    if (digits.length <= 7) return digits.replace(/(\d{2})(\d+)/, '($1) $2');
    if (digits.length <= 11)
      return digits.replace(/(\d{2})(\d{5})(\d+)/, '($1) $2-$3');
    return digits;
  };

  const handleMainChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    if (name === 'responsibleInfo.document') {
      setFormData((prev) => ({
        ...prev,
        responsibleInfo: {
          ...prev.responsibleInfo,
          document: formatCPF(value),
        },
      }));
      return;
    }

    if (name === 'responsibleInfo.phone') {
      setFormData((prev) => ({
        ...prev,
        responsibleInfo: { ...prev.responsibleInfo, phone: formatPhone(value) },
      }));
      return;
    }

    if (name.startsWith('responsibleInfo.')) {
      const key = name.split('.')[1];
      const capitalizeWords = (text: string) =>
        text.replace(/\b\w/g, (char) => char.toUpperCase());
      const formattedValue =
        key === 'relation' ? capitalizeWords(value) : value;

      setFormData((prev) => ({
        ...prev,
        responsibleInfo: { ...prev.responsibleInfo, [key]: formattedValue },
      }));
      return;
    }

    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === 'birthDate') {
      setFormData((prev) => ({
        ...prev,
        birthDate: value,
        age: calculateAge(value),
      }));
    }
  };

  const handleSuitePartnerChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setSuitePartner((prev) => ({ ...prev, [name]: val }));

    if (name === 'birthDate') {
      setSuitePartner((prev) => ({
        ...prev,
        birthDate: value,
        age: calculateAge(value),
      }));
    }
  };

  const handleBlur = (name: string) =>
    setTouched((prev) => ({ ...prev, [name]: true }));

  const generateReferenceId = () => {
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `REF-${randomPart}`;
  };

  const validateStep = (step: FormStep): boolean => {
    if (step === 'participant') {
      const age = formData.birthDate ? calculateAge(formData.birthDate) : null;
      return (
        !!formData.name &&
        !!formData.birthDate &&
        !!formData.gender &&
        !!formData.identityDocument &&
        age !== null &&
        age >= (isSuite ? 18 : 12)
      );
    }

    if (step === 'suitePartner') {
      const age = suitePartner.birthDate
        ? calculateAge(suitePartner.birthDate)
        : null;
      return (
        !!suitePartner.name &&
        !!suitePartner.birthDate &&
        !!suitePartner.gender &&
        !!suitePartner.identityDocument &&
        age !== null &&
        age >= 18
      );
    }

    if (step === 'responsible') {
      return (
        !!formData.responsibleInfo.name &&
        !!formData.responsibleInfo.document &&
        !!formData.responsibleInfo.phone &&
        !!formData.responsibleInfo.email
      );
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      // Mark all fields in current step as touched
      const fieldsToTouch =
        currentStep === 'participant'
          ? [
              'main_name',
              'main_birthDate',
              'main_gender',
              'main_identityDocument',
            ]
          : currentStep === 'suitePartner'
            ? [
                'suite_name',
                'suite_birthDate',
                'suite_gender',
                'suite_identityDocument',
              ]
            : [
                'responsibleInfo.name',
                'responsibleInfo.document',
                'responsibleInfo.phone',
                'responsibleInfo.email',
              ];

      setTouched((prev) => {
        const newTouched = { ...prev };
        fieldsToTouch.forEach((f) => (newTouched[f] = true));
        return newTouched;
      });
      return;
    }

    if (currentStep === 'participant') {
      setCurrentStep(isSuite ? 'suitePartner' : 'responsible');
    } else if (currentStep === 'suitePartner') {
      setCurrentStep('responsible');
    }
  };

  const handleBack = () => {
    if (currentStep === 'suitePartner') {
      setCurrentStep('participant');
    } else if (currentStep === 'responsible') {
      setCurrentStep(isSuite ? 'suitePartner' : 'participant');
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate responsible step before submitting
    if (!validateStep('responsible')) {
      const fieldsToTouch = [
        'responsibleInfo.name',
        'responsibleInfo.document',
        'responsibleInfo.phone',
        'responsibleInfo.email',
      ];
      setTouched((prev) => {
        const newTouched = { ...prev };
        fieldsToTouch.forEach((f) => (newTouched[f] = true));
        return newTouched;
      });
      return;
    }

    setLoading(true);
    setError('');

    try {
      const referenceId = generateReferenceId();
      const partnerReferenceId = isSuite ? generateReferenceId() : '';

      const paymentAmount = isSuite ? SUITE_PRICE : INDIVIDUAL_PRICE;

      const checkoutRes = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceId,
          amount: paymentAmount,
          email: formData.responsibleInfo.email,
          name: formData.responsibleInfo.name,
          cpf: formData.responsibleInfo.document.replace(/\D/g, ''),
          phone: formData.responsibleInfo.phone,
          isSuiteRegistration: isSuite,
          suitePartnerReferenceId: partnerReferenceId,
        }),
      });

      if (!checkoutRes.ok) throw new Error('Falha ao gerar link de pagamento.');

      const { paymentLink } = await checkoutRes.json();

      const paymentData: PaymentInfo = {
        referenceId,
        paymentConfirmed: false,
        paymentLink: paymentLink,
        amount: paymentAmount,
        name: formData.responsibleInfo.name,
        cpf: formData.responsibleInfo.document.replace(/\D/g, ''),
        email: formData.responsibleInfo.email,
        phone: formData.responsibleInfo.phone,
      };

      const updatedFormData: RegistrationFormData = {
        ...formData,
        payment: paymentData,
        suitePartner: isSuite
          ? {
              ...suitePartner,
              payment: {
                ...suitePartner.payment,
                referenceId: partnerReferenceId,
                amount: 0,
              },
            }
          : undefined,
      };

      const saved = await saveRegistration(updatedFormData);

      onSubmit({
        ...updatedFormData,
        payment: {
          ...updatedFormData.payment,
          referenceId: saved.referenceId,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao salvar inscrição. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full bg-background border rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/50';
  const inputNormal = `${inputBase} border-border`;
  const inputError = `${inputBase} border-destructive/60 bg-destructive/5 focus:ring-destructive/30 focus:border-destructive`;

  const getInputClass = (field: string, value: string | null | boolean) => {
    if (!touched[field]) return inputNormal;
    const isEmpty =
      value === '' || value === null || value === false || value === undefined;
    return isEmpty ? inputError : inputNormal;
  };

  const FieldError = ({ message }: { message: string }) => (
    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
      <span className="inline-block w-3 h-3 rounded-full bg-destructive/20 text-destructive text-[10px] flex items-center justify-center font-bold">
        !
      </span>
      {message}
    </p>
  );

  const SectionDivider = ({
    icon,
    title,
    subtitle,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
  }) => (
    <div className="flex items-center gap-3 pt-2">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-lg flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 h-px bg-border ml-2" />
    </div>
  );

  const renderParticipantFields = (
    data: RegistrationFormData,
    onChange: (e: any) => void,
    isSuitePartner = false,
  ) => {
    const age = data.birthDate ? calculateAge(data.birthDate) : null;
    const minAge = isSuitePartner ? 18 : isSuite ? 18 : 12;
    const ageError =
      age !== null && age < minAge
        ? `O acampante deve ter pelo menos ${minAge} anos.`
        : null;

    const fieldPrefix = isSuitePartner ? 'suite_' : 'main_';

    return (
      <>
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Nome completo *
          </label>
          <input
            name="name"
            placeholder="Ex: Maria da Silva"
            className={getInputClass(`${fieldPrefix}name`, data.name)}
            value={data.name}
            onChange={onChange}
            onBlur={() => handleBlur(`${fieldPrefix}name`)}
            required
          />
          {touched[`${fieldPrefix}name`] && !data.name && (
            <FieldError message="O nome é obrigatório." />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Data de nascimento *
            </label>
            <input
              type="date"
              name="birthDate"
              className={getInputClass(
                `${fieldPrefix}birthDate`,
                data.birthDate,
              )}
              value={data.birthDate}
              onChange={onChange}
              onBlur={() => handleBlur(`${fieldPrefix}birthDate`)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Idade (calculada)
            </label>
            <div
              className={`${inputNormal} text-center font-semibold ${
                age !== null
                  ? ageError
                    ? 'text-destructive bg-destructive/5'
                    : 'text-primary'
                  : 'text-muted-foreground/40'
              }`}
            >
              {age !== null ? `${age} anos` : '—'}
            </div>
            {ageError && <FieldError message={ageError} />}
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Gênero *
            </label>
            <select
              name="gender"
              className={getInputClass(`${fieldPrefix}gender`, data.gender)}
              value={data.gender}
              onChange={onChange}
              onBlur={() => handleBlur(`${fieldPrefix}gender`)}
              required
            >
              <option value="">Selecione...</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Documento de identidade * (RG ou CPF)
          </label>
          <input
            name="identityDocument"
            placeholder="Número do documento"
            className={getInputClass(
              `${fieldPrefix}identityDocument`,
              data.identityDocument,
            )}
            value={data.identityDocument}
            onChange={onChange}
            onBlur={() => handleBlur(`${fieldPrefix}identityDocument`)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Endereço completo
          </label>
          <textarea
            name="address"
            placeholder="Rua, número, bairro, cidade..."
            className={`${inputNormal} resize-none`}
            rows={2}
            value={data.address}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              É membro de alguma igreja?
            </label>
            <select
              name="churchMembership"
              className={inputNormal}
              value={data.churchMembership}
              onChange={onChange}
            >
              <option value="">Selecione...</option>
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Nome da igreja
            </label>
            <input
              name="churchName"
              placeholder="Deixe em branco se não se aplica"
              className={inputNormal}
              value={data.churchName}
              onChange={onChange}
            />
          </div>
        </div>

        <SectionDivider
          icon="🏥"
          title="Informações de Saúde"
          subtitle="Nos ajude a cuidar melhor"
        />

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Plano de saúde
          </label>
          <input
            name="healthInsurance"
            placeholder="Nome do plano (se possuir)"
            className={inputNormal}
            value={data.healthInsurance}
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Medicamentos de uso contínuo
          </label>
          <textarea
            name="medications"
            placeholder="Liste os medicamentos que toma regularmente (se houver)..."
            className={`${inputNormal} resize-none`}
            rows={2}
            value={data.medications}
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Alergias
          </label>
          <textarea
            name="allergies"
            placeholder="Alimentos, medicamentos, ambiente... liste todas as alergias"
            className={`${inputNormal} resize-none`}
            rows={2}
            value={data.allergies}
            onChange={onChange}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Necessidades especiais
          </label>
          <textarea
            name="specialNeeds"
            placeholder="Descreva qualquer necessidade especial que o acampante tenha..."
            className={`${inputNormal} resize-none`}
            rows={2}
            value={data.specialNeeds}
            onChange={onChange}
          />
        </div>
      </>
    );
  };

  const renderResponsibleFields = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Nome do responsável *
          </label>
          <input
            name="responsibleInfo.name"
            placeholder="Nome completo"
            className={getInputClass(
              'responsibleInfo.name',
              formData.responsibleInfo.name,
            )}
            value={formData.responsibleInfo.name}
            onChange={handleMainChange}
            onBlur={() => handleBlur('responsibleInfo.name')}
            required
          />
          {touched['responsibleInfo.name'] &&
            !formData.responsibleInfo.name && (
              <FieldError message="Nome do responsável obrigatório." />
            )}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            CPF *
          </label>
          <input
            name="responsibleInfo.document"
            placeholder="000.000.000-00"
            className={getInputClass(
              'responsibleInfo.document',
              formData.responsibleInfo.document,
            )}
            value={formData.responsibleInfo.document}
            onChange={handleMainChange}
            onBlur={() => handleBlur('responsibleInfo.document')}
            maxLength={14}
            required
          />
          {touched['responsibleInfo.document'] &&
            !formData.responsibleInfo.document && (
              <FieldError message="CPF obrigatório." />
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Telefone *
          </label>
          <input
            name="responsibleInfo.phone"
            placeholder="(44) 90000-0000"
            className={getInputClass(
              'responsibleInfo.phone',
              formData.responsibleInfo.phone,
            )}
            value={formData.responsibleInfo.phone}
            onChange={handleMainChange}
            onBlur={() => handleBlur('responsibleInfo.phone')}
            maxLength={15}
            required
          />
          {touched['responsibleInfo.phone'] &&
            !formData.responsibleInfo.phone && (
              <FieldError message="Telefone obrigatório." />
            )}
        </div>

        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Relação com o acampante
          </label>
          <input
            name="responsibleInfo.relation"
            placeholder="Ex: Mãe, Pai, Avó, Tio..."
            className={inputNormal}
            value={formData.responsibleInfo.relation}
            onChange={handleMainChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          E-mail do responsável *
        </label>
        <input
          type="email"
          name="responsibleInfo.email"
          placeholder="email@exemplo.com"
          className={getInputClass(
            'responsibleInfo.email',
            formData.responsibleInfo.email,
          )}
          value={formData.responsibleInfo.email}
          onChange={handleMainChange}
          onBlur={() => handleBlur('responsibleInfo.email')}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Necessário para processar o pagamento e enviar confirmações.
        </p>
        {touched['responsibleInfo.email'] &&
          !formData.responsibleInfo.email && (
            <FieldError message="E-mail obrigatório." />
          )}
      </div>
    </>
  );

  const mainAge = formData.birthDate ? calculateAge(formData.birthDate) : null;
  const isMainMinor = mainAge !== null && mainAge < 18;

  const steps: FormStep[] = isSuite
    ? ['participant', 'suitePartner', 'responsible']
    : ['participant', 'responsible'];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8 space-y-1">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3">
          <span>⛺</span>
          <span>3º Acampa Teens</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          Formulário de Inscrição
        </h1>
        <p className="text-muted-foreground text-sm">
          05 a 07 de junho · Acampamento Maanaim
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, i, arr) => {
          const stepIndex = [
            'participant',
            'suitePartner',
            'responsible',
          ].indexOf(step);
          const currentIndex = [
            'participant',
            'suitePartner',
            'responsible',
          ].indexOf(currentStep);
          const isDone = stepIndex < currentIndex;
          const isCurrent = stepIndex === currentIndex;

          return (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : isCurrent
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isDone ? (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>

              {i < arr.length - 1 && (
                <div
                  className={`w-8 h-px transition-colors duration-500 ${
                    isDone ? 'bg-primary' : 'bg-border'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border"
      >
        {/* Suite Toggle - Only show on first step */}
        {currentStep === 'participant' && (
          <section className="p-6">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-muted/50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={isSuite}
                onChange={(e) => setIsSuite(e.target.checked)}
                className="w-5 h-5 accent-primary"
              />
              <div>
                <p className="font-medium text-foreground">
                  Inscrição para Suíte (Casal)
                </p>
                <p className="text-xs text-muted-foreground">
                  Valor especial de R$ 800,00 para duas pessoas. Ambos devem ter
                  18 anos ou mais.
                </p>
              </div>
            </label>
          </section>
        )}

        {/* Participant Section */}
        {currentStep === 'participant' && (
          <section className="p-6 space-y-4">
            <SectionDivider
              icon="🧑"
              title="Dados do Acampante"
              subtitle="Campos com * são obrigatórios"
            />
            {renderParticipantFields(formData, handleMainChange, false)}

            {isMainMinor && (
              <section className="space-y-4 pt-4">
                <label
                  className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    formData.parentalAuthorization
                      ? 'border-primary/40 bg-primary/5'
                      : touched['parentalAuthorization']
                        ? 'border-destructive/40 bg-destructive/5'
                        : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    name="parentalAuthorization"
                    checked={formData.parentalAuthorization}
                    onChange={handleMainChange}
                    onBlur={() => handleBlur('parentalAuthorization')}
                    className="mt-0.5 w-5 h-5 accent-primary flex-shrink-0"
                  />
                  <span className="text-sm leading-relaxed text-foreground/80">
                    Autorizo o menor acima a participar do evento{' '}
                    <strong className="text-foreground">3º ACAMPA TEENS</strong>{' '}
                    no Maanaim — Estr. Arns, 1516, Mandaguaçu - PR, no período
                    de{' '}
                    <strong className="text-foreground">
                      05 a 07 de Junho de 2026
                    </strong>
                    . Esta autorização está de acordo com o ECA (lei 8.069/90).
                  </span>
                </label>
              </section>
            )}
          </section>
        )}

        {/* Suite Partner Section */}
        {currentStep === 'suitePartner' && isSuite && (
          <section className="p-6 space-y-4">
            <SectionDivider
              icon="👤"
              title="Dados do Acompanhante"
              subtitle="Segunda pessoa da suíte"
            />
            {renderParticipantFields(
              suitePartner,
              handleSuitePartnerChange,
              true,
            )}
          </section>
        )}

        {/* Responsible Section */}
        {currentStep === 'responsible' && (
          <section className="p-6 space-y-4">
            <SectionDivider
              icon="👥"
              title="Informações do Responsável"
              subtitle={
                isSuite
                  ? 'Será usado para o pagamento'
                  : 'Quem autoriza e acompanha a inscrição'
              }
            />
            {isSuite && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
                <p className="text-foreground/80">
                  ℹ️ Os dados do responsável serão utilizados para gerar o link
                  de pagamento da suíte (R$ 800,00 total).
                </p>
              </div>
            )}
            {renderResponsibleFields()}
          </section>
        )}

        {/* Navigation Buttons */}
        <div className="p-6 flex gap-3">
          {currentStep !== 'participant' && (
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 text-sm font-medium rounded-xl border border-border hover:bg-muted/50 transition-colors"
            >
              ← Voltar
            </button>
          )}

          {currentStep !== 'responsible' ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all"
            >
              Próximo →
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processando...
                </span>
              ) : (
                'Continuar para pagamento →'
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="px-6 pb-6">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive">
              {error}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
