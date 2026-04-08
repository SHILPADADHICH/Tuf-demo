import { MotiView } from "moti";
import { View } from "react-native";

type GradientOrbsProps = {
  topColor?: string;
  bottomColor?: string;
};

export function GradientOrbs({
  topColor = "rgba(129,140,248,0.15)",
  bottomColor = "rgba(167,139,250,0.15)",
}: GradientOrbsProps) {
  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      <MotiView
        from={{ translateX: 0, translateY: 0, opacity: 0.8 }}
        animate={{ translateX: 30, translateY: -20, opacity: 1 }}
        transition={{ loop: true, type: "timing", duration: 3600 }}
        className="absolute -right-24 -top-24 h-64 w-64 rounded-full"
        style={{ backgroundColor: topColor }}
      />
      <MotiView
        from={{ translateX: 0, translateY: 0, opacity: 0.8 }}
        animate={{ translateX: -24, translateY: 24, opacity: 1 }}
        transition={{ loop: true, type: "timing", duration: 4200 }}
        className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full"
        style={{ backgroundColor: bottomColor }}
      />
    </View>
  );
}
