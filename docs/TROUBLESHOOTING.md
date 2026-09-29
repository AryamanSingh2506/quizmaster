# 🔧 Troubleshooting Guide

Common issues and their solutions for the Gemini Study Buddy workshop.

## 🚨 Server Issues

### "Cannot connect to server"
**Problem**: Browser shows error or can't reach `http://localhost:3000`

**Solutions**:
1. Check if the server is running:
   ```bash
   # You should see "Server running on http://localhost:3000"
   npm start
   ```

2. Check if port 3000 is already in use:
   ```bash
   # Kill process on port 3000 (Mac/Linux)
   lsof -ti:3000 | xargs kill -9

   # Or change the PORT in your .env file
   PORT=3001
   ```

3. Verify you're in the correct directory:
   ```bash
   pwd
   # Should show .../gemini-study-buddy
   ```

### "Module not found" errors
**Problem**: Error about missing modules when running `npm start`

**Solution**:
```bash
# Install dependencies
npm install
```

### "GEMINI_API_KEY is not defined"
**Problem**: Server crashes with environment variable error

**Solutions**:
1. Check that `.env` file exists in the project root:
   ```bash
   ls -la .env
   ```

2. Verify `.env` contains the API key:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```

3. Make sure there are no extra spaces around the `=`

---

## 🔑 API Key Issues

### "Invalid API key"
**Problem**: Gemini API returns 401 or invalid key error

**Solutions**:
1. Verify your API key is correct:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Copy the key again (make sure no extra spaces)

2. Check if the key is in the right format:
   - Should start with `AIza` or similar
   - No quotes or extra characters

3. Ensure you're using the `.env` file, not `.env.example`:
   ```bash
   # Copy the example file
   cp .env.example .env
   # Then edit .env with your real key
   ```

### API quota exceeded
**Problem**: Rate limit or quota errors

**Solutions**:
1. Wait a few minutes and try again
2. Check your Google Cloud console for quota limits
3. Use a different Google account if needed

---

## 💻 Frontend Issues

### Chat not sending messages
**Problem**: Clicking send does nothing

**Solutions**:
1. Check browser console (F12) for errors
2. Verify server is running
3. Check that `/api/chat` route is uncommented in `server/index.js`

### Buttons not working
**Problem**: Quiz or Summarize buttons don't respond

**Solutions**:
1. Check if the route is uncommented in `server/index.js`
2. Verify the route is implemented in `server/routes/`
3. Check browser console for JavaScript errors

### Styling looks broken
**Problem**: Page looks unstyled or weird

**Solutions**:
1. Check that `styles.css` is in the `public/` folder
2. Verify the link tag in `index.html`:
   ```html
   <link rel="stylesheet" href="styles.css">
   ```
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

---

## 🔄 Git Issues

### "Not a git repository"
**Problem**: Git commands don't work

**Solution**:
```bash
# Initialize git if not already done
git init
```

### Can't switch branches
**Problem**: `git checkout` fails with uncommitted changes

**Solutions**:
1. Commit your changes first:
   ```bash
   git add .
   git commit -m "Work in progress"
   ```

2. Or stash changes temporarily:
   ```bash
   git stash
   git checkout step-1-chat
   git stash pop
   ```

### Branch not found
**Problem**: `git checkout step-1-chat` says branch doesn't exist

**Solutions**:
1. List all branches:
   ```bash
   git branch -a
   ```

2. Fetch remote branches:
   ```bash
   git fetch --all
   ```

3. Create branch from remote:
   ```bash
   git checkout -b step-1-chat origin/step-1-chat
   ```

---

## 🤖 Gemini-Specific Issues

### JSON parsing errors in Step 3
**Problem**: Quiz generation fails with JSON parse error

**Solutions**:
1. Check the system prompt includes JSON format instructions
2. Verify the response is actually JSON (add console.log)
3. Try a simpler topic to test
4. Add error handling to retry if JSON is invalid

### Streaming not working in Step 4
**Problem**: Text doesn't appear gradually

**Solutions**:
1. Check that the model supports streaming
2. Verify headers are set correctly (`Content-Type: text/event-stream`)
3. Check browser console for streaming errors
4. Ensure the frontend reader is implemented correctly

### Image upload fails in Step 5
**Problem**: Can't upload images for summarization

**Solutions**:
1. Check that multer is configured in `server/routes/summarize.js`
2. Verify the `uploads/` directory exists
3. Check file size limits (default might be too small)
4. Ensure MIME type is being passed correctly

---

## 🌐 Network Issues

### "AI Studio not reachable"
**Problem**: Can't access aistudio.google.com

**Solutions**:
1. Check your internet connection
2. Try a different network (some campus networks block AI services)
3. Use a phone hotspot if needed
4. Check if you need a VPN

### CORS errors
**Problem**: Browser shows CORS error when calling API

**Solutions**:
1. Ensure you're calling your own server, not Gemini directly
2. Check that CORS is enabled in Express (add if needed):
   ```javascript
   app.use(cors());
   ```

---

## 📱 Platform-Specific Issues

### Windows: Path issues
**Problem**: Errors with file paths on Windows

**Solutions**:
1. Use forward slashes in paths
2. Use `path.join()` for cross-platform compatibility
3. Run commands in Git Bash or PowerShell

### Mac: Permission denied
**Problem**: Can't run npm commands

**Solutions**:
1. Fix npm permissions:
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. Or use Node Version Manager (nvm)

---

## 🆘 Still Stuck?

1. **Check the console**: Always look at terminal and browser console for specific error messages
2. **Restart everything**: Sometimes a fresh start helps (Ctrl+C to stop server, then `npm start` again)
3. **Ask an instructor**: Don't spend more than 10 minutes on one issue
4. **Check with peers**: Someone else might have solved the same problem

## 📝 Quick Diagnostic Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# List installed packages
npm list

# Check running processes
lsof -i :3000

# Test server health
curl http://localhost:3000/api/health

# Check git status
git status

# View recent commits
git log --oneline -5
```

Remember: Error messages are your friends! Read them carefully and they'll often tell you exactly what's wrong. 🎯
