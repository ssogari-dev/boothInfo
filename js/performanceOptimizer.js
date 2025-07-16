class PerformanceOptimizer {
    constructor() {
        this.animatingElements = new Set();
        this.rafCallbacks = new Map();
        this.init();
    }

    init() {
        // 애니메이션 최적화 설정
        this.setupAnimationOptimization();
        this.setupRAFManager();
        this.setupWillChangeManager();
    }

    setupAnimationOptimization() {
        // CSS 애니메이션 대신 requestAnimationFrame 사용
        this.optimizeTransitions();
        this.optimizeHoverEffects();
    }

    optimizeTransitions() {
        // 슬라이더 전환 최적화
        const sliders = document.querySelectorAll('.image-slider');
        sliders.forEach(slider => {
            const originalTransition = slider.style.transition;
            
            slider.addEventListener('transitionstart', () => {
                slider.style.willChange = 'transform';
                this.animatingElements.add(slider);
            });
            
            slider.addEventListener('transitionend', () => {
                slider.style.willChange = 'auto';
                this.animatingElements.delete(slider);
            });
        });
    }

    optimizeHoverEffects() {
        // 부스 카드 호버 효과 최적화
        const boothCards = document.querySelectorAll('.booth-card');
        boothCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateElement(card, () => {
                    card.style.transform = 'translate3d(0, -2px, 0)';
                    card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.12)';
                });
            });

            card.addEventListener('mouseleave', () => {
                this.animateElement(card, () => {
                    card.style.transform = 'translate3d(0, 0, 0)';
                    card.style.boxShadow = '';
                });
            });
        });
    }

    setupRAFManager() {
        // requestAnimationFrame 최적화 관리
        this.rafQueue = [];
        this.isRafRunning = false;
    }

    animateElement(element, callback) {
        // 효율적인 애니메이션 실행
        if (!this.isRafRunning) {
            this.isRafRunning = true;
            requestAnimationFrame(() => {
                callback();
                this.isRafRunning = false;
            });
        } else {
            this.rafQueue.push({ element, callback });
        }
    }

    setupWillChangeManager() {
        // will-change 속성 자동 관리
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            this.optimizeNewElement(node);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    optimizeNewElement(element) {
        // 새로 추가된 요소의 애니메이션 최적화
        if (element.classList.contains('booth-card')) {
            this.setupBoothCardOptimization(element);
        }
        
        if (element.classList.contains('image-slider')) {
            this.setupSliderOptimization(element);
        }
    }

    setupBoothCardOptimization(card) {
        // 부스 카드별 최적화 설정
        card.style.transform = 'translate3d(0, 0, 0)';
        card.style.backfaceVisibility = 'hidden';
        
        card.addEventListener('animationstart', () => {
            card.style.willChange = 'transform, box-shadow';
        });
        
        card.addEventListener('animationend', () => {
            card.style.willChange = 'auto';
        });
    }

    setupSliderOptimization(slider) {
        // 슬라이더별 최적화 설정
        slider.style.transform = 'translate3d(0, 0, 0)';
        slider.style.backfaceVisibility = 'hidden';
        
        const images = slider.querySelectorAll('img');
        images.forEach(img => {
            img.style.transform = 'translate3d(0, 0, 0)';
            img.style.backfaceVisibility = 'hidden';
        });
    }

    optimizeScrolling() {
        // 스크롤 애니메이션 최적화
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleOptimizedScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleOptimizedScroll() {
        // 스크롤 기반 애니메이션 최적화
        const scrollY = window.pageYOffset;
        
        // 뷰포트 내 요소만 애니메이션 적용
        const elements = document.querySelectorAll('.booth-card');
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isInViewport) {
                element.style.willChange = 'transform';
            } else {
                element.style.willChange = 'auto';
            }
        });
    }

    // 메모리 정리
    cleanup() {
        this.animatingElements.clear();
        this.rafCallbacks.clear();
    }
}
