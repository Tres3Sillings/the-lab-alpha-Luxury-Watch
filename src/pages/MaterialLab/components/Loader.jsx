import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="loader-container">
        <div className="loader-bar" style={{ width: `${progress}%` }} />
        <p className="loader-text">{Math.round(progress)}% LOADING ASSETS</p>
      </div>
    </Html>
  );
}