import React, {useEffect, useMemo, useRef, useState} from "react";
import {LandmarkList, Pose, POSE_CONNECTIONS} from "@mediapipe/pose";
import {Camera} from "@mediapipe/camera_utils";
import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";

function onResults(pose: LandmarkList, video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const ctx = canvas?.getContext('2d');

    if (!pose || !ctx) {
        return;
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Only overwrite missing pixels.
    // ctx.globalCompositeOperation = 'destination-atop';
    // ctx.drawImage(
    //     results.image, 0, 0, canvas.width, canvas.height);
    //
    ctx.globalCompositeOperation = 'source-over';

    drawConnectors(ctx, pose, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 2});
    drawLandmarks(ctx, pose, {color: '#FF0000', lineWidth: 1, radius: 2});

    ctx.restore();
}


export const CanvasPage = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pose, setPose] = useState<LandmarkList | null>(null);

    const poseFinder = useMemo(() => {
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults((results) => {
            if (videoRef.current && canvasRef.current) {
                setPose(results.poseLandmarks);
                onResults(results.poseLandmarks, videoRef.current, canvasRef.current);
            }
        });

        return pose;
    }, []);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }


        const camera = new Camera(video, {
            onFrame: async () => {
                await poseFinder.send({image: video});
            },
            width: 640,
            height: 360
        });

        camera.start();
    }, [videoRef, poseFinder]);

    return (
        <div className="container">
            <canvas ref={canvasRef} width="640px" height="360px"/>
            <video ref={videoRef}/>
        </div>
    );
}