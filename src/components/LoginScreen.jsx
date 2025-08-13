import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword } from "../utils/validators";

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth(); // Removemos loading del contexto
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Evitar múltiples envíos
        if (isSubmitting) {
            return;
        }

        setError("");
        setIsSubmitting(true);

        // Validaciones básicas (solo formato, no complejidad)
        if (!email.trim()) {
            setError('El email es requerido');
            setIsSubmitting(false);
            return;
        }

        // Validación básica de formato de email (no tan estricta)
        if (!email.includes('@') || !email.includes('.')) {
            setError('Por favor ingresa un email válido');
            setIsSubmitting(false);
            return;
        }

        if (!password.trim()) {
            setError('La contraseña es requerida');
            setIsSubmitting(false);
            return;
        }
        
        // Sin validaciones complejas de contraseña para login
        // El servidor validará las credenciales

        try {
            console.log("Intentando login con:", { email, password: "***" });
            const result = await login(email, password);
            console.log("Resultado del login:", result);
            if (result) {
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.error("Error en login:", error);
            setError(error.message || 'Error al iniciar sesión. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
        style={{
        backgroundImage:
            "url('https://media1.tenor.com/m/RW-V8aLlR6QAAAAC/toon-link-dr-livesey.gif')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",

        }}
    >
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white/20">
        <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-wide">
            Bienvenido a Kakariko Store
        </h2>

        {/* Mensaje de error */}
        {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <div className="flex items-center">
                <span className="mr-2">❌</span>
                <span>{error}</span>
            </div>
            </div>
        )}

        <form className="space-y-5" noValidate>
            <div>
            <input
                type="email"
                placeholder="Correo electrónico"
                required
                className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                value={email}
                onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
                }}
                onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
                }}
            />
            </div>

            <div>
            <input
                type="password"
                placeholder="Contraseña"
                required
                className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-white/70"
                value={password}
                onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
                }}
                onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
                }}
            />
            </div>

            <button
            type="button"
            onClick={handleLogin}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isSubmitting ? "Iniciando sesión..." : "Entrar"}
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-white">
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="text-red-400 hover:underline font-medium">
            Regístrate
            </Link>
        </div>
        </div>
    </div>
    );

}

export default LoginScreen