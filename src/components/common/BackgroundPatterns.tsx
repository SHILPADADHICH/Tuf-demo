import { useAppTheme } from "@/theme/ThemeProvider";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, Line, Pattern, Rect } from "react-native-svg";

export function BackgroundPatterns() {
  const { colors, isDark } = useAppTheme();

  // Specific settings for light/dark mode visibility
  const gridOpacity = isDark ? 0.06 : 0.12;
  const gridColor = isDark ? "rgba(255,255,255,1)" : "rgba(79, 70, 229, 0.4)"; // Use a subtle indigo in light mode
  const orbOpacity = isDark ? 0.12 : 0.18;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Mesh Grid */}
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <Pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <Line
              x1="40"
              y1="0"
              x2="40"
              y2="40"
              stroke={gridColor}
              strokeWidth="0.5"
              strokeOpacity={gridOpacity}
            />
            <Line
              x1="0"
              y1="40"
              x2="40"
              y2="40"
              stroke={gridColor}
              strokeWidth="0.5"
              strokeOpacity={gridOpacity}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grid)" />
      </Svg>

      {/* Decorative Orbs (Enhanced) */}
      <View
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full"
        style={
          {
            backgroundColor: colors.primary,
            opacity: orbOpacity,
            transform: [{ scale: 1.2 }],
            filter: "blur(100px)",
          } as any
        }
      />
      <View
        className="absolute top-[40%] -right-40 h-[400px] w-[400px] rounded-full"
        style={
          {
            backgroundColor: colors.secondary,
            opacity: orbOpacity * 0.8,
            filter: "blur(80px)",
          } as any
        }
      />
    </View>
  );
}
