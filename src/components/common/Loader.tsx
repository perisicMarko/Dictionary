import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <LoaderCircle
      size={28}
      color="#ffffff"
      className="animate-spin"
      strokeWidth={3}
      absoluteStrokeWidth
    />
  );
}
