
# Video Downloader

A video downloader app that allows users to download videos from various platforms. The app includes both a **frontend** built with React and a **backend** built with Node.js (Express). The backend uses **yt-dlp** to fetch video formats and download videos.

---
![image](https://github.com/user-attachments/assets/6c3576f9-6640-422c-8eae-580844f3975b)

### **Features**
- Fetch and display **video thumbnails**
- List available **video formats** (quality and file types)
- **Download videos** (single and batch)
- Option to **download audio only** (MP3)
- Supports various **video quality** options (e.g., 360p, 720p, 1080p)

---

### **Tech Stack**
- **Frontend**: React.js, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, yt-dlp
- **Deployment**:
  - Frontend: Local Development
  - Backend: Local Development

---

### **Setup Instructions**

#### **1. Backend Setup (Express Server)**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/rohaib11/video_downloader.git
   ```

2. **Navigate to the backend folder**:

   ```bash
   cd video-downloader-backend
   ```

3. **Install the necessary dependencies**:

   ```bash
   npm install
   ```

4. **Start the backend server**:

   ```bash
   node server.js
   ```

   The backend will run at **http://localhost:5000**.

#### **2. Frontend Setup (React App)**

1. **Navigate to the frontend folder**:

   ```bash
   cd react_downloader
   ```

2. **Install the necessary dependencies**:

   ```bash
   npm install
   ```

3. **Start the frontend server**:

   ```bash
   npm start
   ```

   The frontend will run at **http://localhost:3000**.

---

### **How to Use**

1. **Open the frontend** at `http://localhost:3000`.
2. **Enter a video URL** from a supported platform (e.g., YouTube).
3. **Click "Download Video"** to download the video. Optionally, you can choose the video quality and format (MP4 or MP3).

---

### **Contributing**

Feel free to fork the repository, make changes, and create pull requests. Contributions are welcome!

---

### **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

### **Step 1: Add and Commit the README File**

1. **Add** the `README.md` file to Git:

   ```bash
   git add README.md
   ```

2. **Commit** the changes:

   ```bash
   git commit -m "Add README file"
   ```

3. **Push** the changes to GitHub:

   ```bash
   git push
   ```

---

### **Step 2: Verify on GitHub**

Once you've pushed the changes, go to your GitHub repository and check if the `README.md` file is visible.

---

### **Additional Notes:**

- If you'd like to add more features to this app, you can expand on the **video quality options** or add more platforms.
- The app currently supports downloading from platforms that `yt-dlp` supports. You can find more information about `yt-dlp` [here](https://github.com/yt-dlp/yt-dlp).
