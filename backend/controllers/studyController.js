const axios = require('axios');
const StudyLog = require('../models/StudyLog');

const logStudy = async (req,res)=>{
    try{
        const { study_hours, sleep_hours, breaks_taken, attendance, past_score } = req.body;
        if(
            study_hours === undefined || 
            sleep_hours === undefined || 
            breaks_taken === undefined || 
            attendance === undefined
        ){
            return res.status(400).json({ message: "All fields are required" })
        }

        if(study_hours < 0 || study_hours > 24)
            return res.status(400).json({ message: "Study hours must be between 0 and 24" })

        if(sleep_hours < 0 || sleep_hours > 24)
            return res.status(400).json({ message: "Sleep hours must be between 0 and 24" })

        if(breaks_taken < 0 || breaks_taken > 10)
            return res.status(400).json({ message: "Breaks taken must be between 0 and 10" })

        if(attendance < 0 || attendance > 100)
            return res.status(400).json({ message: "Attendance must be between 0 and 100" })

        if(past_score !== undefined && (past_score < 0 || past_score > 100))
            return res.status(400).json({ message: "Past score must be between 0 and 100" })

        const userId= req.userId;
        let predicted_score = null;
        let isEstimate = false;
        let cluster_label = null;
        let recommendations = [];
        try{
            const predictResponse = await axios.post('http://localhost:5000/predict', {
                study_hours  : study_hours,
                sleep_hours : sleep_hours,
                breaks_taken : breaks_taken,
                attendance : attendance,
                past_score : past_score
            });
            const predicted_result = predictResponse.data;
            predicted_score = predicted_result.predicted_score;
            isEstimate = predicted_result.is_estimate;
        } 
        catch (error) {
            console.log("Error occurred while making prediction:", error.message);
        }

        try{
            const clusterResponse = await axios.post('http://localhost:5000/cluster', {
                study_hours  : study_hours,
                sleep_hours : sleep_hours,
                breaks_taken : breaks_taken,
                attendance : attendance,
                past_score : past_score
            });
            const cluster_result = clusterResponse.data;
            cluster_label = cluster_result.cluster_label;
            recommendations = cluster_result.recommendations;
        }
        catch (error) {
            console.log("Error occurred while determining cluster:", error.message);
        }   

        const studyLog = new StudyLog({
            user: userId,
            study_hours :study_hours,
            sleep_hours : sleep_hours,
            breaks_taken : breaks_taken,
            attendance : attendance,
            past_score : past_score,
            predicted_score : predicted_score,
            cluster_label : cluster_label,
            recommendations : recommendations
        });

        await studyLog.save();
        res.status(201).json({ message : "Study log saved successfully", predicted_score, cluster_label, recommendations });
    }
    catch(error){
        res.status(500).json({message : "Error occurred while saving study log" });
    }
}

const getHistory = async (req,res) => {
    try{
        const userId = req.userId;
        const logs = await StudyLog.find({user : userId}).sort({date : -1});
        res.status(200).json({logs});
    }
    catch(error){
        res.status(500).json({message : "Error occurred while fetching study history" });
    }
}

const deleteHistory = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;
        
        const deleted = await StudyLog.findOneAndDelete({ 
            _id: id,
            user: userId 
        })

        if (!deleted) {
            return res.status(404).json({ message: "Log not found" })
        }

        res.status(200).json({ message: "Study log deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: "Error occurred while deleting study log" })
    }
}

module.exports = {
    logStudy,
    getHistory,
    deleteHistory
}