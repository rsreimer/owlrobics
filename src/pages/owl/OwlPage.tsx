import './OwlPage.css';
import {
    BoxGeometry,
    BufferGeometry,
    Color,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";
import {useEffect, useRef} from "react";
import {Landmark, LandmarkList, POSE_CONNECTIONS, POSE_LANDMARKS} from "@mediapipe/pose";
import {testPose} from "../../test-pose";
import {PoseEstimator} from "../../core/poseEstimator";

interface PngPart {
    name: string;
    height: number;
    width: number;
}

const torsoPng = {
    name: 'torso',
    height: 69.225,
    width: 58.423
}

const headPng = {
    name: 'head',
    height: 68.125,
    width: 83.547
}

const leftLegPng = {
    name: 'left-leg',
    width: 39.414,
    height: 41.437
}

const rightLegPng = {
    name: 'right-leg',
    width: 39.331,
    height: 41.401
}

const leftUpperWingPng = {
    name: 'left-upper-wing',
    width: 25.960,
    height: 36.565
}

const leftLowerWingPng = {
    name: 'left-lower-wing',
    width: 44.920,
    height: 34.711
}

const rightUpperWingPng = {
    name: 'right-upper-wing',
    width: 25.960,
    height: 36.565
}

const rightLowerWingPng = {
    name: 'right-lower-wing',
    width: 44.920,
    height: 34.711
}

function getCenter(landmarks: LandmarkList): Landmark {
    return {
        x: landmarks.reduce((sum, l) => l.x + sum, 0) / landmarks.length,
        y: landmarks.reduce((sum, l) => l.y + sum, 0) / landmarks.length,
        z: landmarks.reduce((sum, l) => l.z + sum, 0) / landmarks.length,
    }
}

function getAngle(a: Landmark, b: Landmark): number {
    const m = (b.y - a.y) / (b.x - a.x);
    return Math.atan(m);
}

let pose: LandmarkList = testPose;

function getPart(part: PngPart): Mesh {
    const loader = new TextureLoader();
    const geometry = new BoxGeometry(part.width, part.height, 0);
    const material = new MeshBasicMaterial({
        map: loader.load(`/svg/${part.name}.png`),
        transparent: true
    });
    return new Mesh(geometry, material);
}

function animateBetween(steps: number, from: number, to: number) {
    return (frame: number) => (to - from) * ((frame % steps) / steps) + from;
}

function renderPoseLines(pose: LandmarkList, lines: Line[]) {
    lines.forEach((line, i) => {
        const from = pose[POSE_CONNECTIONS[i][0]];
        const to = pose[POSE_CONNECTIONS[i][1]];

        line.geometry.setFromPoints([
            new Vector3(from.x, from.y, from.z),
            new Vector3(to.x, to.y, to.z),
        ]);
    })
}

async function renderScene(canvas: HTMLCanvasElement) {
    const scene = new Scene();
    scene.background = new Color('white');
    const camera = new PerspectiveCamera();
    const renderer = new WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    const torso = getPart(torsoPng);
    const head = getPart(headPng);
    const leftLeg = getPart(leftLegPng);
    const rightLeg = getPart(rightLegPng);
    const leftUpperWing = getPart(leftUpperWingPng);
    const leftLowerWing = getPart(leftLowerWingPng);
    const rightUpperWing = getPart(rightUpperWingPng);
    const rightLowerWing = getPart(rightLowerWingPng);

    torso.add(head);
    head.position.y = 60;

    torso.add(leftLeg);
    leftLeg.position.x = 15;
    leftLeg.position.y = -30;
    leftLeg.position.z = -1;

    torso.add(rightLeg);
    rightLeg.position.x = -15;
    rightLeg.position.y = -30;
    rightLeg.position.z = -1;

    torso.add(leftUpperWing);
    leftUpperWing.position.x = 30;
    leftUpperWing.position.y = 18;
    leftUpperWing.position.z = -1;

    leftUpperWing.add(leftLowerWing);
    leftLowerWing.position.x = 28;
    leftLowerWing.position.y = 6;
    leftLowerWing.position.z = 1;

    torso.add(rightUpperWing);
    rightUpperWing.position.x = -30;
    rightUpperWing.position.y = 18;
    rightUpperWing.position.z = -1;

    rightUpperWing.add(rightLowerWing);
    rightLowerWing.position.x = -28;
    rightLowerWing.position.y = 6;
    rightLowerWing.position.z = 1;

    scene.add(torso);

    // POSE
    const poseLines = POSE_CONNECTIONS.map(() => {
        const material = new LineBasicMaterial({color: 0xaaaaff});
        const geometry = new BufferGeometry();
        return new Line(geometry, material);
    });
    scene.add(...poseLines);

    camera.position.z = 250;

    let frame = 0;

    const rotatePi = animateBetween(600, -Math.PI * 2, Math.PI * 2);

    function animate() {
        requestAnimationFrame(animate);

        const scaledPose: LandmarkList = pose.map(p => {
            return {
                x: p.x * 100 - 50,
                y: -(p.y * 100 - 50),
                z: p.z * 100 - 50,
            }
        })

        //renderPoseLines(scaledPose, poseLines);

        if (scaledPose) {
            torso.rotation.z = getAngle(scaledPose[POSE_LANDMARKS.LEFT_SHOULDER], scaledPose[POSE_LANDMARKS.RIGHT_SHOULDER]);
            head.rotation.z = getAngle(scaledPose[POSE_LANDMARKS.LEFT_EYE], scaledPose[POSE_LANDMARKS.RIGHT_EYE]) - torso.rotation.z;
        }

        renderer.render(scene, camera);
        frame++;
    }

    animate();
}

PoseEstimator.start();
PoseEstimator.addListener(p => pose = p);

export const OwlPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            renderScene(canvasRef.current)
        }
    }, [canvasRef])

    return (
        <canvas ref={canvasRef}/>
    )
}