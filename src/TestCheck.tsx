import { useState } from "react";

type Coordinate = {
    x: number;
    y: number;
  };
interface TestCheckProps {
    coords: Coordinate[];
    assets: any;
    setRegime: React.Dispatch<React.SetStateAction<string>>;
}


const TestCheck: React.FC<TestCheckProps> = ({ coords, setRegime, assets }) => {

    const handCoords = coords;
    const [asset, setAsset] = useState(0);
    let gesture = assets[asset].coordinates;
    let gestureIndexes = assets[asset].landMarkIndexes;
    console.log(gesture);
        
        console.log(coords)
        if (assets[asset].title == "Я") {
            setRegime("");
        }
        if (gesture && handCoords != undefined && gestureIndexes && handCoords.length > 0) {
                if (   handCoords[gestureIndexes[0]]["x"] <= gesture[0][1] && gesture[0][0] <= handCoords[gestureIndexes[0]]["x"]
                    && handCoords[gestureIndexes[0]]["y"] <= gesture[0][3] && gesture[0][2] <= handCoords[gestureIndexes[0]]["y"]
                    && handCoords[gestureIndexes[1]]["x"] <= gesture[1][1] && gesture[1][0] <= handCoords[gestureIndexes[1]]["x"]
                    && handCoords[gestureIndexes[1]]["y"] <= gesture[1][3] && gesture[1][2] <= handCoords[gestureIndexes[1]]["y"]
                    && handCoords[gestureIndexes[2]]["x"] <= gesture[2][1] && gesture[2][0] <= handCoords[gestureIndexes[2]]["x"]
                    && handCoords[gestureIndexes[2]]["y"] <= gesture[2][3] && gesture[2][2] <= handCoords[gestureIndexes[2]]["y"]
                    && handCoords[gestureIndexes[3]]["x"] <= gesture[3][1] && gesture[3][0] <= handCoords[gestureIndexes[3]]["x"]
                    && handCoords[gestureIndexes[3]]["y"] <= gesture[3][3] && gesture[3][2] <= handCoords[gestureIndexes[3]]["y"]
                    && handCoords[gestureIndexes[4]]["x"] <= gesture[4][1] && gesture[4][0] <= handCoords[gestureIndexes[4]]["x"]
                    && handCoords[gestureIndexes[4]]["y"] <= gesture[4][3] && gesture[4][2] <= handCoords[gestureIndexes[4]]["y"] )
                             {
                                 console.log("SUCCESS")
                                 setTimeout(() => {
                                    setAsset(asset + 1);
                                  }, 2000);              

            }
        
        }

  return (
    <div>
        <img
            src={'../public/assets/' +
                assets[asset].type +
                '.png'}
            className="asset"
            alt={assets[asset].type}
        />
        <p>{assets[asset].title}</p>
    </div>
  )
}

export default TestCheck