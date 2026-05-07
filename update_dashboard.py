import re

with open('frontend/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update State
state_replacement = """  const [activeTab, setActiveTab] = useState<"search" | "applications" | "saved" | "recommendations">("search");

  const [savedJobs, setSavedJobs] = useState<Record<string, any>[]>([]);
  const [recommendations, setRecommendations] = useState<Record<string, any>[]>([]);"""

content = content.replace('  const [activeTab, setActiveTab] = useState<"search" | "applications">("search");', state_replacement)

# 2. Update fetch logic
fetch_logic = """  const fetchApplications = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/applications/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setApplications(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSavedJobs = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/saved-jobs/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setSavedJobs(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRecommendations = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/recommendations/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setRecommendations(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const saveJob = async (jobId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/save-job/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Job saved successfully!");
        if (activeTab === "saved") fetchSavedJobs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "applications" && token) fetchApplications();
    if (activeTab === "saved" && token) fetchSavedJobs();
    if (activeTab === "recommendations" && token) fetchRecommendations();
  }, [activeTab, token]);"""

content = re.sub(r'  const fetchApplications = async \(\) => \{.*?  \}, \[activeTab, token\]\);', fetch_logic, content, flags=re.DOTALL)

# 3. Add Tabs
tabs_replacement = """        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("search")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "search" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "recommendations" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Recommendations
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "saved" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Saved Jobs
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`pb-2 px-2 text-sm transition-all ${
              activeTab === "applications" ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Applications
          </button>
        </div>"""

content = re.sub(r'        <div className="flex gap-4">.*?        </div>', tabs_replacement, content, flags=re.DOTALL)

# 4. Add Save Job Button
content = content.replace(
'''<button
                          onClick={() => applyToJob(match.job_id)}
                          disabled={applyingJobId === match.job_id}
                          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm transition-colors shadow-lg shadow-blue-500/20"
                        >''',
'''<button
                          onClick={() => saveJob(match.job_id)}
                          className="px-4 py-2 border border-emerald-500/50 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500/10 text-sm transition-colors mr-2"
                        >
                          Save Job
                        </button>
                        <button
                          onClick={() => applyToJob(match.job_id)}
                          disabled={applyingJobId === match.job_id}
                          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 text-sm transition-colors shadow-lg shadow-blue-500/20"
                        >'''
)

# 5. Add new content panels
new_panels = """
      {activeTab === "recommendations" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-xl font-medium text-white mb-4">Personalized For You</h2>
          {recommendations.length === 0 ? (
            <p className="text-gray-400">No recommendations available. Try uploading a resume in the Search tab first.</p>
          ) : (
            <div className="space-y-4">
              {recommendations.map((rec: any) => (
                <div key={rec.job_id} className="glass-panel p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{rec.title}</h3>
                    <p className="text-gray-400 text-sm">{rec.company} • {rec.location}</p>
                    <div className="mt-2 text-xs font-semibold text-emerald-400">Match: {rec.similarity_score}%</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => saveJob(rec.job_id)} className="px-4 py-2 border border-emerald-500/50 text-emerald-400 rounded-lg hover:bg-emerald-500/10 text-sm transition-colors">
                      Save
                    </button>
                    <button onClick={() => setActiveTab("search")} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors shadow-lg shadow-blue-500/20">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "saved" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <h2 className="text-xl font-medium text-white mb-4">Saved Jobs</h2>
          {savedJobs.length === 0 ? (
            <p className="text-gray-400">You haven't saved any jobs yet.</p>
          ) : (
            <div className="space-y-4">
              {savedJobs.map((job: any) => (
                <div key={job.id} className="glass-panel p-6 rounded-xl shadow-lg border border-gray-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white">{job.title}</h3>
                    <p className="text-gray-400 text-sm">{job.company} • {job.location}</p>
                    <p className="text-xs text-gray-500 mt-1">Saved on: {new Date(job.saved_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => setActiveTab("search")} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm transition-colors shadow-lg shadow-emerald-500/20">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

    </motion.div>
  );
}
"""

content = re.sub(r'    </motion\.div>\s*?\);\s*?}\s*?$', new_panels, content)

with open('frontend/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
