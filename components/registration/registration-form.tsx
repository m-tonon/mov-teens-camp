"use client";

import { useState } from "react";
import {
  PaymentInfo,
  RegistrationFormData,
} from "@/shared/registration.interface";
import { saveRegistration } from "@/services/registration";

interface Props {
  onSubmit: (data: RegistrationFormData) => void;
}

export function RegistrationForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    birthDate: "",
    age: null,
    gender: "",
    identityDocument: "",
    address: "",
    churchMembership: "",
    churchName: "",
    healthInsurance: "",
    medications: "",
    allergies: "",
    specialNeeds: "",
    responsibleInfo: {
      name: "",
      document: "",
      phone: "",
      email: "",
      relation: "",
    },
    parentalAuthorization: false,
    payment: {
      referenceId: "",
      paymentConfirmed: false,
      amount: 28000,
      paymentLink: "",
    },
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateAge = (birthDate: string) => {
    const date = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return age;
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.replace(/(\d{1,2})/, "($1");
    if (digits.length <= 7) return digits.replace(/(\d{2})(\d+)/, "($1) $2");
    if (digits.length <= 11)
      return digits.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
    return digits;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name === "responsibleInfo.document") {
      setFormData((prev) => ({
        ...prev,
        responsibleInfo: {
          ...prev.responsibleInfo,
          document: formatCPF(value),
        },
      }));
      return;
    }

    if (name === "responsibleInfo.phone") {
      setFormData((prev) => ({
        ...prev,
        responsibleInfo: { ...prev.responsibleInfo, phone: formatPhone(value) },
      }));
      return;
    }

    if (name.startsWith("responsibleInfo.")) {
      const key = name.split(".")[1];

      const formattedValue =
        key === "relation"
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : value;

      setFormData((prev) => ({
        ...prev,
        responsibleInfo: { ...prev.responsibleInfo, [key]: formattedValue },
      }));
      return;
    }

    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === "birthDate") {
      setFormData((prev) => ({
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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Mark all required fields as touched
    const allFields = [
      "name",
      "birthDate",
      "gender",
      "identityDocument",
      "responsibleInfo.name",
      "responsibleInfo.document",
      "responsibleInfo.phone",
      "responsibleInfo.email",
      ...(isMinor ? ["parentalAuthorization"] : []),
    ];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));

    // Guard: block if age is invalid
    if (ageError) {
      setLoading(false);
      return;
    }

    try {
      const referenceId = generateReferenceId();

      const checkoutRes = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId,
          amount: formData.payment.amount,
          email: formData.responsibleInfo.email,
          name: formData.responsibleInfo.name,
          cpf: formData.responsibleInfo.document.replace(/\D/g, ""),
          phone: formData.responsibleInfo.phone,
        }),
      });

      if (!checkoutRes.ok) throw new Error("Falha ao gerar link de pagamento.");

      const { paymentLink } = await checkoutRes.json();

      const paymentData: PaymentInfo = {
        referenceId,
        paymentConfirmed: false,
        paymentLink: paymentLink,
        amount: formData.payment.amount,
        name: formData.responsibleInfo.name,
        cpf: formData.responsibleInfo.document.replace(/\D/g, ""),
        email: formData.responsibleInfo.email,
        phone: formData.responsibleInfo.phone,
      };

      const updatedFormData: RegistrationFormData = {
        ...formData,
        payment: paymentData,
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
          : "Erro ao salvar inscrição. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const age = formData.birthDate ? calculateAge(formData.birthDate) : null;
  const ageError =
    age !== null && age < 12
      ? "O acampante deve ter pelo menos 12 anos."
      : null;

  const inputBase =
    "w-full bg-background border rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/50";
  const inputNormal = `${inputBase} border-border`;
  const inputError = `${inputBase} border-destructive/60 bg-destructive/5 focus:ring-destructive/30 focus:border-destructive`;

  const getInputClass = (field: string, value: string | null | boolean) => {
    if (!touched[field]) return inputNormal;
    const isEmpty =
      value === "" || value === null || value === false || value === undefined;
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

  const isMinor = age !== null && age < 18;

  const isFormValid =
    !!formData.name &&
    !!formData.birthDate &&
    !!formData.gender &&
    !!formData.identityDocument &&
    !!formData.responsibleInfo.name &&
    !!formData.responsibleInfo.document &&
    !!formData.responsibleInfo.phone &&
    !!formData.responsibleInfo.email &&
    (!isMinor || formData.parentalAuthorization) &&
    !ageError;

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

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border"
      >
        {/* ── Acampante ── */}
        <section className="p-6 space-y-4">
          <SectionDivider
            icon="🧑"
            title="Dados do Acampante"
            subtitle="Campos com * são obrigatórios"
          />

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Nome completo *
            </label>
            <input
              name="name"
              placeholder="Ex: Maria da Silva"
              className={getInputClass("name", formData.name)}
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur("name")}
              required
            />
            {touched["name"] && !formData.name && (
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
                className={getInputClass("birthDate", formData.birthDate)}
                value={formData.birthDate}
                onChange={handleChange}
                onBlur={() => handleBlur("birthDate")}
                required
              />
              {touched["birthDate"] && !formData.birthDate && (
                <FieldError message="Data obrigatória." />
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Idade (calculada)
              </label>
              <div
                className={`${inputNormal} text-center font-semibold ${age !== null ? (ageError ? "text-destructive bg-destructive/5" : "text-primary") : "text-muted-foreground/40"}`}
              >
                {age !== null ? `${age} anos` : "—"}
              </div>
              {ageError && <FieldError message={ageError} />}
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Gênero *
              </label>
              <select
                name="gender"
                className={getInputClass("gender", formData.gender)}
                value={formData.gender}
                onChange={handleChange}
                onBlur={() => handleBlur("gender")}
                required
              >
                <option value="">Selecione...</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
              {touched["gender"] && !formData.gender && (
                <FieldError message="Selecione o gênero." />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Documento de identidade * (RG ou Certidão de Nascimento)
            </label>
            <input
              name="identityDocument"
              placeholder="Número do documento"
              className={getInputClass(
                "identityDocument",
                formData.identityDocument,
              )}
              value={formData.identityDocument}
              onChange={handleChange}
              onBlur={() => handleBlur("identityDocument")}
              required
            />
            {touched["identityDocument"] && !formData.identityDocument && (
              <FieldError message="Documento obrigatório." />
            )}
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
              value={formData.address}
              onChange={handleChange}
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
                value={formData.churchMembership}
                onChange={handleChange}
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
                value={formData.churchName}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* ── Saúde ── */}
        <section className="p-6 space-y-4">
          <SectionDivider
            icon="🏥"
            title="Informações de Saúde"
            subtitle="Nos ajude a cuidar melhor do seu filho(a)"
          />

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">
              Plano de saúde
            </label>
            <input
              name="healthInsurance"
              placeholder="Nome do plano (se possuir)"
              className={inputNormal}
              value={formData.healthInsurance}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground mt-1.5 bg-muted/50 rounded-lg px-3 py-2">
              <strong>Obs:</strong> Sem plano de saúde e sem contato com o
              responsável, o acampante será levado ao posto de saúde mais
              próximo.
            </p>
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
              value={formData.medications}
              onChange={handleChange}
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
              value={formData.allergies}
              onChange={handleChange}
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
              value={formData.specialNeeds}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* ── Responsável ── */}
        <section className="p-6 space-y-4">
          <SectionDivider
            icon="👤"
            title="Informações do Responsável"
            subtitle="Quem autoriza e acompanha a inscrição"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Nome do responsável *
              </label>
              <input
                name="responsibleInfo.name"
                placeholder="Nome completo"
                className={getInputClass(
                  "responsibleInfo.name",
                  formData.responsibleInfo.name,
                )}
                value={formData.responsibleInfo.name}
                onChange={handleChange}
                onBlur={() => handleBlur("responsibleInfo.name")}
                required
              />
              {touched["responsibleInfo.name"] &&
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
                  "responsibleInfo.document",
                  formData.responsibleInfo.document,
                )}
                value={formData.responsibleInfo.document}
                onChange={handleChange}
                onBlur={() => handleBlur("responsibleInfo.document")}
                maxLength={14}
                required
              />
              {touched["responsibleInfo.document"] &&
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
                  "responsibleInfo.phone",
                  formData.responsibleInfo.phone,
                )}
                value={formData.responsibleInfo.phone}
                onChange={handleChange}
                onBlur={() => handleBlur("responsibleInfo.phone")}
                maxLength={15}
                required
              />
              {touched["responsibleInfo.phone"] &&
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
                onChange={handleChange}
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
                "responsibleInfo.email",
                formData.responsibleInfo.email,
              )}
              value={formData.responsibleInfo.email}
              onChange={handleChange}
              onBlur={() => handleBlur("responsibleInfo.email")}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Necessário para processar o pagamento e enviar confirmações.
            </p>
            {touched["responsibleInfo.email"] &&
              !formData.responsibleInfo.email && (
                <FieldError message="E-mail obrigatório." />
              )}
          </div>
        </section>

        {/* ── Autorização ── */}
        {isMinor && (
          <section className="p-6 space-y-4">
            <label
              className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                formData.parentalAuthorization
                  ? "border-primary/40 bg-primary/5"
                  : touched["parentalAuthorization"]
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border hover:bg-muted/50"
              }`}
            >
              <input
                type="checkbox"
                name="parentalAuthorization"
                checked={formData.parentalAuthorization}
                onChange={handleChange}
                onBlur={() => handleBlur("parentalAuthorization")}
                className="mt-0.5 w-5 h-5 accent-primary flex-shrink-0"
              />
              <span className="text-sm leading-relaxed text-foreground/80">
                Autorizo o menor acima a participar do evento{" "}
                <strong className="text-foreground">3º ACAMPA TEENS</strong> no
                Maanaim — Estr. Arns, 1516, Mandaguaçu - PR, no período de{" "}
                <strong className="text-foreground">
                  05 a 07 de Junho de 2026
                </strong>
                . Esta autorização está de acordo com o ECA (lei 8.069/90).
              </span>
            </label>
            {touched["parentalAuthorization"] &&
              !formData.parentalAuthorization && (
                <FieldError message="A autorização dos pais/responsáveis é obrigatória." />
              )}
          </section>
        )}

        {/* ── Submit ── */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-sm text-destructive flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full py-4 text-sm font-semibold rounded-xl bg-primary text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Salvando inscrição...
              </span>
            ) : (
              "Continuar para pagamento →"
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground mt-3">
            Sua vaga só é garantida após a confirmação do pagamento.
          </p>
        </div>
      </form>
    </div>
  );
}
