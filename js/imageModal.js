// 이미지 모달 초기화
function initializeImageModal() {
    const imageViewer = document.getElementById('imageViewer');
    
    // 드래그 이벤트 리스너
    imageViewer.addEventListener('mousedown', startDrag);
    imageViewer.addEventListener('mousemove', drag);
    imageViewer.addEventListener('mouseup', endDrag);
    imageViewer.addEventListener('mouseleave', endDrag);
    
    // 터치 이벤트 리스너 (모바일)
    imageViewer.addEventListener('touchstart', startDrag, { passive: false });
    imageViewer.addEventListener('touchmove', drag, { passive: false });
    imageViewer.addEventListener('touchend', endDrag);
    
    // 휠 이벤트로 줌
    imageViewer.addEventListener('wheel', handleWheel, { passive: false });
    
    // 이미지 기본 드래그 방지
    imageViewer.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // 터치 제스처 이벤트 리스너 추가
    imageViewer.addEventListener('touchstart', handleTouchStart, { passive: false });
    imageViewer.addEventListener('touchmove', handleTouchMove, { passive: false });
    imageViewer.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// 이미지 모달 열기
function openImageModal(boothNumber, imageIndex) {
    const booth = boothData.find(b => b.boothNumber === boothNumber);
    if (!booth) return;
    
    currentModalImages = booth.images;
    currentModalIndex = imageIndex;
    currentZoom = 1;
    imagePosition = { x: 0, y: 0 };
    
    const modal = document.getElementById('imageModal');
    const modalTitle = document.getElementById('imageModalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalSliderControls = document.getElementById('modalSliderControls');
    const modalPrevBtn = document.getElementById('modalPrevBtn');
    const modalNextBtn = document.getElementById('modalNextBtn');
    const modalContent = modal.querySelector('.image-modal-content');
    
    // 제목에 부스명 포함
    const titleText = booth.boothName ? 
        `${boothNumber} - ${booth.boothName}` : 
        boothNumber;
    
    modalTitle.innerHTML = `
        ${titleText}
        <span class="image-modal-subtitle">이미지 ${imageIndex + 1}/${booth.images.length}</span>
    `;
    
    modalImage.src = booth.images[imageIndex];
    
    // 슬라이더 컨트롤 생성
    modalSliderControls.innerHTML = '';
    if (booth.images.length > 1) {
        booth.images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === imageIndex ? 'active' : ''}`;
            dot.onclick = () => goToModalSlide(index);
            modalSliderControls.appendChild(dot);
        });
        modalPrevBtn.style.display = 'block';
        modalNextBtn.style.display = 'block';
    } else {
        modalPrevBtn.style.display = 'none';
        modalNextBtn.style.display = 'none';
    }
    
    updateZoomDisplay();
    updateImageTransform();
    
    // 애니메이션 최적화 설정
    modal.style.willChange = 'opacity';
    modalContent.style.willChange = 'transform';
    // 3D 변환으로 GPU 가속
    modalContent.style.transform = 'translate3d(0, 20px, 0) scale(0.95)';
    modal.style.display = 'flex';
    modal.classList.add('active');
    // 애니메이션 실행
    requestAnimationFrame(() => {
        modalContent.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });
    // 애니메이션 완료 후 will-change 제거
    setTimeout(() => {
        modal.style.willChange = 'auto';
        modalContent.style.willChange = 'auto';
    }, 300);
}

// 이미지 모달 닫기
function closeImageModal() {
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('.image-modal-content');
    // 애니메이션 최적화 설정
    modal.style.willChange = 'opacity';
    modalContent.style.willChange = 'transform';
    // 닫기 애니메이션
    modalContent.style.transform = 'translate3d(0, 20px, 0) scale(0.95)';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('active');
        modal.style.willChange = 'auto';
        modalContent.style.willChange = 'auto';
    }, 300);
}

// 모달 슬라이드 변경
function changeModalSlide(direction) {
    currentModalIndex += direction;
    
    if (currentModalIndex < 0) {
        currentModalIndex = currentModalImages.length - 1;
    } else if (currentModalIndex >= currentModalImages.length) {
        currentModalIndex = 0;
    }
    
    updateModalSlide();
}

function goToModalSlide(index) {
    currentModalIndex = index;
    updateModalSlide();
}

// 모달 슬라이드 업데이트
function updateModalSlide() {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalTitle');
    const dots = document.querySelectorAll('#modalSliderControls .slider-dot');

    // 모달에서는 즉시 로드 (사용자가 이미 보려고 클릭한 상태)
    modalImage.src = currentModalImages[currentModalIndex];

    // 제목에서 이미지 번호만 업데이트
    const subtitle = modalTitle.querySelector('.image-modal-subtitle');
    if (subtitle) {
        subtitle.textContent = `이미지 ${currentModalIndex + 1}/${currentModalImages.length}`;
    }

    // 줌과 위치 초기화
    currentZoom = 1;
    imagePosition = { x: 0, y: 0 };
    updateZoomDisplay();
    updateImageTransform();

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentModalIndex);
    });
}

// 줌 기능
function zoomImage(delta) {
    currentZoom = Math.max(CONFIG.ZOOM_MIN, Math.min(CONFIG.ZOOM_MAX, currentZoom + delta));
    updateZoomDisplay();
    updateImageTransform();
}

function resetZoom() {
    currentZoom = 1;
    imagePosition = { x: 0, y: 0 };
    updateZoomDisplay();
    updateImageTransform();
}

function updateZoomDisplay() {
    document.getElementById('zoomLevel').textContent = Math.round(currentZoom * 100) + '%';
}

function updateImageTransform() {
    const modalImage = document.getElementById('modalImage');
    modalImage.style.transform = `translate(${imagePosition.x}px, ${imagePosition.y}px) scale(${currentZoom})`;
}

// 휠로 줌
function handleWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY > 0 ? -CONFIG.ZOOM_STEP : CONFIG.ZOOM_STEP;
    zoomImage(delta);
}

// 드래그 시작 (완전히 새로운 방식)
function startDrag(e) {
    // 이미지 기본 드래그 방지
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    
    // 현재 마우스/터치 위치
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    // 드래그 시작점 = 현재 마우스 위치
    dragStart.x = clientX;
    dragStart.y = clientY;
    
    // 드래그 시작 시점의 이미지 위치 저장
    dragStart.imageX = imagePosition.x;
    dragStart.imageY = imagePosition.y;
    
    console.log('드래그 시작:', {
        마우스: { x: clientX, y: clientY },
        이미지위치: { x: imagePosition.x, y: imagePosition.y }
    });
}

// 드래그 (지도와 동일한 방식)
function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    // 현재 마우스/터치 위치
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    // 마우스 이동 거리 계산
    const moveX = clientX - dragStart.x;
    const moveY = clientY - dragStart.y;

    // 이미지 새 위치 = 시작 위치 + 마우스 이동 거리
    imagePosition.x = dragStart.imageX + moveX;
    imagePosition.y = dragStart.imageY + moveY;

    // 즉시 적용
    updateImageTransform();
    
    console.log('드래그 중:', {
        마우스이동: { x: moveX, y: moveY },
        새위치: { x: imagePosition.x, y: imagePosition.y }
    });
}

function endDrag() {
    if (isDragging) {
        console.log('드래그 종료');
    }
    isDragging = false;
}

// 터치 스와이프 및 핀치 줌 상태
let touchState = {
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    minSwipeDistance: 50
};

let pinchState = {
    initialDistance: 0,
    initialZoom: 1
};

function handleTouchStart(e) {
    if (e.touches.length === 2) {
        // 핀치 줌 시작
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        pinchState.initialDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        pinchState.initialZoom = currentZoom;
    } else if (e.touches.length === 1) {
        // 단일 터치 (스와이프)
        const touch = e.touches[0];
        touchState.startX = touch.clientX;
        touchState.startY = touch.clientY;
        touchState.isSwiping = false;
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 2) {
        // 핀치 줌
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        const scale = currentDistance / pinchState.initialDistance;
        const newZoom = Math.max(CONFIG.ZOOM_MIN, 
            Math.min(CONFIG.ZOOM_MAX, pinchState.initialZoom * scale));
        currentZoom = newZoom;
        updateZoomDisplay();
        updateImageTransform();
        e.preventDefault();
    } else if (e.touches.length === 1 && currentZoom === 1) {
        // 단일 터치 스와이프
        const touch = e.touches[0];
        touchState.currentX = touch.clientX;
        touchState.currentY = touch.clientY;
        const deltaX = touchState.currentX - touchState.startX;
        const deltaY = touchState.currentY - touchState.startY;
        // 수평 스와이프 감지
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
            touchState.isSwiping = true;
            e.preventDefault();
        }
    }
}

function handleTouchEnd(e) {
    if (touchState.isSwiping && currentZoom === 1) {
        const deltaX = touchState.currentX - touchState.startX;
        if (Math.abs(deltaX) > touchState.minSwipeDistance) {
            if (deltaX > 0) {
                // 오른쪽 스와이프 - 이전 이미지
                changeModalSlide(-1);
            } else {
                // 왼쪽 스와이프 - 다음 이미지
                changeModalSlide(1);
            }
        }
    }
    touchState.isSwiping = false;
}
