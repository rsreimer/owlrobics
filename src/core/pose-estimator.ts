import {Pose, Results} from "@mediapipe/pose";
import {Camera} from "@mediapipe/camera_utils";

export type PoseListener = (results: Results) => void;

export class PoseEstimator {
    private camera: Camera;
    private listeners: PoseListener[] = [];
    private pose: Pose;

    constructor(height = 360, width = 640) {
        const videoElement = document.createElement('video');

        this.pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        this.pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.pose.onResults((results) => this.notifyListeners(results));

        this.camera = new Camera(videoElement, {
            onFrame: () => this.pose.send({image: videoElement}),
            width,
            height
        });
    }

    start() {
        this.camera.start()
    }

    stop() {
        this.camera.stop()
    }

    addListener(listener: PoseListener) {
        this.listeners.push(listener)
    }

    removeListener(listener: PoseListener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1)
    }

    private notifyListeners(results: Results) {
        this.listeners.forEach(fn => fn(results));
    }
}
