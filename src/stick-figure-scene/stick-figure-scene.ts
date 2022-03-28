import {Vector3} from "three";
import {LandmarkList, POSE_CONNECTIONS} from "@mediapipe/pose";
import {buildStickFigure, StickFigure} from "./stick-figure";
import {BaseScene} from "../core/BaseScene";

export class StickFigureScene extends BaseScene {
    private stickFigure: StickFigure | null = null;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    build() {
        this.stickFigure = buildStickFigure();

        this.stickFigure.anchor.position.y = 100;

        this.camera.position.z = 250;

        this.scene.add(this.stickFigure.anchor);
    }

    update(pose: LandmarkList) {
        const stickFigure = this.stickFigure;

        if (!stickFigure) {
            return;
        }

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
}
