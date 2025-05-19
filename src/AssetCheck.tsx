import { useState } from "react";

type Coordinate = {
  x: number;
  y: number;
};

interface Gesture {
  coordinates: [number, number, number, number][];
  landMarkIndexes: number[];
  title: string;
}

interface AssetCheckProps {
  coords: Coordinate[];
  assets: Gesture[];
  setRegime: React.Dispatch<React.SetStateAction<string>>;
}

const AssetCheck: React.FC<AssetCheckProps> = ({
  coords,
  setRegime,
  assets,
}) => {
  const handCoords = coords;
  const [asset, setAsset] = useState(0);

  const gesture = assets[asset].coordinates;
  const gestureIndexes = assets[asset].landMarkIndexes;

  console.log(gesture);
  console.log(coords);

  if (assets[asset].title === "Я") {
    setRegime("");
  }

  if (
    gesture &&
    handCoords.length > 0 &&
    gestureIndexes &&
    gestureIndexes.length >= 5
  ) {
    const matches = [0, 1, 2, 3, 4].every((i) => {
      const point = handCoords[gestureIndexes[i]];
      const [x1, x2, y1, y2] = gesture[i];
      return point.x <= x2 && x1 <= point.x && point.y <= y2 && y1 <= point.y;
    });

    if (matches) {
      console.log("SUCCESS");
      setTimeout(() => {
        setAsset((prev) => prev + 1);
      }, 2000);
    }
  }

  const currentAsset = assets[asset];

  return (
    <div>
      <img
        src={`../public/assets/${currentAsset.title}.png`}
        className="asset"
        alt={currentAsset.title}
      />
      <p>{currentAsset.title}</p>
    </div>
  );
};

export default AssetCheck;
