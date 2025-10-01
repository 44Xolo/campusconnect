import gsap from "gsap";    
import ScrollTrigger from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "Lenis";

document.addEventListener("DOMContentLoaded", function() {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis({});
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    initSpotlightAnimation();
    window.addEventListener("resize", initSpotlightAnimation);

    function initSpotlightAnimation() {
        const images = document.querySelectorAll(".img");
        const covering = document.querySelector(".spotlight-cover-img");
        const introHeader = document.querySelector(".spotlight-intro-header h1");
        const outroHeader = document.querySelector(".spotlight-outro-header h1");

        let intoHeaderSplit = null;
        let outroHeaderSplit = null;

        intoHeaderSplit = SplitText.create(introHeader, { type: "words"});
        gsap.set(introHeaderSplit.words, { opacity: 1 });

        outroHeaderSplit = SplitText.create(outroHeader, { type: "words"});
        gsap.set(outroHeaderSplit.words, { opacity: 0 });
        gsap.set(outroHeader, { opacity: 1 });

        const scatterDirections = [
            { x: -100, y: -100 },
            { x: 100, y: -100 },
            { x: -100, y: 100 },
            { x: 100, y: 100 }
        ];

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isMobile = screenWidth < 1000;
        const scatterDistance = isMobile ? 50 : 100;

        const startPositions = Array.from(images).map(img => ({
            x: 0,
            y: 0,
            z: -1000,
            scale: 0,
        }));

        const endPositions = scatterDirections.map((dir) => ({
            x: dir.x * screenWidth * scatterMultiplier,
            y: dir.y * screenHeight * scatterMultiplier,
            z: 2000,
            scale: 1,
        }));

        images.forEach((img, index) => {
            gsap.set(img, startPositions[index]);
        });

        gsap.set(covering, {
            z: -1000,
            scale: 0,
            x: 0,
            y: 0,
        });

ScrollTrigger.create({
    trigger: ".spotlight",
    start: "top top",
    end: () => `${window.innerHeight * 1.51}px`,
    pin: true,
    pinSpacing: true,
    scrub: 1,
    onUpdate: (self) => {
        const progress = self.progress;

        images.forEach((img, index) => {
            const staggerDelay = index * 0.03;
            const scaleMultiplier = isMobile ? 4 : 2;

            let imageProgress = Math.max(0, (progress - staggerDelay) * 4);

            const start = startPositions[index];
            const end = endPositions[index];

            const xValue = gsap.utils.interpolate(start.x, end.x, imageProgress);
            const yValue = gsap.utils.interpolate(start.y, end.y, imageProgress);
            const zValue = gsap.utils.interpolate(start.z, end.z, imageProgress);
            const scaleValue = gsap.utils.interpolate(start.scale, end.scale * scaleMultiplier, imageProgress);

            gsap.set(img, {
                z: zValue,
                scale: scaleValue,
                x: xValue,
                y: yValue,
            });
        });

        const coverProgress = Math.max(0, (progress - 0.7) * 4);
        const cover2Value =  -1000 + 1000 * coverProgress;
        gsap.set(covering, {
            z: cover2Value,
            scale: gsap.utils.interpolate(0, 1, coverProgress),
            x: 0,
            y: 0,
        });
    }
    // Close initSpotlightAnimation function

    // Close ScrollTrigger.create
    }); // <-- Add this to close ScrollTrigger.create

} // <-- Add this to close initSpotlightAnimation

}); // Close DOMContentLoaded event listener