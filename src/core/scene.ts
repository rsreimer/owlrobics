import {Results} from "@mediapipe/pose";

export interface Scene {
    update(results: Results): void;
}