import {POSE_CONNECTIONS, Results} from "@mediapipe/pose";
import {drawConnectors, drawLandmarks} from "@mediapipe/drawing_utils";
import {Scene} from "../core/scene";


export class VideoScene implements Scene {
    constructor(private canvas: HTMLCanvasElement) {
    }

    update(results: Results) {
        const canvasCtx = this.canvas.getContext('2d')!;

        canvasCtx.drawImage(
            results.image, 0, 0, this.canvas.width, this.canvas.height
        );

        canvasCtx.globalCompositeOperation = 'source-over';

        drawConnectors(
            canvasCtx,
            results.poseLandmarks,
            POSE_CONNECTIONS,
            {color: '#0000ff', lineWidth: .2}
        );

        drawLandmarks(
            canvasCtx,
            results.poseLandmarks,
            {color: '#00ff00', radius: .5}
        );

        canvasCtx.restore();
    }
}