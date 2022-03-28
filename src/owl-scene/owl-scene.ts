import {LandmarkList, POSE_LANDMARKS, POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT} from "@mediapipe/pose";
import {buildOwl, Owl} from "./owl";
import {getAngle, getCenter} from "../core/math";
import {BaseScene} from "../core/BaseScene";

export class OwlScene extends BaseScene {
    private owl: Owl | null = null;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
    }

    build() {
        this.owl = buildOwl();
        this.scene.add(this.owl.anchor);

        this.camera.position.z = 250;
    }

    update(pose: LandmarkList) {
        const owl = this.owl;

        if (!owl) {
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

        this.render();
    }
}
