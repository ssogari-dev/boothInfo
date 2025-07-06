// 튜토리얼 데이터
const TUTORIAL_STEPS = [
    {
        title: "🎪 행사 선택",
        content: "상단의 <strong>행사 선택</strong> 드롭다운에서 원하는 행사를 선택하세요.",
        image: createTutorialSVG("행사선택", "#667eea")
    },
    {
        title: "🏷️ 장르 필터링",
        content: "<strong>장르 태그</strong>를 클릭하여 원하는 장르의 부스만 필터링할 수 있습니다. 여러 장르 선택 가능!",
        image: createGenreFilterSVG()
    },
    {
        title: "⭐ 북마크 기능",
        content: "각 부스 카드의 <strong>별 아이콘</strong>을 클릭하여 북마크에 추가하세요. 나중에 쉽게 찾을 수 있습니다!",
        image: createBookmarkSVG()
    },
    {
        title: "🖼️ 이미지 보기",
        content: "부스에 여러 이미지가 있으면 <strong>좌우 화살표</strong>나 <strong>점 표시</strong>를 클릭하여 넘겨볼 수 있습니다.",
        image: createImageSliderSVG()
    },
    {
        title: "🔍 이미지 확대",
        content: "<strong>이미지를 클릭</strong>하면 확대 모달이 열립니다. 확대/축소 버튼으로 크기를 조절하고, 확대 상태에서도 슬라이드가 가능합니다!",
        image: createImageZoomSVG()
    },
    {
        title: "🔗 링크 버튼",
        content: "<strong>홍보 보기</strong> 버튼으로 트위터/디시 홍보글을, <strong>선입금 주문</strong> 버튼으로 주문 페이지로 이동할 수 있습니다.",
        image: createLinkButtonSVG()
    },
    {
        title: "⚙️ 설정 및 북마크",
        content: "우하단의 <strong>플로팅 버튼</strong>을 클릭하면 설정과 북마크를 관리할 수 있는 사이드바가 열립니다!",
        image: createSidebarSVG()
    }
];

// SVG 생성 함수들
function createTutorialSVG(text, color) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="${color}" rx="10"/>
            <text x="100" y="55" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" font-weight="bold">${text}</text>
        </svg>
    `)}`;
}

function createGenreFilterSVG() {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="#f8f9fa" rx="10"/>
            <rect width="50" height="25" x="15" y="37" fill="#667eea" rx="12"/>
            <rect width="35" height="25" x="75" y="37" fill="#e2e8f0" rx="12"/>
            <rect width="60" height="25" x="120" y="37" fill="#e2e8f0" rx="12"/>
            <text x="40" y="52" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle" font-weight="bold">BL</text>
            <text x="92" y="52" font-family="Arial, sans-serif" font-size="10" fill="#4a5568" text-anchor="middle" font-weight="bold">GL</text>
            <text x="150" y="52" font-family="Arial, sans-serif" font-size="9" fill="#4a5568" text-anchor="middle" font-weight="bold">오리지널</text>
        </svg>
    `)}`;
}

function createBookmarkSVG() {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="#667eea" rx="10"/>
            <text x="170" y="35" font-family="Arial, sans-serif" font-size="20" fill="#ffd700">★</text>
            <text x="20" y="30" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold">A-01</text>
            <text x="20" y="70" font-family="Arial, sans-serif" font-size="10" fill="white">BL, 오리지널</text>
        </svg>
    `)}`;
}

function createImageSliderSVG() {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="#764ba2" rx="10"/>
            <circle cx="30" cy="50" r="15" fill="rgba(0,0,0,0.5)"/>
            <circle cx="170" cy="50" r="15" fill="rgba(0,0,0,0.5)"/>
            <text x="30" y="58" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">‹</text>
            <text x="170" y="58" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">›</text>
            <circle cx="85" cy="80" r="4" fill="white"/>
            <circle cx="100" cy="80" r="4" fill="rgba(255,255,255,0.5)"/>
            <circle cx="115" cy="80" r="4" fill="rgba(255,255,255,0.5)"/>
        </svg>
    `)}`;
}

function createImageZoomSVG() {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="#2d3748" rx="10"/>
            <rect width="140" height="60" x="30" y="20" fill="#667eea" rx="5"/>
            <circle cx="170" cy="85" r="10" fill="#ffd700"/>
            <text x="170" y="90" font-family="Arial, sans-serif" font-size="12" fill="#2d3748" text-anchor="middle" font-weight="bold">+</text>
            <text x="100" y="55" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">이미지</text>
        </svg>
    `)}`;
}

function createLinkButtonSVG() {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="#f8f9fa" rx="10"/>
            <rect width="85" height="30" x="15" y="35" fill="#4299e1" rx="6"/>
            <rect width="85" height="30" x="110" y="35" fill="#48bb78" rx="6"/>
            <text x="57" y="53" font-family="Arial, sans-serif" font-size="9" fill="white" text-anchor="middle" font-weight="bold">홍보보기</text>
            <text x="152" y="53" font-family="Arial, sans-serif" font-size="9" fill="white" text-anchor="middle" font-weight="bold">선입금주문</text>
        </svg>
    `)}`;
}

function createSidebarSVG() {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg width="200" height="100" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="100" fill="#f0f0f0" rx="10"/>
            <rect width="80" height="100" x="120" y="0" fill="white" rx="0 10 10 0"/>
            <circle cx="170" cy="80" r="12" fill="#667eea"/>
            <text x="170" y="85" font-family="Arial, sans-serif" font-size="10" fill="white" text-anchor="middle">⚙️</text>
            <text x="160" y="20" font-family="Arial, sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">설정</text>
            <text x="160" y="40" font-family="Arial, sans-serif" font-size="8" fill="#4a5568" text-anchor="middle">북마크</text>
        </svg>
    `)}`;
}

function createTutorialModal() {
    const modalOverlay = document.getElementById('tutorialModal');
    totalTutorialSteps = TUTORIAL_STEPS.length;
    
    const modalContent = `
        <div class="tutorial-modal-content">
            <div class="modal-header">
                <h2>사이트 사용법</h2>
                <button class="close-btn" onclick="closeTutorial()">&times;</button>
            </div>
            <div class="modal-body">
                ${TUTORIAL_STEPS.map((step, index) => `
                    <div class="tutorial-step ${index === 0 ? 'active' : ''}" data-step="${index}">
                        <h3>${step.title}</h3>
                        <p>${step.content}</p>
                        <img src="${step.image}" alt="${step.title}">
                    </div>
                `).join('')}
            </div>
            
            <!-- 화살표 네비게이션 -->
            <button class="tutorial-nav-arrows prev" id="tutorialPrevBtn" onclick="prevStep()">‹</button>
            <button class="tutorial-nav-arrows next" id="tutorialNextBtn" onclick="nextStep()">›</button>
            
            <div class="tutorial-footer">
                <div class="tutorial-indicators">
                    ${TUTORIAL_STEPS.map((_, index) => `
                        <div class="tutorial-dot ${index === 0 ? 'active' : ''}" onclick="goToTutorialStep(${index})"></div>
                    `).join('')}
                </div>
                <label class="dont-show-again">
                    <input type="checkbox" id="dontShowAgain"> 다시 보지 않기
                </label>
            </div>
        </div>
    `;
    
    modalOverlay.innerHTML = modalContent;
}


// 튜토리얼 단계로 이동
function goToTutorialStep(stepIndex) {
    currentTutorialStep = stepIndex;
    updateTutorialStep();
}

// 튜토리얼 관련 함수들
function showTutorial() {
    createTutorialModal();
    document.getElementById('tutorialModal').style.display = 'flex';
    currentTutorialStep = 0;
    updateTutorialStep();
    
    // body 스크롤 방지
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}


function closeTutorial() {
    const dontShowAgain = document.getElementById('dontShowAgain');
    if (dontShowAgain && dontShowAgain.checked) {
        localStorage.setItem(CONFIG.TUTORIAL_STORAGE_KEY, 'true');
    }
    document.getElementById('tutorialModal').style.display = 'none';
    
    // body 스크롤 복원
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

function nextStep() {
    if (currentTutorialStep < totalTutorialSteps - 1) {
        currentTutorialStep++;
        updateTutorialStep();
    }
}

function prevStep() {
    if (currentTutorialStep > 0) {
        currentTutorialStep--;
        updateTutorialStep();
    }
}

// 튜토리얼 단계 업데이트
function updateTutorialStep() {
    const steps = document.querySelectorAll('.tutorial-step');
    const dots = document.querySelectorAll('.tutorial-dot');
    const prevBtn = document.getElementById('tutorialPrevBtn');
    const nextBtn = document.getElementById('tutorialNextBtn');
    
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentTutorialStep);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTutorialStep);
    });
    
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentTutorialStep === 0;
        nextBtn.disabled = currentTutorialStep === totalTutorialSteps - 1;
        
        prevBtn.style.display = currentTutorialStep === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentTutorialStep === totalTutorialSteps - 1 ? 'none' : 'flex';
    }
}
