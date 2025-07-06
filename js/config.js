// 앱 설정 상수들
const CONFIG = {
    ZOOM_MIN: 0.5,        // 이미지 최소 확대 비율
    ZOOM_MAX: 5,          // 이미지 최대 확대 비율
    ZOOM_STEP: 0.2,       // 이미지 확대/축소 단계
    TUTORIAL_STORAGE_KEY: 'tutorialShown',  // 튜토리얼 표시 여부 저장 키
    BOOKMARK_STORAGE_KEY: 'bookmarks'       // 북마크 목록 저장 키
};

let boothData = [];              // 부스 정보 데이터 배열
let selectedGenres = [];         // 선택된 장르 필터 배열
let groupImages = true;          // 이미지 그룹화 표시 여부
let bookmarkImages = true;       // 북마크 이미지 표시 여부
let bookmarks = JSON.parse(localStorage.getItem(CONFIG.BOOKMARK_STORAGE_KEY) || '[]');  // 북마크된 부스 목록
let currentSlides = {};          // 각 부스별 현재 슬라이드 인덱스

let currentModalImages = [];     // 모달에 표시할 이미지 배열
let currentModalIndex = 0;       // 모달 내 현재 이미지 인덱스
let currentZoom = 1;             // 모달 이미지 현재 확대 비율
let isDragging = false;          // 이미지 드래그 상태
let dragStart = { x: 0, y: 0 };  // 드래그 시작 위치
let imagePosition = { x: 0, y: 0 };  // 이미지 현재 위치

let currentTutorialStep = 0;     // 현재 튜토리얼 단계
let totalTutorialSteps = 0;      // 전체 튜토리얼 단계 수
