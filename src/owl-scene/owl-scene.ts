import {Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer} from "three";
import {
    LandmarkList,
    POSE_CONNECTIONS,
    POSE_LANDMARKS,
    POSE_LANDMARKS_LEFT,
    POSE_LANDMARKS_RIGHT
} from "@mediapipe/pose";
import {buildOwl, Owl} from "./owl";
import {buildStickFigure, StickFigure} from "./stick-figure";
import {PoseEstimator} from "../core/pose-estimator";
import {getAngle, getCenter} from "../core/math";

export class OwlScene {
    private poseEstimator: PoseEstimator;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private renderer: WebGLRenderer;

    private currentPose: LandmarkList | null = null;
    private owl: Owl | null = null;
    private stickFigure: StickFigure | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.poseEstimator = new PoseEstimator();
        this.poseEstimator.addListener(pose => {
            this.currentPose = pose.map(p => {
                return {
                    x: p.x * 100 - 50,
                    y: -(p.y * 100 - 50),
                    z: p.z * 100 - 50,
                }
            })
        });
        this.poseEstimator.start();

        this.scene = new Scene();
        this.scene.background = new Color('white');

        this.renderer = new WebGLRenderer({canvas});
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.camera = new PerspectiveCamera();
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    build() {
        this.owl = buildOwl();
        this.scene.add(this.owl.anchor);

        this.stickFigure = buildStickFigure();
        this.stickFigure.anchor.position.x = -120;
        this.stickFigure.anchor.position.y = 50;

        this.camera.position.z = 250;

        this.scene.add(this.stickFigure.anchor);
    }

    update() {
        this.updateStickFigure();
        this.updateOwl();

        this.renderer.render(this.scene, this.camera);
    }

    private updateStickFigure() {
        const stickFigure = this.stickFigure;
        const pose = this.currentPose;

        if (!stickFigure || !pose) {
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
    }

    private updateOwl() {
        const owl = this.owl;
        const pose = this.currentPose;

        if (!owl || !pose) {
            return;
        }

        const betweenShoulders = getCenter([
            pose[POSE_LANDMARKS.LEFT_SHOULDER],
            pose[POSE_LANDMARKS.RIGHT_SHOULDER]
        ])

        const betweenHips = getCenter([
            pose[POSE_LANDMARKS.LEFT_HIP],
            pose[POSE_LANDMARKS.RIGHT_HIP]
        ])

        owl.torso.rotation.z = Math.PI / 2 + getAngle(betweenShoulders, betweenHips);
        owl.neck.rotation.z = -Math.PI / 2 + getAngle(betweenShoulders, pose[POSE_LANDMARKS.NOSE]) - owl.torso.rotation.z;

        owl.leftShoulder.rotation.z = -.7 + getAngle(pose[POSE_LANDMARKS.LEFT_SHOULDER], pose[POSE_LANDMARKS.LEFT_ELBOW]) - owl.torso.rotation.z;
        owl.leftElbow.rotation.z = Math.PI / 4 + getAngle(pose[POSE_LANDMARKS.LEFT_ELBOW], pose[POSE_LANDMARKS.LEFT_WRIST]) - owl.leftShoulder.rotation.z - owl.torso.rotation.z;

        owl.rightShoulder.rotation.z = .7 + Math.PI + getAngle(pose[POSE_LANDMARKS.RIGHT_SHOULDER], pose[POSE_LANDMARKS.RIGHT_ELBOW]) - owl.torso.rotation.z;
        owl.rightElbow.rotation.z = -.7 + Math.PI + getAngle(pose[POSE_LANDMARKS.RIGHT_ELBOW], pose[POSE_LANDMARKS.RIGHT_WRIST]) - owl.rightShoulder.rotation.z - owl.torso.rotation.z;

        owl.leftHip.rotation.z = Math.PI / 2 + getAngle(pose[POSE_LANDMARKS.LEFT_HIP], pose[POSE_LANDMARKS_LEFT.LEFT_KNEE]) - owl.torso.rotation.z;
        owl.rightHip.rotation.z = Math.PI / 2 + getAngle(pose[POSE_LANDMARKS.RIGHT_HIP], pose[POSE_LANDMARKS_RIGHT.RIGHT_KNEE]) - owl.torso.rotation.z;
    }
}
