function toggleBookmark(boothNumber) {
    const index = bookmarks.indexOf(boothNumber);
    const bookmarkIcon = document.querySelector(`[onclick="toggleBookmark('${boothNumber}')"]`);
    
    if (index === -1) {
        bookmarks.push(boothNumber);
        // 북마크 추가
        if (bookmarkIcon) {
            bookmarkIcon.classList.add('bookmarked');
            bookmarkIcon.textContent = '★';
        }
    } else {
        bookmarks.splice(index, 1);
        // 북마크 제거
        if (bookmarkIcon) {
            bookmarkIcon.classList.remove('bookmarked');
            bookmarkIcon.textContent = '☆';
        }
    }
    
    localStorage.setItem(CONFIG.BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
    updateBookmarkCount();
    
    // 사이드바가 열려있으면 업데이트
    if (sidebarState && sidebarState.isOpen) {
        updateBookmarkSidebar();
    }
}

// 북마크 개수만 업데이트하는 함수
function updateBookmarkCount() {
    const bookmarkCount = document.getElementById('bookmarkCount');
    if (bookmarkCount) {
        bookmarkCount.textContent = bookmarks.length;
        if (bookmarks.length > 0) {
            bookmarkCount.classList.add('show');
        } else {
            bookmarkCount.classList.remove('show');
        }
    }
}

// 북마크 제거
function removeBookmark(boothNumber) {
    const index = bookmarks.indexOf(boothNumber);
    if (index !== -1) {
        bookmarks.splice(index, 1);
        localStorage.setItem(CONFIG.BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
        
        // 해당 부스의 북마크 아이콘만 업데이트
        const bookmarkIcon = document.querySelector(`[onclick="toggleBookmark('${boothNumber}')"]`);
        if (bookmarkIcon) {
            bookmarkIcon.classList.remove('bookmarked');
            bookmarkIcon.textContent = '☆';
        }
        
        updateBookmarkCount();
        
        // 사이드바가 열려있으면 업데이트
        if (sidebarState && sidebarState.isOpen) {
            updateBookmarkSidebar();
        }
    }
}

// 모든 북마크 삭제
function clearAllBookmarks() {
    if (bookmarks.length === 0) {
        return;
    }
    
    if (confirm('모든 북마크를 삭제하시겠습니까?')) {
        // 모든 북마크 아이콘 업데이트하기 (북마크 해제)
        bookmarks.forEach(boothNumber => {
            const bookmarkIcon = document.querySelector(`[onclick="toggleBookmark('${boothNumber}')"]`);
            if (bookmarkIcon) {
                bookmarkIcon.classList.remove('bookmarked');
                bookmarkIcon.textContent = '☆';
            }
        });
        
        bookmarks = [];
        localStorage.setItem(CONFIG.BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarks));
        updateBookmarkCount();
        updateBookmarkSidebar();
    }
}
