import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { registrar } from "../services/auth.service";

export default function RegisterPage() {
    const [errorRegistro, setErrorRegistro] = useState<string | null>(null);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            username: "",
            full_name: "",
            email: "",
            celular: "",
            password: "",
        },

        onSubmit: async ({ value }) => {
            try {
                await registrar({
                    username: value.username,
                    full_name: value.full_name,
                    email: value.email,
                    password: value.password,
                });

                alert("Usuario registrado correctamente");
                navigate("/login");
            } catch (error) {
                setErrorRegistro(
                    error instanceof Error
                        ? error.message
                        : "No se pudo completar el registro."
                );
            }
        },
    });

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-md">
                <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
                    Crear cuenta
                </h1>

                {errorRegistro && (
                    <div className="mb-3 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
                        {errorRegistro}
                    </div>
                )}

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        form.handleSubmit();
                    }}
                    className="flex flex-col gap-4"
                >
                    <form.Field
                        name="username"
                        children={(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className="form-label">
                                    Username
                                </label>

                                <input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}
                    />

                    <form.Field
                        name="full_name"
                        children={(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className="form-label">
                                    Nombre Completo
                                </label>

                                <input
                                    id={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}
                    />

                    <form.Field
                        name="email"
                        children={(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className="form-label">
                                    Email
                                </label>

                                <input
                                    id={field.name}
                                    type="email"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => {
                                        field.handleChange(event.target.value);
                                        setErrorRegistro(null);
                                    }}
                                    className="form-input"
                                    required
                                />
                            </div>
                        )}
                    />

                    <form.Field
                        name="password"
                        children={(field) => (
                            <div className="flex flex-col gap-1">
                                <label htmlFor={field.name} className="form-label">
                                    Contraseña
                                </label>

                                <input
                                    id={field.name}
                                    type="password"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) => field.handleChange(event.target.value)}
                                    className="form-input"
                                    minLength={8}
                                    required
                                />
                            </div>
                        )}
                    />

                    <form.Subscribe
                        selector={(state) => state.isSubmitting}
                        children={(isSubmitting) => (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary"
                            >
                                {isSubmitting ? "Registrando..." : "Registrarse"}
                            </button>
                        )}
                    />
                </form>

                <p className="mt-6 text-center text-sm text-muted">
                    ¿Ya tenés una cuenta?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-primary hover:underline"
                    >
                        Iniciá sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}