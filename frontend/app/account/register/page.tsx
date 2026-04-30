"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { storeSession } from "@/lib/auth";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: "",
    Surname: "",
    CI: "",
    Email: "",
    PhoneNumber: "",
    Password: "",
    confirmPassword: "",
  });
  const [redirectTo, setRedirectTo] = useState("/account");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    setRedirectTo(redirect || "/account");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.Password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.registerCustomer({
        Name: formData.Name,
        Surname: formData.Surname,
        CI: formData.CI,
        Email: formData.Email,
        PhoneNumber: formData.PhoneNumber,
        Password: formData.Password,
      });

      storeSession(response.data);
      toast.success("Cuenta creada correctamente");
      router.push(redirectTo);
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "No se pudo registrar la cuenta";
      toast.error(message);
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all";
  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="max-w-2xl w-full">
        {/* Theme toggle */}
        {mounted && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Logo + header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Cine<span className="text-red-600">book</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Crea tu cuenta
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Regístrate para comprar entradas, ver tu historial y valorar las películas que viste.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-white/5 rounded-2xl shadow-sm p-8">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className={labelClass}>Nombre</label>
              <input
                type="text"
                required
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                className={inputClass}
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className={labelClass}>Apellido</label>
              <input
                type="text"
                required
                value={formData.Surname}
                onChange={(e) => setFormData({ ...formData, Surname: e.target.value })}
                className={inputClass}
                placeholder="Tu apellido"
              />
            </div>

            <div>
              <label className={labelClass}>Correo</label>
              <input
                type="email"
                required
                value={formData.Email}
                onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                className={inputClass}
                placeholder="correo@ejemplo.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className={labelClass}>CI</label>
              <input
                type="text"
                required
                value={formData.CI}
                onChange={(e) => setFormData({ ...formData, CI: e.target.value })}
                className={inputClass}
                placeholder="Cédula de identidad"
              />
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <input
                type="tel"
                required
                value={formData.PhoneNumber}
                onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                className={inputClass}
                placeholder="Número de teléfono"
                autoComplete="tel"
              />
            </div>

            <div>
              <label className={labelClass}>Contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.Password}
                onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
                className={inputClass}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Confirmar contraseña</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={inputClass}
                placeholder="Repite la contraseña"
                autoComplete="new-password"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ¿Ya tienes cuenta?{" "}
            </span>
            <Link
              href={`/account/login?redirect=${encodeURIComponent(redirectTo)}`}
              className="text-sm text-red-600 font-semibold hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-400 dark:text-gray-600 text-xs mt-6">
          Proyecto SIS 226 · 2026
        </p>
      </div>
    </div>
  );
}
