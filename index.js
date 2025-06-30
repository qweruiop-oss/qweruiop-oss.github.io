// 添加平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 添加滚动渐入效果
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 150) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);

function toggleEmail(event) {
    event.preventDefault();
    const emailBtn = event.currentTarget;
    emailBtn.classList.toggle('flipped');

    // 5秒后自动翻转回来
    setTimeout(() => {
        emailBtn.classList.remove('flipped');
    }, 5000);
}