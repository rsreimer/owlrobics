import {LandmarkList, Pose} from "@mediapipe/pose";
import {Camera} from "@mediapipe/camera_utils";

export type PoseListener = (pose: LandmarkList) => void;

const poseFinder = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

poseFinder.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

const poseListeners: PoseListener[] = [];

poseFinder.onResults(({poseLandmarks}) => {
    poseListeners.forEach(fn => fn(poseLandmarks));
});

const videoElement = document.createElement('video');

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await poseFinder.send({image: videoElement});
    },
    width: 640,
    height: 360
});

export const PoseEstimator = {
    start: () => camera.start(),
    stop: () => camera.stop(),
    addListener: (listener: PoseListener) => poseListeners.push(listener),
    removeListener: (listener: PoseListener) => poseListeners.splice(poseListeners.indexOf(listener), 1),
}