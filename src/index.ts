import {OwlScene} from "./owl-scene/owl-scene";
import {PoseEstimator} from "./core/pose-estimator";
import {LandmarkList} from "@mediapipe/pose";
import {StickFigureScene} from "./stick-figure-scene/stick-figure-scene";

export function main() {
    let currentPose: LandmarkList | null = null;

    const poseEstimator = new PoseEstimator();

    poseEstimator.addListener(pose => {
        currentPose = pose.map(p => {
            return {
                x: p.x * 100 - 50,
                y: -(p.y * 100 - 50),
                z: p.z * 100 - 50,
            }
        })
    });

    poseEstimator.start();

    const owlScene = new OwlScene(document.getElementById('owl-canvas') as HTMLCanvasElement);
    const stickFigureScene = new StickFigureScene(document.getElementById('stick-figure-canvas') as HTMLCanvasElement);

    owlScene.build();
    stickFigureScene.build();

    function animate() {
        requestAnimationFrame(animate);

        if (currentPose) {
            owlScene.update(currentPose);
            stickFigureScene.update(currentPose);
        }
    }

    animate();
}

main();
