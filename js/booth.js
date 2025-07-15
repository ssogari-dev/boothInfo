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
    // 장르별 빈도수 계산
    const genreCount = {};
    boothData.forEach(booth => {
        booth.genres.forEach(genre => {
            genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
    });

    // 장르를 [장르명, 개수] 형태로 변환하고 정렬
    const sortedGenres = Object.entries(genreCount)
        .sort((a, b) => {
            // 1차 정렬: 개수 내림차순
            if (a[1] !== b[1]) {
                return b[1] - a[1];
            }
            // 2차 정렬: 가나다순 (한글 정렬)
            return a[0].localeCompare(b[0], 'ko');
        });

    // 장르를 주요 장르와 기타 장르로 분리 (개수 임계값 적용)
    const mainGenres = sortedGenres.filter(([genre, count]) => count > CONFIG.GENRE_COUNT_THRESHOLD);
    const minorGenres = sortedGenres.filter(([genre, count]) => count <= CONFIG.GENRE_COUNT_THRESHOLD);

    const genreSelector = document.getElementById('genreSelector');
    genreSelector.innerHTML = '';

    // 주요 장르 표시
    mainGenres.forEach(([genre, count]) => {
        const genreTag = createGenreTag(genre, count);
        genreSelector.appendChild(genreTag);
    });

    // 더 보기 버튼 생성 (기타 장르가 있는 경우에만)
    if (minorGenres.length > 0) {
        const showMoreBtn = createShowMoreButton(minorGenres);
        genreSelector.appendChild(showMoreBtn);
    }

    // 장르 태그 로드 후 헤더 높이 재계산
    if (typeof calculateAndApplyHeaderHeight === 'function') {
        setTimeout(calculateAndApplyHeaderHeight, 150);
    }
}

// 장르 태그 생성 함수
function createGenreTag(genre, count) {
    const genreTag = document.createElement('div');
    genreTag.className = 'genre-tag';
    genreTag.setAttribute('data-genre', genre); // 장르명을 데이터 속성으로 저장
    genreTag.innerHTML = `
        ${genre} 
        <span class="genre-count">(${count})</span>
    `;
    genreTag.onclick = () => toggleGenre(genre);
    return genreTag;
}

// 더 보기 버튼 생성 함수
function createShowMoreButton(minorGenres) {
    const showMoreBtn = document.createElement('div');
    showMoreBtn.className = 'genre-show-more';
    showMoreBtn.innerHTML = '더 보기 (+)';
    showMoreBtn.onclick = () => toggleShowMore(minorGenres, showMoreBtn);
    return showMoreBtn;
}

// 더 보기 토글 함수
function toggleShowMore(minorGenres, button) {
    const genreSelector = document.getElementById('genreSelector');
    const isExpanded = button.classList.contains('expanded');
    
    if (isExpanded) {
        // 기타 장르들 숨기기
        const minorTags = genreSelector.querySelectorAll('.genre-tag.minor');
        minorTags.forEach(tag => tag.remove());
        
        button.innerHTML = '더 보기 (+)';
        button.classList.remove('expanded');
    } else {
        // 기타 장르들 표시하기
        minorGenres.forEach(([genre, count]) => {
            const genreTag = createGenreTag(genre, count);
            genreTag.classList.add('minor');
            genreSelector.insertBefore(genreTag, button);
        });
        
        button.innerHTML = '접기 (-)';
        button.classList.add('expanded');
    }
    
    // 헤더 높이 재계산
    if (typeof calculateAndApplyHeaderHeight === 'function') {
        setTimeout(calculateAndApplyHeaderHeight, 150);
    }
}

// 장르 필터 토글
function toggleGenre(genre) {
    // data-genre 속성으로 정확하게 찾기
    const genreTag = document.querySelector(`.genre-tag[data-genre="${genre}"]`);
    
    if (!genreTag) {
        console.error(`장르 태그를 찾을 수 없습니다: ${genre}`);
        return;
    }
    
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

// 부스 카드 생성 (통합 지연 로딩 적용)
function createBoothCard(booth) {
    const card = document.createElement('div');
    card.className = 'booth-card';
    
    const isBookmarked = bookmarks.includes(booth.boothNumber);
    const orderButton = booth.orderUrl ? 
        `<a href="${booth.orderUrl}" target="_blank" class="action-btn order-btn">선입금/통판</a>` : '';
    
    const boothNameElement = booth.boothName ? 
        `<div class="booth-name">${booth.boothName}</div>` : '';

    // 이미지 컨테이너 생성 (하이브리드 지연 로딩 적용)
    const imageContainer = createHybridImageContainer(booth);

    card.innerHTML = `
        <div class="booth-header">
            <div class="booth-info">
                <div class="booth-number">${booth.boothNumber}</div>
                ${boothNameElement}
                <div class="booth-genres">
                    ${booth.genres.map(genre => `<span class="booth-genre">${genre}</span>`).join('')}
                </div>
            </div>
            <button class="bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" 
                    onclick="toggleBookmark('${booth.boothNumber}')">
                ${isBookmarked ? '★' : '☆'}
            </button>
        </div>
        ${imageContainer}
        <div class="booth-actions">
            <a href="${booth.promoUrl}" target="_blank" class="action-btn promo-btn">홍보 보기</a>
            ${orderButton}
        </div>
    `;

    return card;
}

// 부스 번호를 CSS 선택자에 안전한 형태로 변환
function sanitizeBoothNumber(boothNumber) {
    return boothNumber
        .replace(/,/g, '_COMMA_')
        .replace(/\./g, '_DOT_')
        .replace(/:/g, '_COLON_')
        .replace(/;/g, '_SEMICOLON_')
        .replace(/\s+/g, '_SPACE_')
        .replace(/[^\w-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

// CSS 선택자에서 원래 부스 번호로 복원
function desanitizeBoothNumber(sanitizedNumber) {
    return sanitizedNumber
        .replace(/_COMMA_/g, ',')
        .replace(/_/g, ' ')
        .trim();
}

// 하이브리드 지연 로딩이 적용된 이미지 컨테이너 생성
function createHybridImageContainer(booth) {
    if (!booth.images || booth.images.length === 0) {
        return '<div class="image-container"><div class="no-image">이미지 없음</div></div>';
    }

    const sanitizedBoothNumber = sanitizeBoothNumber(booth.boothNumber);
    const imageContainerId = `imageContainer_${sanitizedBoothNumber}`;
    
    if (booth.images.length === 1) {
        // 단일 이미지 - 즉시 로드
        return `
            <div class="image-container" id="${imageContainerId}">
                <img src="${booth.images[0]}" 
                     alt="부스 이미지" 
                     onclick="openImageModal('${booth.boothNumber}', 0)"
                     class="single-image">
            </div>
        `;
    }

    if (groupImages) {
        // 슬라이더 모드 - 하이브리드 로딩
        return createHybridSliderContainer(booth, imageContainerId, sanitizedBoothNumber);
    } else {
        // 스택 모드 - 하이브리드 로딩
        return createHybridStackContainer(booth, imageContainerId, sanitizedBoothNumber);
    }
}

// 하이브리드 슬라이더 컨테이너
function createHybridSliderContainer(booth, containerId, sanitizedBoothNumber) {
    const sliderId = `slider_${sanitizedBoothNumber}`;
    
    const imageElements = booth.images.map((imageUrl, index) => {
        if (index === 0) {
            // 첫 번째 이미지는 즉시 로드
            return `
                <img src="${imageUrl}" 
                     alt="부스 이미지 ${index + 1}" 
                     onclick="openImageModal('${booth.boothNumber}', ${index})"
                     class="slider-image loaded">
            `;
        } else {
            // 나머지 이미지는 지연 로딩
            return `
                <img data-src="${imageUrl}" 
                     src="${lazyLoader.getLoadingPlaceholder()}"
                     alt="부스 이미지 ${index + 1}" 
                     onclick="openImageModal('${booth.boothNumber}', ${index})"
                     class="slider-image lazy-image"
                     data-booth="${booth.boothNumber}"
                     data-index="${index}">
            `;
        }
    }).join('');

    const sliderControls = booth.images.length > 1 ? `
        <div class="slider-controls">
            ${booth.images.map((_, index) => 
                `<div class="slider-dot ${index === 0 ? 'active' : ''}" 
                     onclick="goToSlide('${booth.boothNumber}', ${index})"></div>`
            ).join('')}
        </div>
        <button class="slider-arrow prev" onclick="changeSlide('${booth.boothNumber}', -1)">‹</button>
        <button class="slider-arrow next" onclick="changeSlide('${booth.boothNumber}', 1)">›</button>
    ` : '';

    // 하이브리드 로딩: 뷰포트 진입 시 선제적 로딩
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (container) {
            lazyLoader.observeSlider(container);
        }
    }, 100);

    return `
        <div class="image-container" id="${containerId}">
            <div class="image-slider" id="${sliderId}">
                ${imageElements}
            </div>
            ${sliderControls}
        </div>
    `;
}

// 하이브리드 스택 컨테이너
function createHybridStackContainer(booth, containerId, sanitizedBoothNumber) {
    const imageElements = booth.images.map((imageUrl, index) => {
        if (index === 0) {
            return `
                <img src="${imageUrl}" 
                     alt="부스 이미지 ${index + 1}" 
                     onclick="openImageModal('${booth.boothNumber}', ${index})"
                     class="stacked-image loaded">
            `;
        } else {
            return `
                <img data-src="${imageUrl}" 
                     src="${lazyLoader.getLoadingPlaceholder()}"
                     alt="부스 이미지 ${index + 1}" 
                     onclick="openImageModal('${booth.boothNumber}', ${index})"
                     class="stacked-image lazy-image">
            `;
        }
    }).join('');

    // 하이브리드 스택 모드 이미지 관찰 시작
    setTimeout(() => {
        const container = document.getElementById(containerId);
        if (container) {
            // 스택 모드는 일반 이미지 관찰자 사용
            const images = container.querySelectorAll('img[data-src]');
            images.forEach(img => lazyLoader.observe(img));
        }
    }, 100);

    return `
        <div class="image-container" id="${containerId}">
            <div class="image-stacked">
                ${imageElements}
            </div>
        </div>
    `;
}

// 슬라이드 변경 (통합 온디맨드 로딩 적용)
function changeSlide(boothNumber, direction) {
    const sanitizedBoothNumber = sanitizeBoothNumber(boothNumber);
    const slider = document.getElementById(`slider_${sanitizedBoothNumber}`);
    const images = slider.querySelectorAll('img');
    const dots = document.querySelectorAll(`#imageContainer_${sanitizedBoothNumber} .slider-dot`);
    
    let currentIndex = currentSlides[boothNumber] || 0;
    currentIndex += direction;
    
    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    } else if (currentIndex >= images.length) {
        currentIndex = 0;
    }
    
    currentSlides[boothNumber] = currentIndex;
    
    // 현재 슬라이드 이미지 즉시 로드
    lazyLoader.loadSliderImageOnDemand(boothNumber, currentIndex);
    
    // 인접 이미지 미리 로드 (모든 환경에서 동일)
    lazyLoader.preloadAdjacentImages(boothNumber, currentIndex, images.length);
    
    // 슬라이더 위치 업데이트
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // 점 표시 업데이트
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
    
    console.log(`슬라이드 변경: ${boothNumber} - ${currentIndex + 1}/${images.length}`);
}

// 특정 슬라이드로 이동 (통합 온디맨드 로딩 적용)
function goToSlide(boothNumber, index) {
    const sanitizedBoothNumber = sanitizeBoothNumber(boothNumber);
    const slider = document.getElementById(`slider_${sanitizedBoothNumber}`);
    const images = slider.querySelectorAll('img');
    const dots = document.querySelectorAll(`#imageContainer_${sanitizedBoothNumber} .slider-dot`);
    
    currentSlides[boothNumber] = index;
    
    // 클릭한 슬라이드 이미지 즉시 로드
    lazyLoader.loadSliderImageOnDemand(boothNumber, index);
    
    // 인접 이미지 미리 로드 (모든 환경에서 동일)
    lazyLoader.preloadAdjacentImages(boothNumber, index, images.length);
    
    // 슬라이더 위치 업데이트
    slider.style.transform = `translateX(-${index * 100}%)`;
    
    // 점 표시 업데이트
    dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === index);
    });
    
    console.log(`슬라이드 직접 이동: ${boothNumber} - ${index + 1}/${images.length}`);
}
