import * as faceapi from "face-api.js";
import React, { useState, useLayoutEffect } from "react";
function Main() {
    const [modelsLoaded, setModelsLoaded] = React.useState(false);
    const [captureVideo, setCaptureVideo] = React.useState(false);
    const videoRef = React.useRef();
    const [size, setSize] = useState([0, 0]);
    const w = useWindowSize()[0];
    let videoHeight;
    let videoWidth;
    if (w > 768) {
        videoHeight = 560;
        videoWidth = 720;
    } else {
        videoHeight = 250;
        videoWidth = 350;
    }
    const canvasRef = React.useRef();

    function useWindowSize() {
        useLayoutEffect(() => {
            function updateSize() {
                setSize([window.innerWidth, window.innerHeight]);
            }
            window.addEventListener("resize", updateSize);
            updateSize();
            return () => window.removeEventListener("resize", updateSize);
        }, []);
        return size;
    }
    console.log(useWindowSize());
    React.useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + "/models";

            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
            ]).then(setModelsLoaded(true));
        };
        loadModels();
    }, []);

    const startVideo = () => {
        setCaptureVideo(true);
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error("error:", err);
            });
    };

    const handleVideoOnPlay = () => {
        setInterval(async () => {
            if (canvasRef && canvasRef.current) {
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
                    videoRef.current
                );
                const displaySize = {
                    width: videoWidth,
                    height: videoHeight,
                };

                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi
                    .detectAllFaces(
                        videoRef.current,
                        new faceapi.TinyFaceDetectorOptions()
                    )
                    .withFaceLandmarks()
                    .withFaceExpressions();

                const resizedDetections = faceapi.resizeResults(
                    detections,
                    displaySize
                );

                canvasRef &&
                    canvasRef.current &&
                    canvasRef.current
                        .getContext("2d")
                        .clearRect(0, 0, videoWidth, videoHeight);
                canvasRef &&
                    canvasRef.current &&
                    faceapi.draw.drawDetections(
                        canvasRef.current,
                        resizedDetections
                    );
                canvasRef &&
                    canvasRef.current &&
                    faceapi.draw.drawFaceLandmarks(
                        canvasRef.current,
                        resizedDetections
                    );
                canvasRef &&
                    canvasRef.current &&
                    faceapi.draw.drawFaceExpressions(
                        canvasRef.current,
                        resizedDetections
                    );
            }
        }, 100);
    };

    const closeWebcam = () => {
        videoRef.current.pause();
        videoRef.current.srcObject.getTracks()[0].stop();
        setCaptureVideo(false);
    };

    return (
        <div>
            <div style={{ textAlign: "center", padding: "10px" }}>
                {captureVideo && modelsLoaded ? (
                    <button onClick={closeWebcam} className="btn btn-primary">
                        Close Webcam
                    </button>
                ) : (
                    <button onClick={startVideo} className="btn btn-primary">
                        Open Webcam
                    </button>
                )}
            </div>
            {captureVideo ? (
                modelsLoaded ? (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "10px",
                            }}
                        >
                            <video
                                ref={videoRef}
                                height={videoHeight}
                                width={videoWidth}
                                onPlay={handleVideoOnPlay}
                                style={{ borderRadius: "10px" }}
                            />
                            <canvas
                                ref={canvasRef}
                                style={{ position: "absolute" }}
                            />
                        </div>
                    </div>
                ) : (
                    <div>loading...</div>
                )
            ) : (
                <></>
            )}
        </div>
    );
}

export default Main;
