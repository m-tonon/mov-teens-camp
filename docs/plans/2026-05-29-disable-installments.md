# Disable Installments Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Disable the installments for camp registrations in the UI and backend payment integration (PagBank/PagSeguro) by utilizing the pre-existing fallback logic and setting the gateway installment limit to 1.

**Architecture:** Change the client-side feature flag constants (`installmentsAvailable = false`) in both the payment section and pricing section components. Additionally, update the PagBank checkout API route payload configuration to limit `installments_limit` to `1` so the credit card gateway restricts checkout payments to single payment in full.

**Tech Stack:** Next.js, React, Tailwind CSS, TypeScript, Axios (PagBank integration)

---

### Task 1: Update payment-section.tsx client-side constant

**Files:**
- Modify: [payment-section.tsx](file:///home/mtonon/Web%20Dev/Projects/IPVO/mov-teens-camp/components/payment/payment-section.tsx#L23)

**Step 1: Check existing behavior**

Verify line 23 of `components/payment/payment-section.tsx` contains `const installmentsAvailable = true;`.

**Step 2: Update constant to false**

Modify `components/payment/payment-section.tsx`:
```typescript
const installmentsAvailable = false;
```

**Step 3: Run lint and build to verify build integrity**

Run: `npm run lint` and `npm run build`
Expected: Passes with no typescript or lint errors.

**Step 4: Commit**

```bash
git add components/payment/payment-section.tsx
git commit -m "feat: disable installments in payment section UI fallback"
```

---

### Task 2: Update pricing-section.tsx client-side constant

**Files:**
- Modify: [pricing-section.tsx](file:///home/mtonon/Web%20Dev/Projects/IPVO/mov-teens-camp/components/camping/pricing-section.tsx#L20)

**Step 1: Check existing behavior**

Verify line 20 of `components/camping/pricing-section.tsx` contains `const installmentsAvailable = true;`.

**Step 2: Update constant to false**

Modify `components/camping/pricing-section.tsx`:
```typescript
const installmentsAvailable = false;
```

**Step 3: Run lint and build to verify build integrity**

Run: `npm run lint` and `npm run build`
Expected: Passes with no typescript or lint errors.

**Step 4: Commit**

```bash
git add components/camping/pricing-section.tsx
git commit -m "feat: disable installments in pricing section UI fallback"
```

---

### Task 3: Update API route PagBank checkout configuration

**Files:**
- Modify: [route.ts](file:///home/mtonon/Web%20Dev/Projects/IPVO/mov-teens-camp/app/api/payment/checkout/route.ts#L62)

**Step 1: Check existing behavior**

Verify line 62 of `app/api/payment/checkout/route.ts` contains `config_options: [{ option: 'installments_limit', value: '10' }],`.

**Step 2: Update installment limit option to 1**

Modify `app/api/payment/checkout/route.ts`:
```typescript
      payment_methods_configs: [
        {
          type: 'credit_card',
          config_options: [{ option: 'installments_limit', value: '1' }],
        },
      ],
```

**Step 3: Run lint and build to verify build integrity**

Run: `npm run lint` and `npm run build`
Expected: Passes successfully with no compilation errors.

**Step 4: Commit**

```bash
git add app/api/payment/checkout/route.ts
git commit -m "feat: limit PagBank credit card installments to 1"
```
