// 헤더 관리 관련 변수
let headerState = {
    isHidden: false
};

// 헤더 토글 함수
function toggleHeader() {
    const header = document.getElementById('mainHeader');
    const container = document.querySelector('.container');
    const toggleText = document.querySelector('.toggle-bar-text');
    const toggleIcon = document.querySelector('.toggle-bar-icon');
    
    headerState.isHidden = !headerState.isHidden;
    
    if (headerState.isHidden) {
        // 헤더 숨기기 (토글바는 상단에 고정)
        header.style.transform = 'translateY(calc(-100% + 40px))'; // 토글바만 보이게
        container.classList.add('header-hidden');
        if (toggleText) toggleText.textContent = '메뉴 보이기';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(180deg)';
    } else {
        // 헤더 보이기
        header.style.transform = 'translateY(0)';
        container.classList.remove('header-hidden');
        if (toggleText) toggleText.textContent = '메뉴 숨기기';
        if (toggleIcon) toggleIcon.style.transform = 'rotate(0deg)';
    }
}

// 모바일 체크
function checkMobileToggleBar() {
    if (window.innerWidth > 768) {
        // 데스크톱에서는 헤더 항상 표시
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
document.addEventListener('DOMContentLoaded', function() {
    checkMobileToggleBar();
});

// ESC 키로 헤더 토글
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        if (headerState.isHidden) {
            toggleHeader();
        }
    }
});
