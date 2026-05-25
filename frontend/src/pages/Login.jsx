import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../services/api' 
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error , setError] = useState("");
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    return(
        <div className="items-center justify-center flex flex-col gap-4 min-h-screen bg-gray-900">
            <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
            <form className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md" onSubmit={async (e) => {
                e.preventDefault();
                try{
                    const response = await login({ email, password });
                    loginUser(response.data.user, response.data.token);
                    navigate("/");
                } 
                catch (error) {
                    setError(error.response?.data?.message || "Login failed");
                }
            }}>
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block" htmlFor="email">Email:</label>
                    <input
                        className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4
  border border-gray-600 focus:outline-none focus:border-blue-500"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block" htmlFor="password">Password:</label>
                    <input
                        className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4
  border border-gray-600 focus:outline-none focus:border-blue-500"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white
  font-bold py-3 rounded-lg transition" type="submit">Login</button>
            </form>
            <p className="text-gray-400 text-center">
                Don't have an account?{" "}
                <span className="text-blue-500 cursor-pointer hover:text-blue-400"
                    onClick={() => navigate('/signup')}>
                    Sign up
                </span>
            </p>
        </div>
    )
}

export default Login;