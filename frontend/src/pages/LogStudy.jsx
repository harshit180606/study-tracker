import { useState } from "react"
import { logStudy } from "../services/api"
import { useNavigate } from "react-router-dom"

const LogStudy = () => {
    const navigate = useNavigate();
    const [studyHours, setStudyHours] = useState("");
    const [sleepHours, setSleepHours] = useState("");
    const [breaksTaken, setBreaksTaken] = useState("");
    const [attendance, setAttendance] = useState("");
    const [pastScore , setPastScore] = useState("");
    const [error , setError] = useState('');
    const [result , setResult] = useState(null);
    const [loading , setLoading] = useState(false);

    return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold mb-6">Log Study</h1>
        <button className="mb-6 text-gray-400 hover:text-white transition" onClick={() => navigate('/')}>
            ← Back to Dashboard
        </button>
        <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-xl">
            <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 border border-gray-600 focus:outline-none focus:border-blue-500" type="number" placeholder="Study Hours" value={studyHours} onChange={(e) => setStudyHours(e.target.value)} />
            <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 border border-gray-600 focus:outline-none focus:border-blue-500" type="number" placeholder="Sleep Hours" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} />
            <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 border border-gray-600 focus:outline-none focus:border-blue-500" type="number" placeholder="Breaks Taken" value={breaksTaken} onChange={(e) => setBreaksTaken(e.target.value)} />
            <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 border border-gray-600 focus:outline-none focus:border-blue-500" type="number" placeholder="Attendance" value={attendance} onChange={(e) => setAttendance(e.target.value)} />
            <input className="w-full bg-gray-700 text-white rounded-lg p-3 mb-4 border border-gray-600 focus:outline-none focus:border-blue-500" type="number" placeholder="Past Score" value={pastScore} onChange={(e) => setPastScore(e.target.value)} />
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition" onClick={async () => {
                setLoading(true);
                logStudy({
                    study_hours     : Number(studyHours),
                    sleep_hours     : Number(sleepHours),
                    breaks_taken    : Number(breaksTaken),
                    attendance      : Number(attendance),
                    past_score      : Number(pastScore)
                }).then(res => {
                        setResult(res.data);
                        setError('');
                    })
                    .catch(err => {
                        setError('Error occurred while logging study.');
                        setResult(null);
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }}>
                Log Study
            </button>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            {result && (
                <div className="bg-gray-700 rounded-xl p-6 mt-6">
                    <p className="text-gray-400 text-sm mb-1">Predicted Score</p>
                    <p className="text-4xl font-bold text-blue-400 mb-4">{result.predicted_score}</p>
                    <p className="text-gray-400 text-sm mb-1">Study Type</p>
                    <p className="text-xl font-bold text-green-400 mb-4">{result.cluster_label}</p>
                    <h4 className="text-lg font-bold mb-2">Recommendations:</h4>
                    <ul className="list-disc list-inside">
                        {result.recommendations.map((rec, index) => (
                            <li key={index} className="text-gray-300 mb-1">{rec}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>)
}
export default LogStudy