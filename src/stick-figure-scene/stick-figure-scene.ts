import {Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";
import {LandmarkList, POSE_CONNECTIONS} from "@mediapipe/pose";
import {buildStickFigure, StickFigure} from "./stick-figure";

export class StickFigureScene {
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;

    private stickFigure: StickFigure | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.scene = new Scene();
        this.scene.background = new Color('white');

        const {width, height} = canvas.getBoundingClientRect();

        this.renderer = new WebGLRenderer({canvas});
        this.renderer.setSize(width, height);

        this.camera = new PerspectiveCamera();
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
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
        })

        stickFigure.lines.forEach((line, i) => {
            const from = pose[POSE_CONNECTIONS[i][0]];
            const to = pose[POSE_CONNECTIONS[i][1]];

            line.geometry.setFromPoints([
                new Vector3(from.x, from.y, 0),
                new Vector3(to.x, to.y, 0),
            ]);
        })

        this.renderer.render(this.scene, this.camera);
    }
}
