// 이미지 지연 로딩 클래스 (통합 버전)
class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.sliderObserver = null;
        this.init();
    }

    init() {
        // 기본 이미지 관찰자
        this.imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // 하이브리드 슬라이더 관찰자 (모든 환경에서 동일)
        this.sliderObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.preloadSliderImages(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px', // 더 일찍 감지
            threshold: 0.1
        });
    }

    // 단일 이미지 로드
    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.classList.add('loading');
            
            const newImg = new Image();
            newImg.onload = () => {
                img.src = src;
                img.classList.remove('loading');
                img.classList.add('loaded');
                img.removeAttribute('data-src');
            };
            newImg.onerror = () => {
                img.classList.remove('loading');
                img.classList.add('error');
                img.src = this.getPlaceholderImage();
            };
            newImg.src = src;
        }
    }

    // 하이브리드 선제적 로딩 (두 번째 이미지만)
    preloadSliderImages(container) {
        const images = container.querySelectorAll('img[data-src]');
        
        // CONFIG에서 설정된 개수만큼 미리 로드
        const preloadCount = CONFIG.LOADING_STRATEGY.PRELOAD_ON_VIEWPORT;
        
        for (let i = 0; i < Math.min(preloadCount, images.length); i++) {
            console.log(`선제적 로딩: ${i + 2}번째 이미지 미리 로드`);
            this.loadImage(images[i]);
        }
    }

    // 온디맨드 로딩
    loadSliderImageOnDemand(boothNumber, imageIndex) {
        const sanitizedBoothNumber = sanitizeBoothNumber(boothNumber);
        const slider = document.getElementById(`slider_${sanitizedBoothNumber}`);
        
        if (!slider) return;
        
        const images = slider.querySelectorAll('img');
        const targetImage = images[imageIndex];
        
        if (targetImage && targetImage.dataset.src) {
            console.log(`온디맨드 로딩: ${boothNumber} - 이미지 ${imageIndex + 1}`);
            this.loadImage(targetImage);
        }
    }

    // 통합된 인접 이미지 로딩 (모든 환경에서 동일)
    preloadAdjacentImages(boothNumber, currentIndex, totalImages) {
        // CONFIG 설정 확인
        if (!CONFIG.LOADING_STRATEGY.PRELOAD_ADJACENT) {
            console.log('인접 이미지 로딩이 비활성화됨');
            return;
        }

        const adjacentIndexes = [];
        
        // 이전 이미지
        if (currentIndex > 0) {
            adjacentIndexes.push(currentIndex - 1);
        }
        
        // 다음 이미지
        if (currentIndex < totalImages - 1) {
            adjacentIndexes.push(currentIndex + 1);
        }
        
        adjacentIndexes.forEach(index => {
            setTimeout(() => {
                this.loadSliderImageOnDemand(boothNumber, index);
            }, CONFIG.LOADING_STRATEGY.ADJACENT_DELAY);
        });
    }

    // 기본 이미지 관찰
    observe(img) {
        this.imageObserver.observe(img);
    }

    // 슬라이더 관찰 시작
    observeSlider(container) {
        this.sliderObserver.observe(container);
    }

    // 플레이스홀더 이미지들
    getPlaceholderImage() {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3E이미지 로드 실패%3C/text%3E%3C/svg%3E";
    }

    getLoadingPlaceholder() {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect width='100%25' height='100%25' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280'%3E로딩 중...%3C/text%3E%3C/svg%3E";
    }
}

// 전역 인스턴스 생성
const lazyLoader = new LazyImageLoader();
