// 전역 변수 및 설정
const CONFIG = {
    ZOOM_MIN: 0.5,
    ZOOM_MAX: 5,
    ZOOM_STEP: 0.2,
    TUTORIAL_STORAGE_KEY: 'tutorialShown',
    BOOKMARK_STORAGE_KEY: 'bookmarks',
    LOADING_STRATEGY: {
        PRELOAD_ON_VIEWPORT: 1, // 두 번째 이미지만
        PRELOAD_ADJACENT: true,
        // 인접 이미지 로드 지연 시간 (ms)
        ADJACENT_DELAY: 200,
    }
};

// 전역 상태 변수
let boothData = [];
let selectedGenres = [];
let groupImages = true;
let bookmarkImages = true;
let bookmarks = JSON.parse(localStorage.getItem(CONFIG.BOOKMARK_STORAGE_KEY) || '[]');
let currentSlides = {};

// 이미지 모달 관련 변수
let currentModalImages = [];
let currentModalIndex = 0;
let currentZoom = 1;
let isDragging = false;
let dragStart = { 
    x: 0, 
    y: 0, 
    imageX: 0,  // 드래그 시작 시점의 이미지 X 위치
    imageY: 0   // 드래그 시작 시점의 이미지 Y 위치
};
let imagePosition = { x: 0, y: 0 };

// 튜토리얼 관련 변수
let currentTutorialStep = 0;
let totalTutorialSteps = 0;
