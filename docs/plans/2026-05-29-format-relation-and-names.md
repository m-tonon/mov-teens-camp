# Relation Accent Fix and Name Camel Case Formatting Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the accent bug in the "Relação com o acampante" live input field (e.g., converting "mãe" to "Mãe" instead of "MãE"), and format all registration full names (main, companion, and responsible) to title case (e.g. "Maria da Silva") when saving/submitting the registration.

**Architecture:** 
1. Replace the regex word boundary logic (`\b\w`) in `hooks/use-registration-form.ts`'s live input handler with a robust, accent-aware capitalize function that lowercases the text and capitalizes the first character of each word.
2. Implement a professional Portuguese name formatter (`formatName`) that capitalizes the first character of each name part while leaving minor prepositions (e.g., "de", "da", "do", "dos", "das", "e") in lowercase.
3. Integrate this name formatting logic into `handleSubmit` in `hooks/use-registration-form.ts` right before generating checkout payment links and saving registrations.

**Tech Stack:** React, Next.js, TypeScript

---

### Task 1: Fix live formatting accent bug in Relação field

**Files:**
- Modify: [use-registration-form.ts](file:///home/mtonon/Web%20Dev/Projects/IPVO/mov-teens-camp/hooks/use-registration-form.ts#L160-L163)

**Step 1: Check existing behavior**

Verify line 160 has:
```typescript
      const capitalizeWords = (text: string) =>
        text.replace(/\b\w/g, (char) => char.toUpperCase());
```

**Step 2: Update regex to accent-aware capitalize function**

Modify `capitalizeWords` in `handleMainChange` to:
```typescript
      const capitalizeWords = (text: string) => {
        if (!text) return '';
        return text
          .toLowerCase()
          .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
      };
```

**Step 3: Run build to verify compile integrity**

Run: `pnpm run build`
Expected: Compile successfully.

**Step 4: Commit**

```bash
git add hooks/use-registration-form.ts
git commit -m "fix: resolve relation input accent capitalization bug (MãE to Mãe)"
```

---

### Task 2: Implement and integrate Name Title Case Formatting

**Files:**
- Modify: [use-registration-form.ts](file:///home/mtonon/Web%20Dev/Projects/IPVO/mov-teens-camp/hooks/use-registration-form.ts#L320)

**Step 1: Write formatName utility at the end of the file**

Add the following at the end of `hooks/use-registration-form.ts`:
```typescript
const formatName = (name: string): string => {
  if (!name) return '';
  const lowercaseWords = ['de', 'da', 'do', 'dos', 'das', 'e'];
  return name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && lowercaseWords.includes(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};
```

**Step 2: Format names on submission**

In `handleSubmit`, format all name fields before submitting:
```typescript
    try {
      const formattedMainName = formatName(formData.name);
      const formattedSuitePartnerName = isSuite ? formatName(suitePartner.name) : '';
      const formattedResponsibleName = formatName(formData.responsibleInfo.name);

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
          name: formattedResponsibleName,
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
        name: formattedResponsibleName,
        cpf: formData.responsibleInfo.document.replace(/\D/g, ''),
        email: formData.responsibleInfo.email,
        phone: formData.responsibleInfo.phone,
      };

      const updatedFormData: RegistrationFormData = {
        ...formData,
        name: formattedMainName,
        payment: paymentData,
        suitePartner: isSuite
          ? {
              ...suitePartner,
              name: formattedSuitePartnerName,
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
```

**Step 3: Run build to verify compilation**

Run: `pnpm run build`
Expected: Compile successfully with no errors.

**Step 4: Commit**

```bash
git add hooks/use-registration-form.ts
git commit -m "feat: capitalize names to title case on registration completion"
```
