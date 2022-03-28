import {Landmark, LandmarkList} from "@mediapipe/pose";

export function getCenter(landmarks: LandmarkList) {
    return {
        x: landmarks.reduce((sum, l) => l.x + sum, 0) / landmarks.length,
        y: landmarks.reduce((sum, l) => l.y + sum, 0) / landmarks.length,
        z: landmarks.reduce((sum, l) => l.z + sum, 0) / landmarks.length,
    }
}

export function getAngle(a: Landmark, b: Landmark) {
    return Math.atan2(b.y - a.y, b.x - a.x);
}