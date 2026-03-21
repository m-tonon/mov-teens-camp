"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface Registration {
  _id: string;
  name: string;
  age: number;
  gender: string;
  churchName: string;
  responsibleInfo: {
    name: string;
    phone: string;
    email: string;
  };
  payment: {
    paymentConfirmed: boolean;
    referenceId: string;
    amount: number;
  };
  createdAt: string;
}

type PaymentFilter = "all" | "paid" | "pending";
type SortField = "name" | "age" | "createdAt";
type SortDir = "asc" | "desc";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4"
    >
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
          {label}
        </p>
        <p className="text-2xl font-black tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PaymentFilter>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [exporting, setExporting] = useState(false);
  const [genderFilter, setGenderFilter] = useState<
    "all" | "Masculino" | "Feminino"
  >("all");

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/registration/export");
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error("Failed to fetch registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filtered = registrations
    .filter((r) => {
      if (filter === "paid") return r.payment?.paymentConfirmed === true;
      if (filter === "pending") return r.payment?.paymentConfirmed === false;
      return true;
    })
    .filter((r) => {
      if (genderFilter !== "all") return r.gender === genderFilter;
      return true;
    })
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        r.name?.toLowerCase().includes(q) ||
        r.responsibleInfo?.name?.toLowerCase().includes(q) ||
        r.churchName?.toLowerCase().includes(q) ||
        r.payment?.referenceId?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let valA: any = a[sortField as keyof Registration];
      let valB: any = b[sortField as keyof Registration];
      if (sortField === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const total = registrations.length;
  const paid = registrations.filter((r) => r.payment?.paymentConfirmed).length;
  const pending = total - paid;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ChevronUp className="w-3 h-3 opacity-20" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-primary" />
    ) : (
      <ChevronDown className="w-3 h-3 text-primary" />
    );
  };

  const handleExport = (paymentOnly: boolean) => {
    const url = `/api/registration/export?csv=1${paymentOnly ? "&paid=true" : ""}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscricoes-acampateens-${Date.now()}.csv`;
    a.click();
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "—";
    const d = phone.replace(/\D/g, "");
    if (d.length === 11)
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    return phone;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black tracking-tight text-foreground">
            Inscrições
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            3º Acampa Teens · 05–07 Junho 2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchRegistrations}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Atualizar</span>
          </button>
          <button
            onClick={() => handleExport(false)}
            disabled={exporting}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total"
          value={total}
          color="bg-primary/10 text-primary"
          delay={0}
        />
        <StatCard
          icon={CheckCircle}
          label="Confirmados"
          value={paid}
          color="bg-green-500/10 text-green-400"
          delay={0.05}
        />
        <StatCard
          icon={Clock}
          label="Pendentes"
          value={pending}
          color="bg-amber-500/10 text-amber-400"
          delay={0.1}
        />
      </div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, igreja, ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-background border border-border rounded-lg p-0.5 text-xs">
              {(["all", "paid", "pending"] as PaymentFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    filter === f
                      ? f === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : f === "pending"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f === "all" ? "Todos" : f === "paid" ? "Pagos" : "Pendentes"}
                </button>
              ))}
            </div>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="all">Todos gêneros</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground text-sm">
            Nenhuma inscrição encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-8">
                    #
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <span className="flex items-center gap-1">
                      Nome <SortIcon field="name" />
                    </span>
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("age")}
                  >
                    <span className="flex items-center gap-1">
                      Idade <SortIcon field="age" />
                    </span>
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Gênero
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Igreja
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Responsável
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Pagamento
                  </th>
                  <th
                    className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => handleSort("createdAt")}
                  >
                    <span className="flex items-center gap-1">
                      Data <SortIcon field="createdAt" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((reg, i) => (
                  <motion.tr
                    key={reg._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: i * 0.02 }}
                    className={`hover:bg-muted/30 transition-colors ${!reg.payment?.paymentConfirmed ? "opacity-60" : ""}`}
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {i + 1}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      {reg.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {reg.age ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${reg.gender === "Feminino" ? "bg-pink-500/10 text-pink-400" : "bg-blue-500/10 text-blue-400"}`}
                      >
                        {reg.gender || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {reg.churchName || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {reg.responsibleInfo?.name || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                      {formatPhone(reg.responsibleInfo?.phone)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${reg.payment?.paymentConfirmed ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${reg.payment?.paymentConfirmed ? "bg-green-400" : "bg-amber-400"}`}
                        />
                        {reg.payment?.paymentConfirmed
                          ? "Confirmado"
                          : "Pendente"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {reg.createdAt
                        ? new Date(reg.createdAt).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        {!loading && (
          <div className="px-6 py-3 border-t border-border flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Mostrando{" "}
              <span className="text-foreground font-medium">
                {filtered.length}
              </span>{" "}
              de <span className="text-foreground font-medium">{total}</span>{" "}
              inscrições
            </p>
            <button
              onClick={() => handleExport(filter === "paid")}
              disabled={filtered.length === 0}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              <Download className="w-3 h-3" />
              Exportar filtro atual
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
