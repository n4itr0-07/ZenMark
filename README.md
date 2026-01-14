<div align="center">

# ✨ ZenMark

### A Modern, Privacy-First Markdown Note-Taking App

[![Deploy to GitHub Pages](https://github.com/n4itr0-07/ZenMark/actions/workflows/deploy.yml/badge.svg)](https://github.com/n4itr0-07/ZenMark/actions/workflows/deploy.yml)
[![Docker Build](https://github.com/n4itr0-07/ZenMark/actions/workflows/docker.yml/badge.svg)](https://github.com/n4itr0-07/ZenMark/actions/workflows/docker.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <strong>🔒 Privacy-First</strong> • <strong>📴 Works Offline</strong> • <strong>🎨 Beautiful Dark Theme</strong>
</p>

---

</div>

## 🚀 Features

| Feature                      | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| 📝 **Full Markdown Support**  | Headers, lists, tables, code blocks, and more   |
| 👁️ **Live Preview**           | Real-time rendering with split view             |
| 🎨 **Syntax Highlighting**    | 180+ languages with GitHub Dark theme           |
| 📢 **GitHub-Flavored Alerts** | `[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]` |
| 💾 **Local Storage**          | All data stored in IndexedDB - no server needed |
| 📴 **Offline Mode**           | Works without internet after first load         |
| 📥 **Export Options**         | Download as `.md` or `.txt`                     |
| 🌙 **Dark Theme**             | Beautiful glassmorphism design                  |

## 🖥️ Demo

**Live Demo:** [https://n4itr0-07.github.io/ZenMark](https://n4itr0-07.github.io/ZenMark)

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Vanilla CSS with glassmorphism
- **Markdown:** marked + DOMPurify
- **Code Highlighting:** highlight.js
- **Storage:** IndexedDB (via idb)
- **Icons:** lucide-react

## 📦 Installation

### Quick Start (npm)

```bash
# Clone the repository
git clone https://github.com/n4itr0-07/ZenMark.git
cd ZenMark

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🐳 Docker

```bash
# Build the image
docker build -t zenmark .

# Run the container
docker run -d -p 8080:80 zenmark

# Open http://localhost:8080
```

### Docker Compose

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## 📂 Project Structure

```yaml
ZenMark/
├── src/
│   ├── components/     # React components
│   │   ├── Editor.jsx      # Main editor with preview
│   │   ├── Sidebar.jsx     # Notes list & navigation
│   │   ├── AboutPage.jsx   # About page
│   │   └── Modal.jsx       # Reusable modal
│   ├── lib/
│   │   └── storage.js      # IndexedDB operations
│   ├── styles/             # CSS files
│   ├── App.jsx
│   └── main.jsx
├── public/             # Static assets
├── Dockerfile          # Multi-stage Docker build
└── .github/workflows/  # CI/CD pipelines
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contributions

- 🌍 Internationalization (i18n)
- 📱 Mobile responsive improvements
- 🔄 Cloud sync integration
- 📊 Note statistics
- 🏷️ Tags and categories

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [n4itr0-07](https://github.com/n4itr0-07)

**⭐ Star this repo if you find it useful!**

</div>
