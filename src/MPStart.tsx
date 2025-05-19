import { useRef, useEffect, useState } from "react";
import "./App.css";
import Webcam from "react-webcam";
import { Holistic, HAND_CONNECTIONS } from "@mediapipe/holistic";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { Camera } from "@mediapipe/camera_utils";
import Button from "./Button";
import AssetCheck from "./AssetCheck";
import TestCheck from "./TestCheck";

type Coordinate = {
  x: number;
  y: number;
};

interface MyComponentProps {
  assets: any;
}

const MPStart: React.FC<MyComponentProps> = ({ assets }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const leftHandCoords = useRef<Coordinate[]>([]);
  const rightHandCoords = useRef<Coordinate[]>([]);
  const [rightWorking, setRightWorking] = useState<Coordinate[]>([]);
  const [regime, setRegime] = useState<string>("");

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holistic.onResults(onResults);

    let camera: Camera | null = null;
    if (webcamRef.current?.video) {
      camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef.current!.video! });
        },
      });
      camera.start();
    }

    return () => {
      camera?.stop();
      holistic.close();
    };
  }, []);

  const isPointInRange = (
    point: Coordinate,
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number
  ) => point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax;

  const checkRegimeByCoords = (handCoords: Coordinate[]): string | null => {
    if (handCoords.length !== 21) return null;
    const indexFingerTip = handCoords[8];

    if (isPointInRange(indexFingerTip, 0.65, 0.95, 0.65, 0.7)) {
      return "Обучение";
    }

    if (isPointInRange(indexFingerTip, 0.05, 0.35, 0.65, 0.7)) {
      return "Тестирование";
    }
    return null;
  };

  const onResults = (results: any) => {
    leftHandCoords.current = [];
    rightHandCoords.current = [];

    if (!canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    const leftHandLandmarks = results.leftHandLandmarks;
    const rightHandLandmarks = results.rightHandLandmarks;

    if (results.poseLandmarks) {
      if (leftHandLandmarks) {
        drawConnectors(canvasCtx, leftHandLandmarks, HAND_CONNECTIONS, {
          color: "white",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, leftHandLandmarks, {
          color: "white",
          fillColor: "rgb(255,138,0)",
          lineWidth: 2,
          radius: 3,
        });
        leftHandCoords.current = leftHandLandmarks.map(({ x, y }: any) => ({
          x,
          y,
        }));
      }

      if (rightHandLandmarks) {
        drawConnectors(canvasCtx, rightHandLandmarks, HAND_CONNECTIONS, {
          color: "white",
          lineWidth: 2,
        });
        drawLandmarks(canvasCtx, rightHandLandmarks, {
          color: "white",
          fillColor: "rgb(255,138,0)",
          lineWidth: 2,
          radius: 3,
        });
        rightHandCoords.current = rightHandLandmarks.map(({ x, y }: any) => ({
          x,
          y,
        }));
        setRightWorking(rightHandCoords.current);
      }

      if (regime === "") {
        if (
          rightHandCoords.current.length === 21 &&
          leftHandCoords.current.length === 0
        ) {
          const newRegime = checkRegimeByCoords(rightHandCoords.current);
          if (newRegime) setRegime(newRegime);
        } else if (
          leftHandCoords.current.length === 21 &&
          rightHandCoords.current.length === 0
        ) {
          const newRegime = checkRegimeByCoords(leftHandCoords.current);
          if (newRegime) setRegime(newRegime);
        }
      }
    }

    canvasCtx.restore();
  };

  return (
    <div className="vidwin">
      <div>
        <canvas className="canvas" ref={canvasRef}></canvas>
        <Webcam className="webcam" audio={false} mirrored ref={webcamRef} />
      </div>

      {regime === "" && (
        <div className="options">
          <Button props={"Обучение"} />
          <Button props={"Тестирование"} />
        </div>
      )}

      {regime === "Обучение" && (
        <div className="assetCheck">
          <AssetCheck
            assets={assets}
            coords={rightWorking}
            setRegime={setRegime}
          />
          <p>Обучение</p>
        </div>
      )}

      {regime === "Тестирование" && (
        <div className="assetCheck">
          <TestCheck
            assets={assets}
            coords={rightWorking}
            setRegime={setRegime}
          />
          <p>Тестирование</p>
        </div>
      )}
    </div>
  );
};

export default MPStart;
