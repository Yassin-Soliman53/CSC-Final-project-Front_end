
import foodDoodleTexture from "../../assets/images/restaurants.jpg (2).jpeg";

export default function FoodDoodlePattern({
  opacity = 0.16,
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `url("${foodDoodleTexture}")`,
        backgroundPosition: "top left",
        backgroundRepeat: "repeat",
        backgroundSize: "922px 615px",
        mixBlendMode: "multiply",
        opacity: Math.max(opacity, 0.35),
      }}
      aria-hidden="true"
    />
  );
}