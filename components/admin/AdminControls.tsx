"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
}: {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-9999 overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6">
      <div className="flex min-h-full items-center justify-center py-6">
        <section className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/60 bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              Panel administrativo
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
          <button
            className="cursor-pointer rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
            onClick={onClose}
            type="button"
          >
            Cerrar
          </button>
        </div>
        {children}
        </section>
      </div>
    </div>,
    document.body,
  );
}

export function AdminControls() {
  const [mounted, setMounted] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setMounted(true), 0);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
        <button
          className="cursor-pointer rounded-2xl bg-[linear-gradient(135deg,#2563eb,#1d4ed8)] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/12 transition hover:-translate-y-0.5 hover:shadow-blue-900/20"
          onClick={() => setCreateOpen(true)}
          type="button"
        >
          Nuevo invitado
        </button>
        <button
          className="cursor-pointer rounded-2xl border border-blue-100 bg-white/90 px-4 py-2.5 text-sm font-semibold text-blue-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
          onClick={() => setImportOpen(true)}
          type="button"
        >
          Importar
        </button>
        <a
          className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          download
          href="/admin/template"
        >
          Plantilla
        </a>
        <a
          className="rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
          href="/admin/export"
        >
          Exportar
        </a>
      </div>

      {mounted ? (
        <>
          <Modal
            description="Crea un enlace unico para una familia, pareja o invitado individual."
            isOpen={createOpen}
            onClose={() => setCreateOpen(false)}
            title="Crear invitado"
          >
            <form
              action="/admin/guests"
              className="mt-6 grid gap-3 sm:grid-cols-2"
              method="post"
            >
              <input
                className="admin-control sm:col-span-2"
                name="invited_name"
                placeholder="Familia Perez"
                required
              />
              <input className="admin-control" name="phone" placeholder="Telefono" />
              <input
                className="admin-control"
                name="email"
                placeholder="Email"
                type="email"
              />
              <input
                className="admin-control"
                defaultValue="1"
                min="1"
                name="max_guests"
                placeholder="Cupos"
                type="number"
              />
              <input
                className="admin-control"
                name="code"
                placeholder="codigo-opcional"
              />
              <input className="admin-control" name="group_name" placeholder="Grupo" />
              <input className="admin-control" name="table_name" placeholder="Mesa" />
              <button className="cursor-pointer rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-950 sm:col-span-2">
                Guardar invitado
              </button>
            </form>
          </Modal>

          <Modal
            description="Descarga el Excel, completalo y subelo para crear invitados en lote."
            isOpen={importOpen}
            onClose={() => setImportOpen(false)}
            title="Importar plantilla"
          >
            <div className="mt-6 grid gap-3">
              <a
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-blue-50"
                download
                href="/admin/template"
              >
                Descargar plantilla XLSX
              </a>
              <form
                action="/admin/import"
                className="grid gap-3"
                encType="multipart/form-data"
                method="post"
              >
                <input
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                  name="template"
                  required
                  type="file"
                />
                <button className="cursor-pointer rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
                  Subir plantilla
                </button>
              </form>
            </div>
          </Modal>
        </>
      ) : null}
    </>
  );
}
