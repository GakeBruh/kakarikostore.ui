import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidEmail, validatePassword, getPasswordStrength } from "../utils/validators";

const SignupScreen = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSignup = async () => {
        if (isSubmitting) return;
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (!formData.name.trim()) { setError('El nombre es requerido'); setIsSubmitting(false); return; }
        if (!formData.lastname.trim()) { setError('El apellido es requerido'); setIsSubmitting(false); return; }
        if (!formData.email.trim()) { setError('El email es requerido'); setIsSubmitting(false); return; }
        if (!isValidEmail(formData.email)) { setError('Por favor ingresa un email válido'); setIsSubmitting(false); return; }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) { setError(passwordValidation.message); setIsSubmitting(false); return; }
        if (formData.password !== formData.confirmPassword) { setError('Las contraseñas no coinciden'); setIsSubmitting(false); return; }

        try {
            const result = await register(formData.name, formData.lastname, formData.email, formData.password);
            if (result) {
                setSuccess('¡Cuenta creada exitosamente! Redirigiendo al login...');
                setFormData({ name: '', lastname: '', email: '', password: '', confirmPassword: '' });
                navigate('/login', { replace: true });
            }
        } catch (error) {
            setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-[1200px] bg-[#13131a] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                
            {/* Left Section */}
            <div className="w-full md:w-1/2 relative">
                <Link
                    to="/login"
                    className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-colors z-10"
                >
                    Back to login →
                </Link>
                <div className="relative h-full">
                    <img
                        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ef2a3af3-e990-4391-a8ad-3bc6e3897e5c/dg3mhpk-905bc620-b1b0-456f-a62d-4d521c25b8b9.png/v1/fill/w_1024,h_1070,q_80,strp/colour_wheel_challenge__video_game_characters__by_ruebharb_dg3mhpk-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA3MCIsInBhdGgiOiJcL2ZcL2VmMmEzYWYzLWU5OTAtNDM5MS1hOGFkLTNiYzZlMzg5N2U1Y1wvZGczbWhway05MDViYzYyMC1iMWIwLTQ1NmYtYTYyZC00ZDUyMWMyNWI4YjkucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.eKMenlgf4qyMB7X8MRU_-IaOSU9xSxgts5m1-YyY75E"
                        alt="Desert landscape"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-purple-900/30"></div>
                    <div className="absolute bottom-12 left-12 text-white">
                        <h2 className="text-2xl md:text-4xl font-semibold mb-2"></h2>
                        <h2 className="text-2xl md:text-4xl font-semibold">Bienvenido jugador</h2>
                        <div className="flex gap-2 mt-6">
                            <div className="w-4 h-1 bg-white/30 rounded"></div>
                            <div className="w-4 h-1 bg-white/30 rounded"></div>
                            <div className="w-4 h-1 bg-white rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

                {/* Right Section */}
                <div className="w-full md:w-1/2 p-6 md:p-12">
                    <div className="max-w-md mx-auto">
                        <h1 className="text-white text-2xl md:text-4xl font-semibold mb-2">Crea tu cuenta en Kakariko Store</h1>
                        <p className="text-gray-400 mb-8">
                            Ya tienes una cuenta?{" "}
                            <Link to="/login" className="text-white hover:underline">Log in</Link>
                        </p>

                        {/* Mensajes de error y éxito */}
                        {error && (
                            <div className={`mb-4 p-3 rounded-md border ${
                                error.includes('email ya está registrado') || error.includes('usuario ya existe')
                                    ? 'bg-orange-100 border-orange-400 text-orange-700'
                                    : 'bg-red-100 border-red-400 text-red-700'
                            }`}>
                                <div className="flex items-center">
                                    <span className="mr-2">
                                        {error.includes('email ya está registrado') || error.includes('usuario ya existe')
                                            ? '⚠️'
                                            : '❌'
                                        }
                                    </span>
                                    <span>{error}</span>
                                </div>
                                {(error.includes('email ya está registrado') || error.includes('usuario ya existe')) && (
                                    <div className="mt-2 text-sm">
                                        <Link to="/login" className="text-pink-600 hover:text-pink-700 underline">
                                            ¿Ya tienes cuenta? Inicia sesión aquí
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                        {success && (
                            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
                                <div className="flex items-center">
                                    <span className="mr-2">✅</span>
                                    <span>{success}</span>
                                </div>
                            </div>
                        )}

                        {/* Formulario */}
                        <form className="space-y-4" noValidate>
                            <div className="flex flex-col md:flex-row gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Nombre"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full md:w-1/2 bg-[#1c1c24] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Apellido"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    className="w-full md:w-1/2 bg-[#1c1c24] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#1c1c24] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Ingresa una contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-[#1c1c24] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirme su contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-[#1c1c24] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                            <button
                                type="button"
                                onClick={handleSignup}
                                disabled={isSubmitting}
                                className="w-full bg-purple-600 text-white rounded-lg p-3 hover:bg-purple-700 transition-colors"
                            >
                                {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupScreen;
