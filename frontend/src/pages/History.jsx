import { useState , useEffect } from "react"
import { getHistory , deleteLog} from "../services/api";
import { useNavigate } from "react-router-dom";

const History = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getHistory();
                setHistory(data.data.logs);
            } catch (error) {
                console.error("Error fetching history:", error);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-6 text-white">
            <h1 className="text-3xl font-bold mb-6">History</h1>
            <button onClick={() => {navigate('/')}} className="mb-6 text-gray-400 hover:text-white transition">
                ← Back to Dashboard
            </button>
            {history.length > 0 ? (
                <ul className="max-w-2xl mx-auto">
                    {history.map((entry) => (
                        <li className="bg-gray-800 rounded-xl p-6 mb-4" key={entry._id}>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-700 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">Study Hours</p>
                                    <p className="text-white font-bold">{entry.study_hours}</p>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">Sleep Hours</p>
                                    <p className="text-white font-bold">{entry.sleep_hours}</p>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">Breaks Taken</p>
                                    <p className="text-white font-bold">{entry.breaks_taken}</p>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">Attendance</p>
                                    <p className="text-white font-bold">{entry.attendance}</p>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">Predicted Score</p>
                                    <p className="text-white font-bold">{entry.predicted_score}</p>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-3">
                                    <p className="text-gray-400 text-xs mb-1">Study Type</p>
                                    <p className="text-white font-bold">{entry.cluster_label}</p>
                                </div>
                            </div>
                            <h4 className="font-bold mb-2">Recommendations:</h4>
                            <ul className="list-disc list-inside">
                                {entry.recommendations.map((rec, index) => (
                                    <li key={index} className="text-gray-300 mb-1">{rec}</li>
                                ))}
                            </ul>
                            <p className="text-gray-300 text-md">Date : {new Date(entry.date).toLocaleDateString()}</p>
                            <button onClick={async () => {
                                try {
                                    await deleteLog(entry._id);
                                    setHistory(history.filter((log) => log._id !== entry._id));
                                } catch (error) {
                                    console.error("Error deleting log:", error);
                                }
                            }} className="rounded-lg bg-red-500 p-2 mt-4 hover:bg-red-600 transition">
                                Delete Log
                            </button>
                        </li>
                    ))}
                </ul>
                
            ) : (
                <p className="text-red-400 text-sm mt-2">No history available.</p>
            )}
        </div>
    );
};
export default History