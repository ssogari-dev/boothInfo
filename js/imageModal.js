// 이미지 모달 이벤트 리스너 설정
function initializeImageModal() {
    const imageViewer = document.getElementById('imageViewer');
    
    // 마우스 드래그 이벤트
    imageViewer.addEventListener('mousedown', startDrag);
    imageViewer.addEventListener('mousemove', drag);
    imageViewer.addEventListener('mouseup', endDrag);
    imageViewer.addEventListener('mouseleave', endDrag);
    
    // 터치 드래그 이벤트
    imageViewer.addEventListener('touchstart', startDrag, { passive: false });
    imageViewer.addEventListener('touchmove', drag, { passive: false });
    imageViewer.addEventListener('touchend', endDrag);
    
    // 휠 줌 이벤트
    imageViewer.addEventListener('wheel', handleWheel, { passive: false });
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
    
    // 제목에 부스명 포함 여부 결정
    const titleText = booth.boothName ? 
        `${boothNumber} - ${booth.boothName}` : 
        boothNumber;
    
    modalTitle.innerHTML = `
        ${titleText}
        <span class="image-modal-subtitle">이미지 ${imageIndex + 1}/${booth.images.length}</span>
    `;
    
    modalImage.src = booth.images[imageIndex];
    
    modalSliderControls.innerHTML = '';
    // 여러 이미지가 있는 경우 슬라이더 컨트롤 표시
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
    modal.style.display = 'flex';
}

// 이미지 모달 닫기
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// 모달 슬라이드 이동
function changeModalSlide(direction) {
    currentModalIndex += direction;
    
    // 인덱스 범위 조정
    if (currentModalIndex < 0) {
        currentModalIndex = currentModalImages.length - 1;
    } else if (currentModalIndex >= currentModalImages.length) {
        currentModalIndex = 0;
    }
    
    updateModalSlide();
}

// 특정 슬라이드로 이동
function goToModalSlide(index) {
    currentModalIndex = index;
    updateModalSlide();
}

// 모달 슬라이드 화면 업데이트
function updateModalSlide() {
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('imageModalTitle');
    const dots = document.querySelectorAll('#modalSliderControls .slider-dot');
    
    modalImage.src = currentModalImages[currentModalIndex];
    
    // 이미지 번호 업데이트
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

// 이미지 줌 변경
function zoomImage(delta) {
    currentZoom = Math.max(CONFIG.ZOOM_MIN, Math.min(CONFIG.ZOOM_MAX, currentZoom + delta));
    updateZoomDisplay();
    updateImageTransform();
}

// 줌 초기화
function resetZoom() {
    currentZoom = 1;
    imagePosition = { x: 0, y: 0 };
    updateZoomDisplay();
    updateImageTransform();
}

// 줌 레벨 표시 업데이트
function updateZoomDisplay() {
    document.getElementById('zoomLevel').textContent = Math.round(currentZoom * 100) + '%';
}

// 이미지 변형 적용
function updateImageTransform() {
    const modalImage = document.getElementById('modalImage');
    modalImage.style.transform = `scale(${currentZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`;
}

// 이미지 위치 제한
function constrainImagePosition() {
    // 기본 줌 상태에서만 중앙 정렬
    if (currentZoom <= 1) {
        imagePosition.x = 0;
        imagePosition.y = 0;
    }
}

// 휠로 줌 처리
function handleWheel(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const delta = e.deltaY > 0 ? -CONFIG.ZOOM_STEP : CONFIG.ZOOM_STEP;
    zoomImage(delta);
}

// 드래그 시작
function startDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    dragStart.x = clientX - imagePosition.x;
    dragStart.y = clientY - imagePosition.y;
}

// 드래그 중
function drag(e) {
    if (!isDragging) return;

    e.preventDefault();
    e.stopPropagation();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    // 손가락 움직임만큼 이미지 이동
    imagePosition.x = clientX - dragStart.x;
    imagePosition.y = clientY - dragStart.y;

    updateImageTransform();
}

// 드래그 종료
function endDrag() {
    isDragging = false;
}
