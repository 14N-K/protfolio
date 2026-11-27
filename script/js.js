const skillsSection = document.querySelector('#skills');
const remoteMenus = document.querySelectorAll('#remote a');
const bar = document.querySelector('.bar');
const menus = document.querySelectorAll('.gnb > li > a');
const sections = document.querySelectorAll('section');
const moreBtn = document.querySelectorAll('.more_btn');
const prodPopup = document.querySelectorAll('#production .prod_popUp');
const closeBtn = document.querySelectorAll('#production .close_btn');

// resetSpotlight();

skillsSection.addEventListener('mousemove', (e) => {
    const rect = skillsSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    skillsSection.style.setProperty('--x', `${x}px`);
    skillsSection.style.setProperty('--y', `${y}px`);
});

skillsSection.addEventListener('mouseleave', () => {
    resetSpotlight();
});

function resetSpotlight() {
    skillsSection.style.setProperty('--x', '-10%');
    skillsSection.style.setProperty('--y', '-10%');
}

/* ── 데모 스타일 자석 모션 (#skills 아이콘 적용) ── */
const skillItems = document.querySelectorAll('#skills .skill_list li');
const strength = 0.5;

skillItems.forEach((item) => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const mapX = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, e.clientX);
        const mapY = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, e.clientY);

        gsap.to(item, {
            x: mapX * strength,
            y: mapY * strength,
            duration: 0.4,
            ease: 'power2.out',
            overwrite: true
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)',
            overwrite: true
        });
    });
});


// 메뉴 클릭 시 해당 섹션으로 이동
function moveToSection(target) {
    const section = document.querySelector(target);
    if (!section) return;

    let targetY = 0;

    if (target !== '#home') {
        const wrap = section.closest('#today_skill_wrap');
        const offsetY = wrap ? Number(gsap.getProperty(wrap, 'y')) || 0 : 0;

        targetY = Math.max(0, section.getBoundingClientRect().top + window.scrollY - offsetY);
    }

    window.scrollTo({
        top: targetY,
        behavior: 'smooth'
    });

    setActive(target);
}


//  헤더 메뉴 이벤트 
menus.forEach((menu, idx) => {
    menu.addEventListener('click', (e) => {
        e.preventDefault();
        
        const target = menu.dataset.target;
        setActive(target);
        moveToSection(target);
    });

    // 메뉴에 마우스를 올리면 bar 표시
    menu.addEventListener('mouseover', () => {
        bar.style.width = `${menu.clientWidth}px`;
        bar.style.left = `${menu.offsetLeft}px`;
    });

    // 메뉴에서 마우스를 벗어나면 bar 숨김
    menu.addEventListener('mouseout', () => {
        bar.style.width = '0px';
        bar.style.left = `${menu.offsetLeft}px`;
    });
});

// production a
// 1. 버튼 클릭 시 토글
moreBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        console.log(setTicketState);

        const currentWrap = btn.closest('.prod_wrap');
        if (!currentWrap) return;

        const isOpen = currentWrap.dataset.opened === 'true';
        setTicketState(currentWrap, !isOpen);

    });
});

// 2. 시야(뷰포트)에서 벗어나면 원래 상태로 복귀
const ticketObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
        if (!entry.isIntersecting && entry.target.dataset.opened === 'true') {
            setTicketState(entry.target, false);
        }
        });
    },
    {
        root: null,
        threshold: 0 // 화면에서 완전히 벗어나면 false가 됨
    }
    );

    document.querySelectorAll('#production .prod_wrap').forEach((wrap) => {
    ticketObserver.observe(wrap);
});

closeBtn.forEach((closeBtn) => {
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const currentWrap = closeBtn.closest('.prod_wrap');
        if (!currentWrap) return;

        setTicketState(currentWrap, false);
    });
});


// remote
// 리모트 메뉴 이벤트
remoteMenus.forEach((menu) => {
    menu.addEventListener("click", (e) => {
        e.preventDefault();

        const target = menu.dataset.target;
        setActive(target);
        moveToSection(target);
    });
});

// 메인 메뉴와 리모트 메뉴의 active + 메인 메뉴의 on을 함께 동기화
function setActive(target) {
    menus.forEach((menu) => {
        const isMatch = menu.dataset.target === target;
        menu.classList.toggle("active", isMatch);
        menu.classList.toggle("on", isMatch);
    });

    remoteMenus.forEach((menu) => {
        menu.classList.toggle("active", menu.dataset.target === target);
    });
}

// 스크롤에 따라 메뉴의 active와 on이 함께 따라 붙음
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const targetId = "#" + entry.target.id;
            setActive(targetId);
        }
    });
}, {
    root: null,
    threshold: 0,
    rootMargin: "-20% 0px -60% 0px"
});

sections.forEach((section) => {
    observer.observe(section);
});

// top
const topBtn = document.querySelector('#top_btn a')

topBtn.addEventListener("click", (e) => {
    e.preventDefault();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});



// window.addEventListener("mousemove", (e) => {
//     const s = document.createElement("div");
//     s.className = "sparkle";
//     s.style.left = e.clientX + "px";
//     s.style.top = e.clientY + "px";
//     document.body.appendChild(s);

//     requestAnimationFrame(() => {
//         s.style.transform = "translate(-50%, -50%) scale(1.4) rotate(90deg)";
//         s.style.opacity = "0";
//     });

//     setTimeout(() => s.remove(), 600);
// });