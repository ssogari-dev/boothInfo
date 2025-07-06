// 사이드바 상태 관리
let sidebarState = {
    isOpen: false,
    isAnimating: false,
    sections: {
        settings: window.innerWidth > 768, // 데스크톱에서는 기본 펼침
        bookmark: window.innerWidth > 768
    }
};

// 섹션 토글 함수
function toggleSection(sectionName) {
    const content = document.getElementById(`${sectionName}Content`);
    const arrow = document.getElementById(`${sectionName}Arrow`);
    
    sidebarState.sections[sectionName] = !sidebarState.sections[sectionName];
    
    if (sidebarState.sections[sectionName]) {
        content.classList.add('expanded');
        content.classList.remove('collapsed');
        arrow.classList.add('expanded');
        arrow.classList.remove('collapsed');
    } else {
        content.classList.remove('expanded');
        content.classList.add('collapsed');
        arrow.classList.remove('expanded');
        arrow.classList.add('collapsed');
    }
}

// 사이드바 초기 상태 설정
function initializeSidebarSections() {
    Object.keys(sidebarState.sections).forEach(sectionName => {
        const content = document.getElementById(`${sectionName}Content`);
        const arrow = document.getElementById(`${sectionName}Arrow`);
        
        if (sidebarState.sections[sectionName]) {
            content.classList.add('expanded');
            arrow.classList.add('expanded');
        } else {
            content.classList.add('collapsed');
            arrow.classList.add('collapsed');
        }
    });
}

// 사이드바 토글 함수 
function toggleSidebar() {
    if (sidebarState.isAnimating) return;
    
    const sidebar = document.getElementById('mainSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const floatingBtn = document.querySelector('.floating-btn');
    
    sidebarState.isAnimating = true;
    sidebarState.isOpen = !sidebarState.isOpen;
    
    if (sidebarState.isOpen) {
        // 사이드바 열기
        sidebar.classList.remove('closing');
        sidebar.classList.add('active');
        overlay.classList.add('active');
        floatingBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        initializeSidebarSections();
        
        // 북마크 사이드바 업데이트
        setTimeout(() => {
            updateBookmarkSidebar();
        }, 200);
        
        // 애니메이션 완료 후
        setTimeout(() => {
            sidebarState.isAnimating = false;
        }, 500);
        
    } else {
        // 사이드바 닫기
        sidebar.classList.add('closing');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        floatingBtn.classList.remove('active');
        document.body.style.overflow = '';
        
        // 애니메이션 완료 후
        setTimeout(() => {
            sidebar.classList.remove('closing');
            sidebarState.isAnimating = false;
        }, 300);
    }
}

// 북마크 사이드바 업데이트
function updateBookmarkSidebar() {
    const bookmarkList = document.getElementById('bookmarkList');
    const bookmarkCount = document.getElementById('bookmarkCount');
    
    // 북마크 개수 업데이트 (애니메이션 포함)
    bookmarkCount.textContent = bookmarks.length;
    if (bookmarks.length > 0) {
        bookmarkCount.classList.add('show');
    } else {
        bookmarkCount.classList.remove('show');
    }
    
    // 북마크 리스트 업데이트
    bookmarkList.innerHTML = '';
    
    if (bookmarks.length === 0) {
        return; // CSS의 ::after로 빈 메시지 표시
    }
    
    bookmarks.forEach((boothNumber, index) => {
        const booth = boothData.find(b => b.boothNumber === boothNumber);
        if (!booth) return;
        
        const bookmarkItem = document.createElement('div');
        bookmarkItem.className = 'bookmark-list-item';
        // 개별 애니메이션 지연 제거 - css에서 처리
        
        // 부스명이 있는 경우에만 표시
        const boothNameElement = booth.boothName ? 
            `<div class="bookmark-booth-name">${booth.boothName}</div>` : '';
        
        bookmarkItem.innerHTML = `
            <div class="bookmark-item-header">
                <div class="bookmark-booth-info">
                    <div class="bookmark-booth-number">${booth.boothNumber}</div>
                    ${boothNameElement}
                </div>
                <button class="bookmark-remove-btn" onclick="removeBookmarkFromSidebar('${booth.boothNumber}')" title="북마크 제거">×</button>
            </div>
            ${bookmarkImages ? `<img src="${booth.images[0]}" alt="${booth.boothNumber} 이미지" class="bookmark-item-image" onclick="openImageModal('${booth.boothNumber}', 0)">` : ''}
            <div class="bookmark-item-actions">
                <a href="${booth.promoUrl}" target="_blank" class="bookmark-action-btn bookmark-promo-btn">홍보 보기</a>
                ${booth.orderUrl ? `<a href="${booth.orderUrl}" target="_blank" class="bookmark-action-btn bookmark-order-btn">선입금 주문</a>` : ''}
            </div>
        `;
        
        bookmarkList.appendChild(bookmarkItem);
    });
}


// 사이드바에서 북마크 제거 
function removeBookmarkFromSidebar(boothNumber) {
    const bookmarkItem = event.target.closest('.bookmark-list-item');
    
    // 제거 애니메이션
    bookmarkItem.style.transform = 'translateX(100%)';
    bookmarkItem.style.opacity = '0';
    
    setTimeout(() => {
        removeBookmark(boothNumber);
        updateBookmarkSidebar();
    }, 300);
}

// ESC 키로 사이드바 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebarState.isOpen) {
        toggleSidebar();
    }
});

function initializeSidebarToggles() {
    const groupImagesToggle = document.getElementById('groupImagesToggle');
    const bookmarkImagesToggle = document.getElementById('bookmarkImagesToggle');
    
    if (groupImagesToggle) {
        groupImagesToggle.onclick = () => {
            groupImages = !groupImages;
            groupImagesToggle.classList.toggle('active', groupImages);
            renderBooths();
            
            // 토글 애니메이션 효과
            groupImagesToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                groupImagesToggle.style.transform = 'scale(1)';
            }, 150);
        };
    }
    
    if (bookmarkImagesToggle) {
        bookmarkImagesToggle.onclick = () => {
            bookmarkImages = !bookmarkImages;
            bookmarkImagesToggle.classList.toggle('active', bookmarkImages);
            updateBookmarkSidebar();
            
            // 토글 애니메이션 효과
            bookmarkImagesToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                bookmarkImagesToggle.style.transform = 'scale(1)';
            }, 150);
        };
    }
}

// 사이드바 외부 클릭 감지
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('mainSidebar');
    const floatingBtn = document.querySelector('.floating-btn');
    
    if (sidebarState.isOpen && 
        !sidebar.contains(e.target) && 
        !floatingBtn.contains(e.target)) {
        toggleSidebar();
    }
});

// resize 이벤트 처리
window.addEventListener('resize', function() {
    if (sidebarState.isOpen && window.innerWidth <= 768) {
        // 모바일에서는 전체 화면으로 조정
        const sidebar = document.getElementById('mainSidebar');
        sidebar.style.width = '100%';
    }
});
