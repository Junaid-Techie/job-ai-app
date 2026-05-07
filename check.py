import urllib.request
try:
    urllib.request.urlopen("https://job-ai-app-backend.onrender.com/resumes/")
    print("200 OK")
except Exception as e:
    print("Error Code:", getattr(e, 'code', str(e)))
