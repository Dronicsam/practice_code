import { useRef, useEffect, useState } from "react"
import "./App.css"
import Webcam from "react-webcam"
import { Holistic, POSE_LANDMARKS, HAND_CONNECTIONS, POSE_CONNECTIONS } from "@mediapipe/holistic"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import { Camera } from "@mediapipe/camera_utils"
import Button from "./Button"
import AssetCheck from "./AssetCheck"
import TestCheck from "./TestCheck"
type Coordinate = {
  x: number;
  y: number;
};

interface MyComponentProps {
  assets: any;
}

const MPStart: React.FC<MyComponentProps> = ({ assets }) => {
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const leftHandCoords = useRef<Coordinate[]>([]);
  const rightHandCoords = useRef<Coordinate[]>([]);
  const [leftWorking, setLeftWorking] = useState<Coordinate[]>([]);
  const [rightWorking, setRightWorking] = useState<Coordinate[]>([]);
  const [regime, setRegime] = useState("");
  let regimeRightNow = "";

  useEffect(() => {
  }, [regime])





  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    })

    holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    })

    holistic.onResults(onResults)
    let camera: Camera | null = null

    if (webcamRef.current?.video) {
      camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          await holistic.send({ image: webcamRef.current!.video! })
        },
      })
      camera.start()
    }
  
    return () => {
      camera?.stop()
      holistic.close()
    }
  }, [])



  const onResults = (results: any) => {

    leftHandCoords.current = [];
    rightHandCoords.current = [];
    
    if (!canvasRef.current) return
    const canvasCtx = canvasRef.current.getContext("2d")
    if (!canvasCtx) return
      canvasCtx.save()
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height)
      const leftHandLandmarks = results.leftHandLandmarks;
      const rightHandLandmarks = results.rightHandLandmarks;
    if (results.poseLandmarks) {
        // Drawing hand landmarks
        
      drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {color: "white", lineWidth: 2});
      drawLandmarks(canvasCtx, results.leftHandLandmarks, {color: "white", fillColor: "rgb(255,138,0)", lineWidth: 2, radius: 3});
      drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,{color: "white", lineWidth: 2});
      drawLandmarks(canvasCtx, results.rightHandLandmarks, {color: "white", fillColor: "rgb(255,138,0)", lineWidth: 2, radius: 3});
      
      
      if (leftHandLandmarks)  {
        leftHandCoords.current = leftHandLandmarks.map((landmark: any) => ({
        x: landmark.x,
        y: landmark.y
      }));
    setLeftWorking(leftHandCoords.current);
    }
      

      if (rightHandLandmarks)  {
        rightHandCoords.current = rightHandLandmarks.map((landmark: any) => ({
        x: landmark.x,
        y: landmark.y
      }));
      setRightWorking(rightHandCoords.current);
      }
      
    if (regimeRightNow == "" && rightHandCoords.current.length == 21 && leftHandCoords.current.length == 0) {
      if (rightHandCoords.current[8]["x"] <= 0.95 && 0.65 <= rightHandCoords.current[8]["x"]
            && rightHandCoords.current[8]["y"] <= 0.7 && 0.65 <= rightHandCoords.current[8]["y"]
        )
        {
          regimeRightNow = "Обучение";
          setRegime("Обучение");
        }
        

      if (regimeRightNow == "" && rightHandCoords.current[8]["x"] <= 0.35 && 0.05 <= rightHandCoords.current[8]["x"]
        && rightHandCoords.current[8]["y"] <= 0.7 && 0.65 <= rightHandCoords.current[8]["y"]
        ) {
          regimeRightNow = "Тестирование";
          setRegime("Тестирование");
        }
  }
    if (regimeRightNow == "" && leftHandCoords.current.length == 21 && rightHandCoords.current.length == 0) {
      if (regime == "" && leftHandCoords.current[8]["x"] <= 0.95 && 0.65 <= leftHandCoords.current[8]["x"]
          && leftHandCoords.current[8]["y"] <= 0.7 && 0.65 <= leftHandCoords.current[8]["y"]
      ) {
          regimeRightNow = "Обучение";
          setRegime("Обучение");
          
      }
      

      if (
        regimeRightNow == "" && leftHandCoords.current[8]["x"] <= 0.35 && 0.05 <= leftHandCoords.current[8]["x"]
            && leftHandCoords.current[8]["y"] <= 0.7 && 0.65 <= leftHandCoords.current[8]["y"]
      ) {
          regimeRightNow = "Тестирование";
          setRegime("Тестирование");
          
      }
    }
    canvasCtx.restore();
    
  }


}

  return (
    <div className="vidwin">
      <div >
        <canvas className="canvas" ref={canvasRef}></canvas>
        <Webcam className="webcam" audio={false} mirrored ref={webcamRef} />
      </div>
      {
        regime == "" && 
          <div className="options">
            <Button props={"Обучение"}/>
            <Button props={"Тестирование"}/> 
        </div>
        
      }
      {
        regime  == "Обучение" &&
        <div className="assetCheck">
          <AssetCheck assets={assets} coords={rightWorking} setRegime={setRegime}/>
          <p>Обучение</p>
        </div>
      }
      {
        regime  == "Тестирование" &&
        <div className="assetCheck">
          <TestCheck assets={assets} coords={rightWorking} setRegime={setRegime}/>
          <p>Тестирование</p>
        </div>
        
      }
      
    
    </div>
    
    )
  }
  
export default MPStart
