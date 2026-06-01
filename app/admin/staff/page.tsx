'use client';

import { StaffPaymentForm } from '@/components/staff/staff-payment-form';

export default function AdminStaffPaymentPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black tracking-tight text-foreground">
          Pagamento staff
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Gerar link PagSeguro para inscrição da equipe
        </p>
      </div>

      <StaffPaymentForm embedded />
    </div>
  );
}
