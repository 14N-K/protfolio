const home = document.querySelector("#home");

function isHomeTop() {
    if (!home) return false;

    const rect = home.getBoundingClientRect();
    const isNotTop = window.scrollY <= 50;
    const isHomeVisible = rect.top < window.innerHeight && rect.bottom > 0;

    return isNotTop && isHomeVisible;
}


gsap.registerPlugin(ScrollTrigger);

// 1. 기존 인트로 tl1
function homeIntro() {
    if (!isHomeTop()) {
        // 다른 구간에서 새로고침된 경우: 잠금 없이 즉시 완료 상태로 두거나 생략
        gsap.set("#home .dark", { opacity: 0 });
        gsap.set("#home", { "--light": 1 });
        gsap.set([".sec01_tit", ".sec01_txt"], { y: 0, opacity: 1 });
        return;
    }

    lockScreenAndInput();

    const tl1 = gsap.timeline({
        delay: 0.5,
        onComplete: unlockScreenAndInput,
        onInterrupt: unlockScreenAndInput
    });
    
    tl1.to("#home .dark", {
        opacity: 0,
        duration: 0.7,
        ease: "power2.out"
    }, 0)
    // 조명 깜빡임
    .to("#home", {
        "--light": 0.3,
        duration: 0.08,
        ease: "none"
    }, 0)
    .to("#home", {
        "--light": 0.05,
        duration: 0.08,
        ease: "none"
    })
    .to("#home", {
        "--light": 0.6,
        duration: 0.1,
        ease: "none"
    })
    .to("#home", {
        "--light": 0.15,
        duration: 0.08,
        ease: "none"
    })
    .to("#home", {
        "--light": 1.3,
        duration: 0.12,
        ease: "power4.out"
    })
    .to("#home", {
        "--light": 1,
        duration: 0.5,
        ease: "power2.out"
    })
    .fromTo(
        ".sec01_tit",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
        "-=0.35"
    )
    .fromTo(
        ".sec01_txt",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.7, ease: "power3.out" },
        "-=0.4"
    );
}
window.addEventListener("load", homeIntro);

ScrollTrigger.create({
    id: "homePin",
    trigger: "#home",
    start: "top top",
    end: () => "+=" + window.innerHeight,
    pin: true,
    pinSpacing: false,
    invalidateOnRefresh: true
});

function setTicketState(wrap, open) {
    if (!wrap) return;

    const left = wrap.querySelector(".prod_left");
    const right = wrap.querySelector(".prod_right");
    const popUp = wrap.querySelector(".prod_popUp");

    gsap.to(left, {
        x: open ? -90 : 0,
        rotation: open ? -3 : 0,
        transformOrigin: "right center",
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto"
    });

    gsap.to(right, {
        x: open ? 90 : 0,
        rotation: open ? 3 : 0,
        transformOrigin: "left center",
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto"
    });

    if (popUp) {
        if (open) {
            popUp.classList.add("on");
            gsap.fromTo(
                popUp,
                { autoAlpha: 0, scale: 0.96 },
                {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.4,
                    delay: 0.15,
                    ease: "power2.out",
                    overwrite: "auto"
                }
            );
        } else {
            gsap.to(popUp, {
                autoAlpha: 0,
                scale: 0.96,
                duration: 0.25,
                ease: "power2.in",
                overwrite: "auto",
                onComplete: () => {
                    popUp.classList.remove("on");
                }
            });
        }
    }

    wrap.dataset.opened = String(open);
}

gsap.fromTo(".skills_wrap .skill_list > *", 
    { opacity: 0, x: 200 }, 
    { 
        opacity: 1, 
        x: 0, 
        duration: 0.5,
        ease: "back.out(1.7)", // 목표 지점(x: 0)을 살짝 넘겼다가 튕기듯 복귀
        stagger: 0.3,
        scrollTrigger:{
            trigger: ".skills_wrap",
            toggleActions: "play none none reverse"
        }
    }
);


document.querySelectorAll("#production .link-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        // 여기에 모달 열기 등 추가 동작을 이어서 넣으면 됩니다
    });
});


const productionEl = document.querySelector("#production");
const prodWraps = gsap.utils.toArray("#production .prod_wrap");

const prodAnimations = prodWraps.map((wrap) =>
    gsap.fromTo(
        wrap,
        {
            y: 100,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            paused: true
        }
    )
);

function revealProdWraps() {
    prodWraps.forEach((wrap, idx) => {
        const anim = prodAnimations[idx];
        const rect = wrap.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.85) {
            anim.play();
        }

        ScrollTrigger.create({
            trigger: wrap,
            start: "top 85%",
            end: "top 50%",
            onEnter: () => anim.play(),
            onEnterBack: () => anim.play(),
            onLeaveBack: () => anim.reverse()
        });
    });
}

// 현재 스크롤 위치에서 #production 상단을 화면 맨 위에 맞추고 콜백 실행
function alignToProductionTop(onAligned) {
    if (!productionEl) {
        onAligned();
        return;
    }

    const targetY = window.scrollY + productionEl.getBoundingClientRect().top;

    // 이미 거의 맞춰져 있다면 바로 진행
    if (Math.abs(window.scrollY - targetY) <= 4) {
        window.scrollTo(0, targetY);
        onAligned();
        return;
    }

    // GSAP으로 부드럽게 이동 (Lenis 등 커스텀 스크롤을 쓰면 해당 스크롤 이동 함수로 교체)
    const scrollProxy = { y: window.scrollY };

    gsap.to(scrollProxy, {
        y: targetY,
        duration: 0.45,
        ease: "power2.out",
        onUpdate: () => {
            window.scrollTo(0, scrollProxy.y);
        },
        onComplete: () => {
            window.scrollTo(0, targetY);
            onAligned();
        },
        onInterrupt: () => {
            onAligned();
        }
    });
}

function initProductionBlackout(onBlackoutDone) {
    let isTriggered = false;

    const blackoutTl = gsap.timeline({
        paused: true,
        onComplete: () => {
            unlockScreenAndInput();
            if (typeof onBlackoutDone === "function") {
                onBlackoutDone();
            }
        },
        onInterrupt: () => {
            unlockScreenAndInput();
        }
    });

    blackoutTl
        .to(".section-blackout", {
            opacity: 1,
            duration: 0.8,
            ease: "power2.in"
        })
        .to(".section-blackout", {
            opacity: 0,
            duration: 1.2,
            delay: 0.4,
            ease: "power2.out"
        });

    ScrollTrigger.create({
        trigger: "#production",
        start: "top 20%", // 이 지점에 들어오면 정렬 후 암전 시작
        once: true,
        onEnter: () => {
            if (isTriggered) return;
            isTriggered = true;

            lockScreenAndInput();
            alignToProductionTop(() => {
                blackoutTl.play(0);
            });
        }
    });
}

initProductionBlackout(revealProdWraps);



// 스크롤 / 마우스 커서 방지
function setInteractionLocked(locked) {
    document.body.classList.toggle("is-anim-locked", locked);
}

function preventScroll(e) {
    e.preventDefault();
}

function preventScrollKeys(e) {
    const blockedKeys = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Space",
        "PageUp",
        "PageDown",
        "Home",
        "End"
    ];
    if (blockedKeys.includes(e.code)) {
        e.preventDefault();
    }
}

function lockScreenAndInput() {
    setInteractionLocked(true);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventScrollKeys, { passive: false });
}

function unlockScreenAndInput() {
    setInteractionLocked(false);
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("keydown", preventScrollKeys);
}
