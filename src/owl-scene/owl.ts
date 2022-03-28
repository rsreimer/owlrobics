import {BoxGeometry, Mesh, MeshBasicMaterial, Object3D, TextureLoader} from "three";

export interface Owl {
    anchor: Object3D;
    torso: Object3D;
    neck: Object3D;
    head: Object3D;
    leftHip: Object3D;
    leftLeg: Object3D;
    rightHip: Object3D;
    rightLeg: Object3D;
    leftShoulder: Object3D;
    leftUpperWing: Object3D;
    leftElbow: Object3D;
    leftLowerWing: Object3D;
    rightShoulder: Object3D;
    rightUpperWing: Object3D;
    rightElbow: Object3D;
    rightLowerWing: Object3D;
}

interface PngPart {
    name: string;
    height: number;
    width: number;
}

function buildJoint() {
    return new Object3D();
}

function buildPart(part: PngPart): Mesh {
    const loader = new TextureLoader();
    const geometry = new BoxGeometry(part.width, part.height, 0);
    const material = new MeshBasicMaterial({
        map: loader.load(`./images/${part.name}.png`),
        transparent: true
    });
    return new Mesh(geometry, material);
}

export function buildOwl(): Owl {
    const torso = buildPart({
        name: 'torso',
        height: 69.225,
        width: 58.423
    });

    const neck = buildJoint();
    const head = buildPart({
        name: 'head',
        height: 68.125,
        width: 83.547
    });

    const leftHip = buildJoint();
    const leftLeg = buildPart({
        name: 'left-leg',
        width: 39.414,
        height: 41.437
    });

    const rightHip = buildJoint();
    const rightLeg = buildPart({
        name: 'right-leg',
        width: 39.414,
        height: 41.437
    });

    const leftShoulder = buildJoint();
    const leftUpperWing = buildPart({
        name: 'left-upper-wing',
        width: 25.960,
        height: 36.565
    });

    const leftElbow = buildJoint();
    const leftLowerWing = buildPart({
            name: 'left-lower-wing',
            width: 44.920,
            height: 34.711
        }
    );

    const rightShoulder = buildJoint();
    const rightUpperWing = buildPart({
        name: 'right-upper-wing',
        width: 25.960,
        height: 36.565
    });

    const rightElbow = buildJoint();
    const rightLowerWing = buildPart({
        name: 'right-lower-wing',
        width: 44.920,
        height: 34.711
    });

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

    return {
        anchor: torso,
        torso,
        neck,
        head,
        leftHip,
        leftLeg,
        rightHip,
        rightLeg,
        leftShoulder,
        leftUpperWing,
        leftElbow,
        leftLowerWing,
        rightShoulder,
        rightUpperWing,
        rightElbow,
        rightLowerWing,
    }
}
