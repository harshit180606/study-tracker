import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useState , useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getHistory } from "../services/api"

const Dashboard = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [latestLog, setLatestLog] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data.data.logs);
                if (data.data.logs.length > 0) {
                    setLatestLog(data.data.logs[0]);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    const chartData = history.map(log => ({
        date : new Date(log.date).toLocaleDateString(),
        score: log.predicted_score
    })).reverse()

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className='text-3xl font-bold'>Dashboard</h1>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => {
                    logoutUser()
                    navigate('/login')
                }}>Logout</button>
            </div>
            <p className="text-lg mb-4">Welcome, {user?.name}!</p>
            <div className="flex gap-4 mb-8">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition" onClick={() => navigate('/log')}>Log Today's Study</button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition" onClick={() => navigate('/history')}>View Full History</button>
            </div>
            <h2 className="text-2xl font-bold mb-4">Latest Study Log</h2>
            {latestLog ? (
                <div className="bg-gray-800 p-6 rounded-lg mb-8">
                    <div className="flex gap-4 mb-6">
                        <div className="bg-gray-700 rounded-xl p-6 text-center flex-1">
                            <p className="text-gray-400 text-sm mb-2">Predicted Score</p>
                            <p className="text-4xl font-bold text-blue-400">{latestLog.predicted_score}</p>
                        </div>
                        <div className="bg-gray-700 rounded-xl p-6 text-center flex-1">
                            <p className="text-gray-400 text-sm mb-2">Study Type</p>
                            <p className="text-xl font-bold text-green-400">{latestLog.cluster_label}</p>
                        </div>
                        <div className="bg-gray-700 rounded-xl p-6 text-center flex-1">
                            <p className="text-gray-400 text-sm mb-2">Last Study Date</p>
                            <p className="text-xl font-bold text-white">{new Date(latestLog.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside mb-4">
                        {latestLog.recommendations.map((rec, index) => (
                            <li className="text-lg" key={index}>{rec}</li>
                        ))}
                    </ul>
                    <h2 className="text-2xl font-bold mb-4">Score Progress</h2>
                    {history.length > 1 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 100]} />
                                <Tooltip />
                                <Line type="monotone" dataKey="score" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-lg">Log at least 2 sessions to see your progress chart.</p>
                    )}
                </div>
            ) : (
                <p className="text-lg">No logs yet — log your first study session!</p>
            )}
        </div>
    );
};
export default Dashboard