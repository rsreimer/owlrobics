import {Vector3} from "three";
import {POSE_CONNECTIONS, Results} from "@mediapipe/pose";
import {buildStickFigure, StickFigure} from "./stick-figure";
import {BaseScene} from "../core/base-scene";
import {Scene} from "../core/scene";

export class StickFigureScene extends BaseScene implements Scene {
    private stickFigure: StickFigure | null = null;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        this.build();
    }

    update(results: Results) {
        const stickFigure = this.stickFigure;

        if (!stickFigure || !results.poseLandmarks) {
            return;
        }

        const pose = results.poseLandmarks.map(p => {
            return {
                x: p.x * 100 - 50,
                y: -(p.y * 100 - 50),
                z: p.z * 100 - 50,
            }
        })

        stickFigure.nodes.forEach((node, i) => {
            const poseNode = pose[i];

            node.position.x = poseNode.x;
            node.position.y = poseNode.y;
            node.position.z = poseNode.z;
        })

        stickFigure.lines.forEach((line, i) => {
            const from = pose[POSE_CONNECTIONS[i][0]];
            const to = pose[POSE_CONNECTIONS[i][1]];

            line.geometry.setFromPoints([
                new Vector3(from.x, from.y, from.z),
                new Vector3(to.x, to.y, to.z),
            ]);
        })

        this.render();
    }

    private build() {
        this.stickFigure = buildStickFigure();

        this.stickFigure.anchor.position.y = 100;

        this.camera.position.z = 250;

        this.scene.add(this.stickFigure.anchor);
    }
}
