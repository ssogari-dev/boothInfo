// 헤더 관리 관련 변수
let headerState = {
    isHidden: false,
    autoHide: true, // 새로 추가
    lastScrollTop: 0,
    scrollThreshold: 5
};

// 새로 추가: 스크롤 기반 자동 숨김
function initAutoHideHeader() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleAutoHide();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function handleAutoHide() {
    if (!headerState.autoHide || window.innerWidth > 768) return;
    const currentScrollTop = window.pageYOffset;
    const scrollDelta = Math.abs(currentScrollTop - headerState.lastScrollTop);
    if (scrollDelta < headerState.scrollThreshold) return;
    if (currentScrollTop > headerState.lastScrollTop && currentScrollTop > 100) {
        // 스크롤 다운 - 헤더 숨기기
        if (!headerState.isHidden) {
            hideHeaderAuto();
        }
    } else {
        // 스크롤 업 - 헤더 보이기
        if (headerState.isHidden) {
            showHeaderAuto();
        }
    }
    headerState.lastScrollTop = currentScrollTop;
}

function hideHeaderAuto() {
    const header = document.getElementById('mainHeader');
    const container = document.querySelector('.container');
    header.style.transform = 'translateY(calc(-100% + 40px))';
    container.classList.add('header-hidden');
    headerState.isHidden = true;
    updateToggleButton();
}

function showHeaderAuto() {
    const header = document.getElementById('mainHeader');
    const container = document.querySelector('.container');
    header.style.transform = 'translateY(0)';
    container.classList.remove('header-hidden');
    headerState.isHidden = false;
    updateToggleButton();
    if (typeof calculateAndApplyHeaderHeight === 'function') {
        setTimeout(calculateAndApplyHeaderHeight, 100);
    }
}

function updateToggleButton() {
    const toggleText = document.querySelector('.toggle-bar-text');
    const toggleIcon = document.querySelector('.toggle-bar-icon');
    if (toggleText) {
        toggleText.textContent = headerState.isHidden ? '메뉴 보이기' : '메뉴 숨기기';
    }
    if (toggleIcon) {
        toggleIcon.style.transform = headerState.isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// 헤더 토글 함수
function toggleHeader() {
    headerState.autoHide = false; // 수동 토글 시 자동 숨김 비활성화
    const header = document.getElementById('mainHeader');
    const container = document.querySelector('.container');
    const toggleText = document.querySelector('.toggle-bar-text');
    const toggleIcon = document.querySelector('.toggle-bar-icon');
    headerState.isHidden = !headerState.isHidden;
    if (headerState.isHidden) {
        // 헤더 숨기기 (토글바는 상단에 고정)
        header.style.transform = 'translateY(calc(-100% + 40px))';
        container.classList.add('header-hidden');
        if (window.innerWidth <= 768) {
            container.style.marginTop = '40px';
        }
        if (toggleText) toggleText.textContent = '메뉴 보이기';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
    } else {
        // 헤더 보이기
        header.style.transform = 'translateY(0)';
        container.classList.remove('header-hidden');
        if (toggleText) toggleText.textContent = '메뉴 숨기기';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
        if (window.innerWidth <= 768) {
            setTimeout(calculateAndApplyHeaderHeight, 100);
        }
    }
    // 3초 후 자동 숨김 다시 활성화
    setTimeout(() => {
        headerState.autoHide = true;
    }, 3000);
}

// 모바일 체크
function checkMobileToggleBar() {
    if (window.innerWidth > 768) {
        const header = document.getElementById('mainHeader');
        const container = document.querySelector('.container');
        if (header) header.style.transform = 'translateY(0)';
        if (container) container.classList.remove('header-hidden');
        headerState.isHidden = false;
        const toggleText = document.querySelector('.toggle-bar-text');
        const toggleIcon = document.querySelector('.toggle-bar-icon');
        if (toggleText) toggleText.textContent = '메뉴 숨기기';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
    }
}

// 리사이즈 이벤트 처리
window.addEventListener('resize', function() {
    checkMobileToggleBar();
});

// 초기화
// 기존 checkMobileToggleBar 호출에 추가로 자동 숨김 초기화
// DOMContentLoaded 시점에 실행

document.addEventListener('DOMContentLoaded', function() {
    checkMobileToggleBar();
    initAutoHideHeader(); // 자동 숨김 초기화
});

// ESC 키로 헤더 토글
// 기존과 동일

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        if (headerState.isHidden) {
            toggleHeader();
        }
    }
});
