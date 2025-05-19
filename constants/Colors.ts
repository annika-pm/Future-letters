/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#A3C9A8'; // soft mint green
const tintColorDark = '#FFBCBC';  // soft rose pink

export const Colors = {
  light: {
    text: '#4B4B4B',             // soft charcoal
    background: '#FDF6F0',       // warm paper beige
    tint: tintColorLight,        // mint
    icon: '#B0A8B9',             // lavender gray
    tabIconDefault: '#B0A8B9',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F3E9DD',             // soft cream
    background: '#2E2C2F',       // warm deep gray
    tint: tintColorDark,         // soft rose
    icon: '#D8A7B1',             // rose mauve
    tabIconDefault: '#D8A7B1',
    tabIconSelected: tintColorDark,
  },
};
