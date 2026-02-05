# NetInfo - Real-Time Network Configuration Dashboard

A sleek, modern web application that displays comprehensive network and device information with a beautiful glassmorphic UI. Built with pure HTML, CSS, and JavaScript - no frameworks required.

![NetInfo Preview](https://img.shields.io/badge/Status-Active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🌐 Network Information
- **Public IP Address** - Real-time display of your external IP
- **Local IP Detection** - Attempts to detect private network IPs via WebRTC
- **ISP & Organization** - Shows your internet service provider details
- **Network Class Detection** - Identifies Class A/B/C private networks
- **Connection Metrics** - Display downlink speed, RTT, and connection type

### 📍 Location & Geolocation
- Country, city, region, and postal code
- Timezone information
- GPS coordinates
- Automatic geolocation based on IP

### 💻 Device & Browser Information
- Browser detection (Chrome, Firefox, Safari, Edge, etc.)
- Operating system platform
- Screen resolution and viewport size
- Color depth
- Language settings
- Online/offline status
- Cookie settings

### 🎨 Design Features
- **Dark/Light Theme Toggle** - Smooth theme switching with localStorage persistence
- **Glassmorphism UI** - Modern frosted glass aesthetic
- **Smooth Animations** - Staggered card reveals, hover effects, and micro-interactions
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **Custom Refresh Animation** - Engaging visual feedback on data refresh

## 🚀 Live Demo

[View Live Demo](#) *(Add your GitHub Pages link here)*

## 📦 Installation

### Option 1: Download & Run Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/netinfo.git

# Navigate to project directory
cd netinfo

# Open index.html in your browser
# Or run a local server (recommended):
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Option 2: Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Select main branch as source
4. Your site will be live at `https://yourusername.github.io/netinfo/`

### Option 3: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/netinfo)

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Custom properties, animations, glassmorphism effects
- **Vanilla JavaScript** - No frameworks or dependencies
- **WebRTC** - Local IP detection
- **Fetch API** - External IP and geolocation data
- **Google Fonts** - JetBrains Mono & Syne typography

## 📡 API Dependencies

This project uses free, public APIs:
- **ipify.org** - Public IP address detection
- **ip-api.com** - Geolocation and ISP information

Note: Some features may be limited when running from `file://` protocol due to CORS restrictions. Run via HTTP server for full functionality.

## 🎯 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| Opera   | ✅ Full |

**Note:** Local IP detection via WebRTC may be blocked by privacy-focused browsers or extensions.

## 📂 Project Structure

```
netinfo/
├── index.html      # Main HTML structure
├── style.css       # All styles and animations
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## 🔒 Privacy & Security

- All network detection happens client-side in your browser
- No data is stored or transmitted to any third-party servers (except public IP APIs)
- Theme preference is stored in localStorage only
- WebRTC IP detection respects browser privacy settings

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💡 Future Enhancements

- [ ] Add IPv6 support
- [ ] VPN detection
- [ ] Network speed test integration
- [ ] Export data as JSON/PDF
- [ ] Additional theme options
- [ ] PWA support for offline functionality
- [ ] Ping/traceroute visualization

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Website: [yourwebsite.com](https://yourwebsite.com)

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

## 📸 Screenshots

### Dark Theme
![Dark Theme Screenshot](#)

### Light Theme
![Light Theme Screenshot](#)

### Mobile View
![Mobile View Screenshot](#)

---

**Made with ❤️ and pure vanilla JavaScript**
