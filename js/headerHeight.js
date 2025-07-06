// 헤더 높이 동적 계산 및 적용
function calculateAndApplyHeaderHeight() {
    const header = document.getElementById('mainHeader');
    const container = document.querySelector('.container');
    
    if (!header || !container) return;
    
    // 헤더의 실제 높이 측정
    const headerHeight = header.offsetHeight;
    
    // 안전 여백 추가 (장르가 늘어날 것을 고려해서 ㅇㅇ)
    const safetyMargin = 20;
    const totalMargin = headerHeight + safetyMargin - 30;
    
    // PC에서만 동적 마진 적용
    if (window.innerWidth > 768) {
        container.style.marginTop = totalMargin + 'px';
        console.log(`헤더 높이: ${headerHeight}px, 적용된 마진: ${totalMargin}px`);
    } else {
        // 모바일/태블릿에서는 기존 CSS 규칙 사용하기 (모바일에서는 헤더 높이 고정)
        container.style.marginTop = '';
    }
}

// 헤더 높이 변화 감지 (ResizeObserver 사용)
function initializeHeaderHeightObserver() {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    
    // ResizeObserver로 헤더 크기 변화 감지
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            // 헤더 크기가 변경될 때마다 마진 재계산
            setTimeout(calculateAndApplyHeaderHeight, 100);
        });
        
        resizeObserver.observe(header);
    }
    
    // 장르 선택기 변화 감지
    const genreSelector = document.getElementById('genreSelector');
    if (genreSelector) {
        const genreObserver = new MutationObserver(() => {
            setTimeout(calculateAndApplyHeaderHeight, 100);
        });
        
        genreObserver.observe(genreSelector, {
            childList: true,
            subtree: true
        });
    }
}

// 윈도우 리사이즈 시 재계산
function handleWindowResize() {
    setTimeout(calculateAndApplyHeaderHeight, 100);
}

// 초기화
function initializeHeaderHeight() {
    // 초기 계산
    setTimeout(calculateAndApplyHeaderHeight, 100);
    
    // 헤더 높이 변화 감지 시작
    initializeHeaderHeightObserver();
    
    // 윈도우 리사이즈 이벤트 리스너
    window.addEventListener('resize', handleWindowResize);
    
    // 폰트 로드 완료 후 재계산
    if (document.fonts) {
        document.fonts.ready.then(() => {
            setTimeout(calculateAndApplyHeaderHeight, 200);
        });
    }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', initializeHeaderHeight);

// 이미지 로드 완료 후 재계산 (혹시 헤더에 이미지가 있을 경우)
window.addEventListener('load', () => {
    setTimeout(calculateAndApplyHeaderHeight, 300);
});
