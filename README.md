🧠 ZWILT Bot — Social Media Automation Extension
ZWILT Bot is a modular Chrome extension that automates social media interactions across platforms like Facebook, Instagram, Twitter, TikTok, and more. Whether you're growing a brand, managing multiple accounts, or just saving time, ZWILT Bot gives you powerful control with a clean UI and dynamic bot architecture.

🚀 Features
✅ Multi-platform support: Facebook, Instagram, Twitter, TikTok, Pinterest, LinkedIn, Tinder

✅ Modular bot system: Easily add or remove bots per platform

✅ Dynamic content script injection: No reloads required

✅ Tailwind-powered popup UI: Clean, responsive, and intuitive

✅ Live status feedback: Know exactly what each bot is doing

✅ Supports actions: Follow, Like, Comment, Story View, Unlike

📁 Project Structure
Code
ZWILT-Bot/
├── assets/                 # Icons and images
├── background/            # Service worker logic
├── popup/                 # HTML/CSS/JS for extension popup
├── src/
│   ├── BaseController.js  # Shared bot logic
│   ├── FacebookController.js
│   ├── TikTokController.js
│   └── ...                # Other platform controllers
├── manifest.json          # Chrome extension config
└── README.md              # You're reading it!
🧩 How It Works
Each bot is a controller class (e.g. FacebookController) that inherits from BaseController. When a user clicks a button in the popup, the extension:

Detects the active tab and platform

Dynamically injects the correct content script

Sends a command (e.g. like, follow, comment)

Receives a response and updates the UI

🛠️ Installation
Clone the repo git clone https://github.com/Rowland2023/ZWILT-Bot.git

Navigate to the extension folder cd ZWILT-Bot/Extension

Load into Chrome:

Go to chrome://extensions

Enable Developer Mode

Click Load unpacked

Select the Extension folder

🧪 Demo Tips
Open a supported site (e.g. web.facebook.com)

Open DevTools → Console

Click a bot button in the popup

Watch the bot interact with the page and update the status

📦 Adding a New Bot
Create a new controller in src/ (e.g. InstagramController.js)

Add match patterns to manifest.json

Update popup.js with bot-to-platform mapping

Add a button in popup.html

📄 License
MIT License — free to use, modify, and distribute.