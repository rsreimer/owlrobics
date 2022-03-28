import {OwlScene} from "./owl-scene/owl-scene";
import {PoseEstimator} from "./core/pose-estimator";
import {Results} from "@mediapipe/pose";
import {VideoScene} from "./video-scene/video-scene";

export function main() {
    let currentResults: Results | null = null;

    const poseEstimator = new PoseEstimator();

    poseEstimator.addListener(results => currentResults = results);

    poseEstimator.start();

    const scenes = [
        new VideoScene(document.getElementById('video-canvas') as HTMLCanvasElement),
        //new StickFigureScene(document.getElementById('stick-figure-canvas') as HTMLCanvasElement),
        new OwlScene(document.getElementById('owl-canvas') as HTMLCanvasElement),
    ]

    function animate() {
        requestAnimationFrame(animate);

        if (currentResults) {
            scenes.forEach(scene => scene.update(currentResults!));
        }
    }

    animate();
}

main();
