'use client';

import { useState } from 'react';
import { Pencil, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import type { EbdStudentDto } from '@/shared/ebd.interface';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EbdAgeInput } from '@/components/ebd/ebd-age-input';
import { SwipeActionRow } from '@/components/ebd/swipe-action-row';
import { parseOptionalAge } from '@/lib/ebd/age-input';

type Props = {
  students: EbdStudentDto[];
  studentsFetched: boolean;
  onChanged: () => Promise<void>;
};

export function StudentRegistrationSection({
  students,
  studentsFetched,
  onChanged,
}: Props) {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editStudent, setEditStudent] = useState<EbdStudentDto | null>(null);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Informe o nome completo.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/ebd/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          age: parseOptionalAge(age),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : 'Não foi possível adicionar o aluno.',
        );
      }
      toast.success('Aluno adicionado.');
      setFullName('');
      setAge('');
      await onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao adicionar.');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (student: EbdStudentDto) => {
    setEditStudent(student);
    setEditName(student.fullName);
    setEditAge(student.age !== undefined ? String(student.age) : '');
  };

  const handleSaveEdit = async () => {
    if (!editStudent || !editName.trim()) {
      toast.error('Informe o nome completo.');
      return;
    }
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/ebd/students/${editStudent._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: editName.trim(),
          age: editAge === '' ? null : parseOptionalAge(editAge),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : 'Não foi possível salvar.',
        );
      }
      toast.success('Aluno atualizado.');
      setEditStudent(null);
      await onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/ebd/students/${deleteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Não foi possível excluir.');
      }
      toast.success('Aluno excluído.');
      setDeleteId(null);
      await onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-none sm:border sm:shadow-sm">
        <CardHeader className="px-0 sm:px-6 pt-0 sm:pt-6">
          <CardTitle className="text-lg font-black tracking-tight">
            Cadastro de alunos
          </CardTitle>
          <CardDescription>
            Adicione e gerencie os adolescentes da EBD.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 px-0 sm:px-6 pb-0 sm:pb-6">
          <form
            onSubmit={handleAdd}
            className="grid gap-4 sm:grid-cols-[1fr_120px_auto] sm:items-end"
          >
            <div className="space-y-2">
              <Label htmlFor="ebd-full-name">Nome completo</Label>
              <Input
                id="ebd-full-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nome do aluno"
                disabled={submitting}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ebd-age">Idade (opcional)</Label>
              <EbdAgeInput
                id="ebd-age"
                value={age}
                onValueChange={setAge}
                disabled={submitting}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting}
              className="cursor-pointer transition-colors duration-200 w-full sm:w-auto min-h-11 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              <UserPlus className="size-4" />
              Adicionar aluno
            </Button>
          </form>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Alunos
            </p>
            <p className="text-[10px] text-muted-foreground md:hidden leading-snug">
              Deslize à direita para editar · à esquerda para excluir
            </p>
            {!studentsFetched ? null : students.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
                Nenhum aluno cadastrado.
              </p>
            ) : (
              <ul className="divide-y divide-border border border-border rounded-xl overflow-hidden md:overflow-visible">
                {students.map((student) => (
                  <li key={student._id}>
                    <div className="md:hidden">
                      <SwipeActionRow
                        onSwipeRight={{
                          label: 'Editar',
                          icon: <Pencil className="size-4 shrink-0" />,
                          className: 'bg-primary',
                          onCommit: () => openEdit(student),
                        }}
                        onSwipeLeft={{
                          label: 'Excluir',
                          icon: <Trash2 className="size-4 shrink-0" />,
                          className: 'bg-destructive',
                          onCommit: () => setDeleteId(student._id),
                        }}
                      >
                        <div className="px-3.5 py-3 min-h-[3.5rem] flex flex-col justify-center">
                          <p className="text-sm font-medium text-foreground pr-2 leading-snug">
                            {student.fullName}
                          </p>
                          {student.age !== undefined && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {student.age} anos
                            </p>
                          )}
                        </div>
                      </SwipeActionRow>
                    </div>
                    <div className="hidden md:flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors duration-200">
                      <div>
                        <p className="text-base font-medium text-foreground">
                          {student.fullName}
                        </p>
                        {student.age !== undefined && (
                          <p className="text-sm text-muted-foreground">
                            {student.age} anos
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer min-h-10"
                          onClick={() => openEdit(student)}
                        >
                          <Pencil className="size-3.5" />
                          Editar
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="cursor-pointer min-h-10 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(student._id)}
                        >
                          <Trash2 className="size-3.5" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editStudent)}
        onOpenChange={(open) => !open && setEditStudent(null)}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar aluno</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-full-name">Nome completo</Label>
              <Input
                id="edit-full-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-age">Idade (opcional)</Label>
              <EbdAgeInput
                id="edit-age"
                value={editAge}
                onValueChange={setEditAge}
                className="h-11"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setEditStudent(null)}
            >
              Cancelar
            </Button>
            <Button
              className="cursor-pointer"
              disabled={savingEdit}
              onClick={handleSaveEdit}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir aluno?</AlertDialogTitle>
            <AlertDialogDescription>
              O histórico de presença deste aluno também será removido. Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
