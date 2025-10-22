# Mobile Plant App — Setup Guide

A simple mockup mobile app built with React Native + Expo. This guide walks your teammates through setting up and running the project on their computer and phone.

## 1. Install Prerequisites

Make sure the following are installed:

- **Node.js (LTS version)**: https://nodejs.org/en/download/prebuilt-installer  
  → During installation, check 'Add to PATH'

- **Git**: https://git-scm.com/downloads

- **Visual Studio Code**: https://code.visualstudio.com/

After installing, verify installation by running these in your terminal:
```bash
node -v
npm -v
npx -v
git --version
```

## 2. Clone the Repository

In your terminal or VS Code terminal:
```bash
git clone https://github.com/chmercier/mobile-plant-app.git
cd mobile-plant-app
```

## 3. Install Dependencies

Inside the project folder, run:
```bash
npm install
```

This will install all required dependencies for the app.

## 4. Install Expo Go on Your Phone

Download Expo Go to preview the app on your phone:

- **iOS**: https://apps.apple.com/app/expo-go/id982107779

- **Android**: https://play.google.com/store/apps/details?id=host.exp.exponent

## 5. Run the App

In VS Code (inside the project folder), run:
```bash
npx expo start
```

You'll see a QR code in your terminal or browser.

1. Open Expo Go on your phone
2. Tap 'Scan QR Code'
3. Scan the code from your screen to open the app.

## 6. Making Changes

Create a new branch for your work:
```bash
git checkout -b your-branch-name
```

Make edits in VS Code, save, and test using:
```bash
npx expo start
```

Then commit and push your work:
```bash
git add .
git commit -m "Describe your change"
git push origin your-branch-name
```

## 7. Collaborating with the Team

Always pull the latest changes before starting new work:
```bash
git pull origin main
```

When ready, open a Pull Request on GitHub to merge your branch into main.

## 8. Common Issues

❌ **npm or npx not recognized:**  
→ Close and reopen VS Code, or restart your computer.

❌ **Expo doesn't load on phone:**  
→ Ensure your phone and laptop are on the same Wi-Fi network.  
→ If using campus Wi-Fi, use a personal hotspot instead.