import urllib.request
req = urllib.request.Request("https://job-ai-app-backend.onrender.com/upload-resume", method="OPTIONS")
req.add_header("Origin", "https://job-ai-app-six.vercel.app")
req.add_header("Access-Control-Request-Method", "POST")
req.add_header("Access-Control-Request-Headers", "Authorization")
try:
    resp = urllib.request.urlopen(req)
    print("Code:", resp.getcode())
    print(resp.headers)
except Exception as e:
    print("Error:", e)
