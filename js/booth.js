// 행사 선택기 초기화 및 자동 선택
async function initializeEventSelector() {
    const eventSelector = document.getElementById('eventSelector');
    
    const eventFiles = [
        '코믹월드 2025 SUMMER.json'
    ];
    
    eventFiles.forEach(filename => {
        const option = document.createElement('option');
        option.value = filename;
        option.textContent = filename.replace('.json', '').replace(/_/g, ' ').toUpperCase();
        eventSelector.appendChild(option);
    });
    
    eventSelector.addEventListener('change', loadEventData);
    
    // 첫 번째 행사 자동 선택
    if (eventFiles.length > 0) {
        eventSelector.value = eventFiles[0];
        await loadEventData();
    }
}

// 행사 데이터 로드 및 화면 업데이트
async function loadEventData() {
    const eventSelector = document.getElementById('eventSelector');
    const selectedEvent = eventSelector.value;
    
    // 선택된 행사가 없는 경우 처리
    if (!selectedEvent) {
        boothData = [];
        renderBooths();
        return;
    }
    
    const boothGrid = document.getElementById('boothGrid');
    boothGrid.innerHTML = '<div class="loading-message">행사 정보를 불러오는 중...</div>';
    
    try {
        const response = await fetch(`events/${selectedEvent}`);
        // 파일 로드 실패 시 에러 처리
        if (!response.ok) {
            throw new Error('파일을 찾을 수 없습니다.');
        }
        
        const eventData = await response.json();
        
        // 이벤트 데이터 구조 확인 후 설정
        if (eventData.eventName && eventData.booths) {
            boothData = eventData.booths;
            eventSelector.options[eventSelector.selectedIndex].textContent = eventData.eventName;
        } else {
            boothData = eventData;
        }
        
        initializeGenreSelector();
        renderBooths();
        hideHelp();
        
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        // 로드 실패 시 샘플 데이터 사용
        boothData = SAMPLE_DATA;
        initializeGenreSelector();
        renderBooths();
        hideHelp();
    }
}

// 장르 선택기 초기화 및 헤더 높이 재계산
function initializeGenreSelector() {
    const allGenres = [...new Set(boothData.flatMap(booth => booth.genres))];
    const genreSelector = document.getElementById('genreSelector');
    genreSelector.innerHTML = '';
    
    allGenres.forEach(genre => {
        const genreTag = document.createElement('div');
        genreTag.className = 'genre-tag';
        genreTag.textContent = genre;
        genreTag.onclick = () => toggleGenre(genre);
        genreSelector.appendChild(genreTag);
    });
    
    // 장르 태그 로드 후 헤더 높이 재계산
    if (typeof calculateAndApplyHeaderHeight === 'function') {
        setTimeout(calculateAndApplyHeaderHeight, 150);
    }
}

// 장르 필터 토글
function toggleGenre(genre) {
    const genreTag = [...document.querySelectorAll('.genre-tag')].find(tag => tag.textContent === genre);
    
    // 선택된 장르인지 확인하여 추가/제거
    if (selectedGenres.includes(genre)) {
        selectedGenres = selectedGenres.filter(g => g !== genre);
        genreTag.classList.remove('active');
    } else {
        selectedGenres.push(genre);
        genreTag.classList.add('active');
    }
    
    renderBooths();
}

// 부스 목록 렌더링
function renderBooths() {
    const boothGrid = document.getElementById('boothGrid');
    
    boothGrid.innerHTML = '';
    
    // 부스 데이터가 없는 경우 처리
    if (boothData.length === 0) {
        boothGrid.innerHTML = '<div class="loading-message">행사를 선택해주세요.</div>';
        return;
    }
    
    // 선택된 장르에 따라 부스 필터링
    const filteredBooths = selectedGenres.length === 0 
        ? boothData 
        : boothData.filter(booth => booth.genres.some(genre => selectedGenres.includes(genre)));

    // 필터링된 부스가 없는 경우 처리
    if (filteredBooths.length === 0) {
        boothGrid.innerHTML = '<div class="loading-message">선택한 장르에 해당하는 부스가 없습니다.</div>';
        return;
    }

    const fragment = document.createDocumentFragment();
    filteredBooths.forEach(booth => {
        const boothCard = createBoothCard(booth);
        fragment.appendChild(boothCard);
    });
    
    boothGrid.appendChild(fragment);
}

// 부스 카드 생성
function createBoothCard(booth) {
    const card = document.createElement('div');
    card.className = 'booth-card';
    
    const isBookmarked = bookmarks.includes(booth.boothNumber);
    
    // 선입금 링크가 있는 경우에만 버튼 표시
    const orderButton = booth.orderUrl ? 
        `<a href="${booth.orderUrl}" target="_blank" class="action-btn order-btn">선입금 주문</a>` : '';
    
    // 부스명이 있는 경우에만 표시
    const boothNameElement = booth.boothName ? 
        `<div class="booth-name">${booth.boothName}</div>` : '';
    
    card.innerHTML = `
        <div class="booth-header">
            <div class="booth-info">
                <div class="booth-number">${booth.boothNumber}</div>
                ${boothNameElement}
            </div>
            <div class="booth-genres">
                ${booth.genres.map(genre => `<span class="booth-genre">${genre}</span>`).join('')}
            </div>
            <button class="bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark('${booth.boothNumber}')">
                ${isBookmarked ? '★' : '☆'}
            </button>
        </div>
        <div class="image-container">
            ${createImageSection(booth)}
        </div>
        <div class="booth-actions">
            <a href="${booth.promoUrl}" target="_blank" class="action-btn promo-btn">홍보 보기</a>
            ${orderButton}
        </div>
    `;
    
    return card;
}

// 이미지 섹션 생성
function createImageSection(booth) {
    // 이미지 그룹화 설정에 따라 다른 렌더링
    if (!groupImages) {
        return `
            <div class="image-stacked">
                ${booth.images.map((img, index) => `<img src="${img}" alt="${booth.boothNumber} 이미지" onclick="openImageModal('${booth.boothNumber}', ${index})">`).join('')}
            </div>
        `;
    }

    // 이미지가 하나인 경우 슬라이더 없이 표시
    if (booth.images.length === 1) {
        return `<img src="${booth.images[0]}" alt="${booth.boothNumber} 이미지" onclick="openImageModal('${booth.boothNumber}', 0)" style="width: 100%; height: 100%; object-fit: cover;">`;
    }

    return `
        <div class="image-slider" id="slider-${booth.boothNumber}">
            ${booth.images.map((img, index) => `<img src="${img}" alt="${booth.boothNumber} 이미지" onclick="openImageModal('${booth.boothNumber}', ${index})">`).join('')}
        </div>
        <button class="slider-arrow prev" onclick="changeSlide('${booth.boothNumber}', -1)">‹</button>
        <button class="slider-arrow next" onclick="changeSlide('${booth.boothNumber}', 1)">›</button>
        <div class="slider-controls">
            ${booth.images.map((_, index) => `<div class="slider-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide('${booth.boothNumber}', ${index})"></div>`).join('')}
        </div>
    `;
}

// 슬라이더 이미지 변경
function changeSlide(boothNumber, direction) {
    const slider = document.getElementById(`slider-${boothNumber}`);
    const booth = boothData.find(b => b.boothNumber === boothNumber);
    
    if (!currentSlides[boothNumber]) currentSlides[boothNumber] = 0;
    
    currentSlides[boothNumber] += direction;
    
    // 슬라이드 인덱스 범위 조정
    if (currentSlides[boothNumber] < 0) {
        currentSlides[boothNumber] = booth.images.length - 1;
    } else if (currentSlides[boothNumber] >= booth.images.length) {
        currentSlides[boothNumber] = 0;
    }
    
    updateSlider(boothNumber);
}

// 특정 슬라이드로 이동
function goToSlide(boothNumber, index) {
    currentSlides[boothNumber] = index;
    updateSlider(boothNumber);
}

// 슬라이더 화면 업데이트
function updateSlider(boothNumber) {
    const slider = document.getElementById(`slider-${boothNumber}`);
    const dots = slider.parentElement.querySelectorAll('.slider-dot');
    
    slider.style.transform = `translateX(-${currentSlides[boothNumber] * 100}%)`;
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlides[boothNumber]);
    });
}
