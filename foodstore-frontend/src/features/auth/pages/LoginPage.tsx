import { useForm } from "@tanstack/react-form";
import { useNavigate, Link } from "react-router-dom";

import { useAuthStore } from "../store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

export default function LoginPage() {
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      try {
        await login(value.email, value.password);
        showNotification("Ingreso correcto");
        navigate("/categories");
      } catch {
        form.setFieldValue("password", "");
        alert("Email o contraseña incorrectos");
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
          Iniciar sesión
        </h1>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
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
                  onChange={(event) => field.handleChange(event.target.value)}
                  className="form-input"
                  placeholder="ejemplo@correo.com"
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
                  placeholder="Tu contraseña"
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
                className="btn btn-primary mt-2"
              >
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </button>
            )}
          />
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Todavía no tenés una cuenta?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary hover:underline"
          >
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}