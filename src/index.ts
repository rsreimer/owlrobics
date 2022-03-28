import {OwlScene} from "./owl-scene/owl-scene";

export function main() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;

    const owlScene = new OwlScene(canvas);

    owlScene.build();

    function animate() {
        requestAnimationFrame(animate);

        owlScene.update();
    }

    animate();
}

main();