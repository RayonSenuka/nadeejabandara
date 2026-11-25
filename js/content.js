const grid = document.getElementById('g');
const filters = document.getElementById('f');
let items = [];
const reelUrl = id =>
  `assets/Latest%20Content/Reel%20-%20${String(id).padStart(3, '0')}.mp4`;
const reelSoundToggle = `
  <button class="reel-sound-toggle" type="button" aria-label="Turn sound on" aria-pressed="false">
    <svg class="sound-off" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h3l4 3V7l-4 3H4z" fill="currentColor"></path>
      <path d="m15 10 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    </svg>
    <svg class="sound-on" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h3l4 3V7l-4 3H4z" fill="currentColor"></path>
      <path d="M15 9a5 5 0 0 1 0 6m2.5-8.5a9 9 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
    </svg>
  </button>
  <p class="reel-error-message" role="alert" hidden>Sorry, this video could not be loaded.</p>`;
const featuredReel = document.getElementById('home')
  ? `<article class="card reel-card featured-reel" aria-label="Featured Reel">
      <div class="reel-frame">
        <video class="reel-video" muted playsinline loop preload="metadata" aria-label="Featured Reel video">
          <source src="${reelUrl(1)}" type="video/mp4">
          Your browser does not support video playback.
        </video>
        ${reelSoundToggle}
      </div>
      <div class="b reel-caption">
        <h3>Iphone 18 Pro Max</h3>
        <p class="reel-author">@nadeejabandara</p>
      </div>
    </article>`

  : '';

let reelObserver;

function initializeReels() {
  const videos = grid.querySelectorAll('.reel-video');
  if (!videos.length) return;

  const updateSoundToggle = video => {
    const soundToggle = video.parentElement.querySelector('.reel-sound-toggle');
    const soundOn = !video.muted;
    soundToggle.setAttribute('aria-pressed', String(soundOn));
    soundToggle.setAttribute('aria-label', soundOn ? 'Mute video' : 'Turn sound on');
  };

  const playVideo = video => {
    const playRequest = video.play();
    if (playRequest) {
      playRequest.catch(error => {
        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
          console.error('Unable to play a Reel video.', error);
        }
      });
    }
  };

  videos.forEach(video => {
    const soundToggle = video.parentElement.querySelector('.reel-sound-toggle');
    const errorMessage = video.parentElement.querySelector('.reel-error-message');

    soundToggle.addEventListener('click', () => {
      video.muted = !video.muted;
      updateSoundToggle(video);
      if (video.paused) playVideo(video);
    });

    video.addEventListener('error', () => {
      errorMessage.hidden = false;
      console.error('Unable to load a Reel video.', video.error);
    });
  });

  if ('IntersectionObserver' in window) {
    reelObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          playVideo(video);
        } else {
          video.pause();
          video.muted = true;
          updateSoundToggle(video);
        }
      });
    }, { threshold: 0.35 });
    videos.forEach(video => reelObserver.observe(video));
  } else {
    videos.forEach(playVideo);
  }
}

function render(cat) {
  if (reelObserver) {
    reelObserver.disconnect();
    reelObserver = null;
  }
  const featuredReelCount = cat === 'all' && featuredReel ? 1 : 0;
  const visibleItems = items
    .filter(i => cat === 'all' || i.category === cat)
    .slice(featuredReelCount, 6);
  grid.innerHTML = `${cat === 'all' ? featuredReel : ''}${visibleItems
    .map(i => `
      <article class="card reel-card">
        <div class="reel-frame">
          <video class="reel-video content-reel-video" muted playsinline loop preload="metadata" aria-label="Reel: ${i.title}">
            <source src="${reelUrl(i.id)}" type="video/mp4">
            Your browser does not support video playback.
          </video>
          ${reelSoundToggle}
        </div>
        <div class="b reel-caption">
          <h3>${i.title}</h3>
          <p class="reel-author">@nadeejabandara</p>
        </div>
      </article>`).join('')}`;
  initializeReels();
}

fetch('data/content.json')
  .then(r => r.json())
  .then(data => { items = data; render('all'); });

filters?.addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  filters.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  render(b.dataset.c);
});
