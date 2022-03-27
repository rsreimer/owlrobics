import {
    BoxGeometry,
    BufferGeometry,
    Color,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PerspectiveCamera,
    Scene,
    TextureLoader,
    Vector3,
    WebGLRenderer
} from "three";
import {POSE_CONNECTIONS, POSE_LANDMARKS, POSE_LANDMARKS_LEFT, POSE_LANDMARKS_RIGHT} from "@mediapipe/pose";
import {PoseEstimator} from "./poseEstimator";

const testPose = [
    {
        "x": 0.48504871129989624,
        "y": 0.2896196246147156,
        "z": -0.4385867714881897,
        "visibility": 0.9999812841415405
    },
    {
        "x": 0.4847812056541443,
        "y": 0.2699303925037384,
        "z": -0.4215628206729889,
        "visibility": 0.9999420642852783
    },
    {
        "x": 0.48727765679359436,
        "y": 0.2670488655567169,
        "z": -0.42156219482421875,
        "visibility": 0.9999348521232605
    },
    {
        "x": 0.4898533821105957,
        "y": 0.26396146416664124,
        "z": -0.42156800627708435,
        "visibility": 0.9999290704727173
    },
    {
        "x": 0.47629228234291077,
        "y": 0.2763731777667999,
        "z": -0.42687639594078064,
        "visibility": 0.9999469518661499
    },
    {
        "x": 0.47280606627464294,
        "y": 0.27802589535713196,
        "z": -0.4271685481071472,
        "visibility": 0.9999397397041321
    },
    {
        "x": 0.4693925976753235,
        "y": 0.2803013324737549,
        "z": -0.4271685481071472,
        "visibility": 0.9999375939369202
    },
    {
        "x": 0.4918431341648102,
        "y": 0.2619970440864563,
        "z": -0.291664183139801,
        "visibility": 0.9999046921730042
    },
    {
        "x": 0.46271008253097534,
        "y": 0.2880071997642517,
        "z": -0.3145982325077057,
        "visibility": 0.999925434589386
    },
    {
        "x": 0.4925716817378998,
        "y": 0.30019256472587585,
        "z": -0.38648492097854614,
        "visibility": 0.9999210238456726
    },
    {
        "x": 0.48319387435913086,
        "y": 0.3087333142757416,
        "z": -0.3933764100074768,
        "visibility": 0.9999279975891113
    },
    {
        "x": 0.5345994234085083,
        "y": 0.29217204451560974,
        "z": -0.19382344186306,
        "visibility": 0.9998868107795715
    },
    {
        "x": 0.45429739356040955,
        "y": 0.3944155275821686,
        "z": -0.2061290293931961,
        "visibility": 0.999824583530426
    },
    {
        "x": 0.600310742855072,
        "y": 0.2249721884727478,
        "z": -0.1935342699289322,
        "visibility": 0.9980730414390564
    },
    {
        "x": 0.39674240350723267,
        "y": 0.472278892993927,
        "z": -0.2231559455394745,
        "visibility": 0.9952588081359863
    },
    {
        "x": 0.6394943594932556,
        "y": 0.11717447638511658,
        "z": -0.3012012839317322,
        "visibility": 0.995522677898407
    },
    {
        "x": 0.33191585540771484,
        "y": 0.4413192868232727,
        "z": -0.33291539549827576,
        "visibility": 0.9938388466835022
    },
    {
        "x": 0.6480354070663452,
        "y": 0.08555532246828079,
        "z": -0.3286283612251282,
        "visibility": 0.9807319045066833
    },
    {
        "x": 0.31256869435310364,
        "y": 0.4351242780685425,
        "z": -0.3622294068336487,
        "visibility": 0.9797226786613464
    },
    {
        "x": 0.6430731415748596,
        "y": 0.07646273076534271,
        "z": -0.3603983521461487,
        "visibility": 0.9830441474914551
    },
    {
        "x": 0.3130102753639221,
        "y": 0.427935928106308,
        "z": -0.3846454620361328,
        "visibility": 0.9816734790802002
    },
    {
        "x": 0.6395963430404663,
        "y": 0.09030312299728394,
        "z": -0.31988224387168884,
        "visibility": 0.9830765128135681
    },
    {
        "x": 0.31938663125038147,
        "y": 0.42763325572013855,
        "z": -0.3468638062477112,
        "visibility": 0.9796893000602722
    },
    {
        "x": 0.6152304410934448,
        "y": 0.5043882727622986,
        "z": -0.003599149640649557,
        "visibility": 0.998533308506012
    },
    {
        "x": 0.5683942437171936,
        "y": 0.5764451026916504,
        "z": 0.003530514659360051,
        "visibility": 0.9988162517547607
    },
    {
        "x": 0.7258895635604858,
        "y": 0.5519930720329285,
        "z": -0.15170316398143768,
        "visibility": 0.9837262630462646
    },
    {
        "x": 0.5666495561599731,
        "y": 0.7648898363113403,
        "z": -0.11562193930149078,
        "visibility": 0.990524172782898
    },
    {
        "x": 0.8358624577522278,
        "y": 0.6318735480308533,
        "z": -0.1050773411989212,
        "visibility": 0.9699724316596985
    },
    {
        "x": 0.5772876739501953,
        "y": 0.965059757232666,
        "z": -0.06707553565502167,
        "visibility": 0.9769977331161499
    },
    {
        "x": 0.849467933177948,
        "y": 0.6601642370223999,
        "z": -0.10690973699092865,
        "visibility": 0.8779350519180298
    },
    {
        "x": 0.585389256477356,
        "y": 0.9791157245635986,
        "z": -0.06848882883787155,
        "visibility": 0.8506261706352234
    },
    {
        "x": 0.86225426197052,
        "y": 0.6170041561126709,
        "z": -0.23431861400604248,
        "visibility": 0.9367793202400208
    },
    {
        "x": 0.5631188154220581,
        "y": 1.0389834642410278,
        "z": -0.1881534308195114,
        "visibility": 0.9422853589057922
    }
]


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
    width: 39.414,
    height: 41.437
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

function getCenter(landmarks) {
    return {
        x: landmarks.reduce((sum, l) => l.x + sum, 0) / landmarks.length,
        y: landmarks.reduce((sum, l) => l.y + sum, 0) / landmarks.length,
        z: landmarks.reduce((sum, l) => l.z + sum, 0) / landmarks.length,
    }
}

function getAngle(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

let pose = testPose;

function getJoint() {
    return new Object3D();
}

function getPart(part) {
    const loader = new TextureLoader();
    const geometry = new BoxGeometry(part.width, part.height, 0);
    const material = new MeshBasicMaterial({
        map: loader.load(`./public/svg/${part.name}.png`),
        transparent: true
    });
    return new Mesh(geometry, material);
}

function renderPoseNodes(pose, nodes) {
    nodes.forEach((node, i) => {
        const poseNode = pose[i];

        node.position.x = poseNode.x;
        node.position.y = poseNode.y;
    })
}

function renderPoseLines(pose, lines) {
    lines.forEach((line, i) => {
        const from = pose[POSE_CONNECTIONS[i][0]];
        const to = pose[POSE_CONNECTIONS[i][1]];

        line.geometry.setFromPoints([
            new Vector3(from.x, from.y, 0),
            new Vector3(to.x, to.y, 0),
        ]);
    })
}

async function renderScene(canvas) {
    const scene = new Scene();
    scene.background = new Color('white');
    const camera = new PerspectiveCamera();
    const renderer = new WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    const torso = getPart(torsoPng);
    const neck = getJoint();
    const head = getPart(headPng);
    const leftHip = getJoint();
    const leftLeg = getPart(leftLegPng);
    const rightHip = getJoint();
    const rightLeg = getPart(rightLegPng);
    const leftShoulder = getJoint();
    const leftUpperWing = getPart(leftUpperWingPng);
    const leftElbow = getJoint();
    const leftLowerWing = getPart(leftLowerWingPng);
    const rightShoulder = getJoint();
    const rightUpperWing = getPart(rightUpperWingPng);
    const rightElbow = getJoint();
    const rightLowerWing = getPart(rightLowerWingPng);

    torso.add(neck);
    neck.position.y = 35;
    neck.position.z = 1;

    neck.add(head);
    head.position.y = 25;

    torso.add(leftHip);
    leftHip.position.x = 20;
    leftHip.position.y = -20;
    leftHip.position.z = -1;

    leftHip.add(leftLeg);
    leftLeg.position.x = -5;
    leftLeg.position.y = -7;
    leftLeg.position.z = -1;

    torso.add(rightHip);
    rightHip.position.x = -20;
    rightHip.position.y = -20;
    rightHip.position.z = -1;

    rightHip.add(rightLeg);
    rightLeg.position.x = 2;
    rightLeg.position.y = -7;
    rightLeg.position.z = -1;

    torso.add(leftShoulder);
    leftShoulder.position.x = 22;
    leftShoulder.position.y = 17;

    leftShoulder.add(leftUpperWing);
    leftUpperWing.position.x = 10;
    leftUpperWing.position.y = 2;
    leftUpperWing.position.z = -1;

    leftUpperWing.add(leftElbow);
    leftElbow.position.x = 7;
    leftElbow.position.y = 12;
    leftElbow.position.z = 1;

    leftElbow.add(leftLowerWing);
    leftLowerWing.position.x = 20;
    leftLowerWing.position.y = -8;
    leftLowerWing.position.z = -1;

    torso.add(rightShoulder);
    rightShoulder.position.x = -23;
    rightShoulder.position.y = 17;

    rightShoulder.add(rightUpperWing);
    rightUpperWing.position.x = -10;
    rightUpperWing.position.y = 2;
    rightUpperWing.position.z = -1;

    rightUpperWing.add(rightElbow);
    rightElbow.position.x = -7;
    rightElbow.position.y = 12;
    rightElbow.position.z = 1;

    rightElbow.add(rightLowerWing);
    rightLowerWing.position.x = -20;
    rightLowerWing.position.y = -8;
    rightLowerWing.position.z = -1;

    scene.add(torso);

    // POSE
    const poseNodes = pose.map(n => {
        const material = new MeshBasicMaterial({
            color: 0x00ff00
        });
        const geometry = new BoxGeometry(1, 1, 1);
        return new Mesh(geometry, material);
    })

    const poseLines = POSE_CONNECTIONS.map(() => {
        const material = new LineBasicMaterial({
            color: 0x0000ff,
        });
        const geometry = new BufferGeometry();
        return new Line(geometry, material);
    });

    const poseGroup = new Object3D();

    poseGroup.position.x = pose[0].x - 120;
    poseGroup.position.y = pose[0].y + 50;

    poseGroup.add(...poseLines);
    poseGroup.add(...poseNodes);
    scene.add(poseGroup);

    camera.position.z = 250;

    function animate() {
        requestAnimationFrame(animate);

        const scaledPose = pose.map(p => {
            return {
                x: p.x * 100 - 50,
                y: -(p.y * 100 - 50),
                z: p.z * 100 - 50,
            }
        })

        renderPoseNodes(scaledPose, poseNodes);
        renderPoseLines(scaledPose, poseLines);

        if (scaledPose) {
            const betweenShoulders = getCenter([
                scaledPose[POSE_LANDMARKS.LEFT_SHOULDER],
                scaledPose[POSE_LANDMARKS.RIGHT_SHOULDER]
            ])

            const betweenHips = getCenter([
                scaledPose[POSE_LANDMARKS.LEFT_HIP],
                scaledPose[POSE_LANDMARKS.RIGHT_HIP]
            ])

            torso.rotation.z = Math.PI / 2 + getAngle(betweenShoulders, betweenHips);
            neck.rotation.z = -Math.PI / 2 + getAngle(betweenShoulders, scaledPose[POSE_LANDMARKS.NOSE]) - torso.rotation.z;

            leftShoulder.rotation.z = -.7 + getAngle(scaledPose[POSE_LANDMARKS.LEFT_SHOULDER], scaledPose[POSE_LANDMARKS.LEFT_ELBOW]) - torso.rotation.z;
            leftElbow.rotation.z = Math.PI / 4 + getAngle(scaledPose[POSE_LANDMARKS.LEFT_ELBOW], scaledPose[POSE_LANDMARKS.LEFT_WRIST]) - leftShoulder.rotation.z - torso.rotation.z;

            rightShoulder.rotation.z = .7 + Math.PI + getAngle(scaledPose[POSE_LANDMARKS.RIGHT_SHOULDER], scaledPose[POSE_LANDMARKS.RIGHT_ELBOW]) - torso.rotation.z;
            rightElbow.rotation.z = -.7 + Math.PI + getAngle(scaledPose[POSE_LANDMARKS.RIGHT_ELBOW], scaledPose[POSE_LANDMARKS.RIGHT_WRIST]) - rightShoulder.rotation.z - torso.rotation.z;

            leftHip.rotation.z = Math.PI / 2 + getAngle(scaledPose[POSE_LANDMARKS.LEFT_HIP], scaledPose[POSE_LANDMARKS_LEFT.LEFT_KNEE]) - torso.rotation.z;
            rightHip.rotation.z = Math.PI / 2 + getAngle(scaledPose[POSE_LANDMARKS.RIGHT_HIP], scaledPose[POSE_LANDMARKS_RIGHT.RIGHT_KNEE]) - torso.rotation.z;
        }

        renderer.render(scene, camera);
    }

    animate();
}

PoseEstimator.start();
PoseEstimator.addListener(p => pose = p);

renderScene(document.getElementById('canvas'))