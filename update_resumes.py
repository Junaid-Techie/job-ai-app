import re

# 1. Update main.py
with open('backend/api/main.py', 'a', encoding='utf-8') as f:
    f.write('''
@app.get("/resumes/")
def get_resumes(db: Session = Depends(SessionLocal), user=Depends(get_current_user)):
    try:
        user_id = int(user["sub"])
        from .models import Resume
        resumes = db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.uploaded_at.desc()).all()
        return [
            {
                "id": r.id,
                "file_type": r.file_type,
                "uploaded_at": r.uploaded_at
            }
            for r in resumes
        ]
    finally:
        db.close()
''')

# 2. Update dashboard/page.tsx
with open('frontend/app/dashboard/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add resumes state
state_repl = '''  const [resumes, setResumes] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);'''
content = content.replace('  const [resume, setResume] = useState("");', state_repl + '\n  const [resume, setResume] = useState("");')

# Add fetchResumes and update useEffect
fetch_logic = '''  const fetchResumes = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/resumes/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
        if (data.length > 0 && !resumeId) {
          setResumeId(data[0].id);
        } else if (data.length === 0) {
          setShowUpload(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };'''

content = content.replace('  const fetchApplications = async () => {', fetch_logic + '\n\n  const fetchApplications = async () => {')

useEffect_repl = '''  useEffect(() => {
    if (activeTab === "applications" && token) fetchApplications();
    if (activeTab === "saved" && token) fetchSavedJobs();
    if (activeTab === "recommendations" && token) fetchRecommendations();
    if (token && resumes.length === 0) fetchResumes();
  }, [activeTab, token]);'''

content = re.sub(r'  useEffect\(\(\) => \{.*?\}, \[activeTab, token\]\);', useEffect_repl, content, flags=re.DOTALL)

# Update the "Your Resume" section in UI
resume_ui = '''              <h2 className="text-xl font-medium border-b border-gray-700 pb-2">1. Your Resume</h2>
              
              {resumes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Select Uploaded Resume</label>
                  <select 
                    value={resumeId || ""} 
                    onChange={(e) => {
                      if (e.target.value === "new") {
                        setShowUpload(true);
                        setResumeId(null);
                      } else {
                        setResumeId(Number(e.target.value));
                        setShowUpload(false);
                      }
                    }}
                    className="w-full p-3 rounded-lg bg-black/50 border border-gray-700 text-white outline-none focus:border-blue-500"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        Resume #{r.id} ({r.file_type || 'text'}) - {new Date(r.uploaded_at).toLocaleDateString()}
                      </option>
                    ))}
                    <option value="new">-- Upload New Resume --</option>
                  </select>
                </div>
              )}

              {(!resumes.length || showUpload) && (
                <>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Upload File (PDF/DOCX)</label>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30"
                    />
                  </div>

                  <div className="text-center text-sm text-gray-500">OR</div>

                  <textarea
                    className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    rows={4}
                    placeholder="Paste your resume text here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />

                  <button
                    onClick={addResume}
                    disabled={loading || (!resume && !resumeFile)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Embed & Save"}
                  </button>
                </>
              )}'''

content = re.sub(r'              <h2 className="text-xl font-medium border-b border-gray-700 pb-2">1\. Your Resume</h2>.*?              </button>', resume_ui, content, flags=re.DOTALL)

# Handle addResume success state correctly
content = content.replace('''      const data = await response.json();
      setResumeId(data.resume_id);
      alert("Resume successfully uploaded & embedded! You can now match & auto-apply.");''', '''      const data = await response.json();
      setResumeId(data.resume_id);
      setShowUpload(false);
      fetchResumes(); // Refresh the list
      alert("Resume successfully uploaded & embedded! You can now match & auto-apply.");''')

with open('frontend/app/dashboard/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
