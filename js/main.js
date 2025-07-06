function initializeToggles() {
    if (typeof initializeSidebarToggles === 'function') {
        initializeSidebarToggles();
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    console.log('메인 초기화 시작');
    
    initializeEventSelector();
    initializeToggles();
    updateBookmarkSidebar();
    initializeImageModal();
    
    // 첫 방문 시 튜토리얼 표시
    if (!localStorage.getItem(CONFIG.TUTORIAL_STORAGE_KEY)) {
        showTutorial();
    }
    
    console.log('메인 초기화 완료');
});
