'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ClipboardList,
  FileSpreadsheet,
  UserPlus,
  Users,
} from 'lucide-react';
import { Toaster } from 'sonner';
import type { EbdStudentDto } from '@/shared/ebd.interface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudentRegistrationSection } from '@/components/ebd/student-registration-section';
import { RollCallSection } from '@/components/ebd/roll-call-section';
import { ReportsSection } from '@/components/ebd/reports-section';

export default function EbdPage() {
  const [students, setStudents] = useState<EbdStudentDto[]>([]);
  const [studentsFetched, setStudentsFetched] = useState(false);
  const [tab, setTab] = useState('cadastro');

  const refreshStudents = useCallback(async () => {
    try {
      const res = await fetch('/api/ebd/students');
      const data = await res.json();
      if (res.ok) {
        setStudents(data);
      }
    } catch {
      setStudents([]);
    } finally {
      setStudentsFetched(true);
    }
  }, []);

  useEffect(() => {
    void refreshStudents();
  }, [refreshStudents]);

  return (
    <div className="px-4 py-4 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <Toaster richColors position="top-center" />
      <header className="space-y-1">
        <div className="flex items-center gap-2 text-primary">
          <ClipboardList className="size-6 shrink-0" />
          <h1 className="text-lg sm:text-xl font-black tracking-tight text-foreground">
            EBD — Chamada
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Escola Bíblica Dominical: cadastro, presença e relatórios.
        </p>
      </header>

      <Tabs value={tab} onValueChange={setTab} className="gap-4">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1 sticky top-0 z-20 bg-muted/95 backdrop-blur-sm supports-[backdrop-filter]:bg-muted/80">
          <TabsTrigger
            value="cadastro"
            className="cursor-pointer flex flex-col gap-0.5 py-2.5 min-h-11 text-xs sm:text-sm sm:flex-row sm:gap-1.5"
          >
            <UserPlus className="size-4 shrink-0" />
            <span>Cadastro</span>
          </TabsTrigger>
          <TabsTrigger
            value="chamada"
            className="cursor-pointer flex flex-col gap-0.5 py-2.5 min-h-11 text-xs sm:text-sm sm:flex-row sm:gap-1.5"
          >
            <Users className="size-4 shrink-0" />
            <span>Chamada</span>
          </TabsTrigger>
          <TabsTrigger
            value="relatorios"
            className="cursor-pointer flex flex-col gap-0.5 py-2.5 min-h-11 text-xs sm:text-sm sm:flex-row sm:gap-1.5"
          >
            <FileSpreadsheet className="size-4 shrink-0" />
            <span>Relatórios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cadastro" className="mt-0 focus-visible:outline-none">
          <StudentRegistrationSection
            students={students}
            studentsFetched={studentsFetched}
            onChanged={refreshStudents}
          />
        </TabsContent>

        <TabsContent
          value="chamada"
          forceMount
          className="mt-0 focus-visible:outline-none data-[state=inactive]:hidden"
        >
          <RollCallSection students={students} studentsFetched={studentsFetched} />
        </TabsContent>

        <TabsContent value="relatorios" className="mt-0 focus-visible:outline-none">
          <ReportsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
