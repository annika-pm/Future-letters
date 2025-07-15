## Watch the video 
[![Watch the video](https://raw.githubusercontent.com/annika-pm/Future-letters/master/future-letters-demo-thumbnail.jpg)](https://raw.githubusercontent.com/annika-pm/Future-letters/master/future-letters-demo.mp4)
# ✉️ Future-Letters

Future-Letters is a unique time-capsule and memory-sharing mobile app that lets users send letters to their future selves or friends, unlock them at a specific time or place.

## 🌟 Features

- **Write to the Future**: Compose letters and set a future unlock date.
- **Time & Location Lock**: Capsules can only be opened when the unlock date arrives **and** the user is physically at the GPS spot.
- **Private & Shared Capsules**: Keep memories to yourself or share them with trusted friends.
- **Push Notifications**: Get reminders when your capsule is about to unlock.

## 📱 Tech Stack

- **React Native** (with Expo)
- **Firebase** – Authentication & Firestore
- **Expo Location** – for GPS tracking
- **Expo Notifications** – for push alerts


## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Expo CLI
- Firebase Project configured


### Installation
```
git clone https://github.com/yourusername/future-letters.git
cd future-letters
npm install
npx expo start
```

### Firebase Setup

1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Set up Firestore database.
4. Replace the `firebaseConfig` in your project with your own Firebase credentials.

### Running on Device

* Use the **Expo Go** app for testing.
* For full features (e.g., push notifications, AR, auth persistence), use a **development build**.

```
npx expo run:android
# or
npx expo run:ios
```




🔮 Let your past speak when the future arrives.


