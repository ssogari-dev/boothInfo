// 도움말 관련 함수들
function showHelp() {
    const helpContainer = document.getElementById('helpContainer');
    const boothGrid = document.getElementById('boothGrid');
    
    if (helpContainer.style.display === 'none') {
        helpContainer.style.display = 'block';
        boothGrid.style.display = 'none';
        helpContainer.style.animation = 'fadeInUp 0.5s ease';
    } else {
        hideHelp();
    }
}

function hideHelp() {
    const helpContainer = document.getElementById('helpContainer');
    const boothGrid = document.getElementById('boothGrid');
    
    helpContainer.style.display = 'none';
    boothGrid.style.display = 'grid';
}

function showHelpTab(tabName) {
    // 모든 탭 비활성화
    const tabs = document.querySelectorAll('.help-tab');
    const contents = document.querySelectorAll('.help-tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    // 선택된 탭 활성화
    const selectedTab = document.querySelector(`[onclick="showHelpTab('${tabName}')"]`);
    const selectedContent = document.getElementById(`help${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    
    if (selectedTab && selectedContent) {
        selectedTab.classList.add('active');
        selectedContent.classList.add('active');
    }
}

// ESC 키로 도움말 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const helpContainer = document.getElementById('helpContainer');
        if (helpContainer && helpContainer.style.display !== 'none') {
            hideHelp();
        }
    }
});
