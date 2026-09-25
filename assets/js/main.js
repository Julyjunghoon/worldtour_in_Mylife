/* main.js — 인트로 스크롤, 3D 지구본, 갤러리 모달 로직 */

document.addEventListener('DOMContentLoaded', async () => {
  // ---------- 인트로: 스크롤 유도 ----------
  const scrollCue = document.getElementById('scroll-cue');
  if (scrollCue) {
    scrollCue.addEventListener('click', () => {
      document.getElementById('globe-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ---------- 사진 매니페스트 병합 ----------
  // tools/generate_manifest.py 가 해외여행 폴더를 스캔해서 만들어주는
  // assets/data/photo-manifest.json 을 읽어와 trip.photos 를 채웁니다.
  // (file:// 로 직접 열면 fetch가 막히므로, 로컬 서버나 GitHub Pages에서 확인하세요)
  try {
    const res = await fetch('assets/data/photo-manifest.json', { cache: 'no-store' });
    if (res.ok) {
      const manifest = await res.json();
      (window.TRIPS || []).forEach(trip => {
        if (manifest[trip.folder]) trip.photos = manifest[trip.folder];
      });
    }
  } catch (e) {
    console.warn('photo-manifest.json 을 불러오지 못했습니다 (로컬 file:// 환경일 수 있음):', e);
  }

  // ---------- 여행 데이터를 "위치" 단위로 그룹핑 ----------
  // 같은 좌표(예: 대마도, 마카오)에 여러 번 다녀온 경우 지구본 위에서는
  // 하나의 점으로 합쳐서 보여주고, 클릭하면 목록에서 고르게 함.
  const LOCATIONS = [];
  const keyOf = (lat, lng) => `${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const byKey = {};

  (window.TRIPS || []).forEach(trip => {
    const [lat, lng] = trip.coords;
    const k = keyOf(lat, lng);
    if (!byKey[k]) {
      byKey[k] = { lat, lng, trips: [] };
      LOCATIONS.push(byKey[k]);
    }
    byKey[k].trips.push(trip);
  });

  LOCATIONS.forEach(loc => {
    const hasPlanned = loc.trips.some(t => t.status === 'planned');
    loc.color = hasPlanned ? '#3a8fc4' : '#e0b23a';
    loc.label = loc.trips.map(t => t.title).join(' / ');
  });

  // ---------- 3D 지구본 ----------
  const globeEl = document.getElementById('globe-viz');
  let world = null;
  if (globeEl && window.Globe) {
    world = window.Globe()(globeEl)
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor('#7fb8e0')
      .atmosphereAltitude(0.18)
      .pointsData(LOCATIONS)
      .pointLat('lat')
      .pointLng('lng')
      .pointColor('color')
      .pointAltitude(0.02)
      .pointRadius(0.55)
      .pointLabel(loc => `<div style="font-family:inherit;font-size:12px;padding:2px 4px;">${loc.label}</div>`)
      .onPointClick(loc => openLocationModal(loc));

    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.5;
    world.pointOfView({ lat: 20, lng: 110, altitude: 2.1 }, 0);

    // 리사이즈 대응
    window.addEventListener('resize', () => {
      world.width(globeEl.clientWidth);
      world.height(globeEl.clientHeight);
    });
  }

  // ---------- 지구본 아래 카드 목록 (지구본이 안 뜨는 환경/모바일 대체) ----------
  const grid = document.getElementById('trip-grid');
  if (grid) {
    const sorted = [...(window.TRIPS || [])].sort((a, b) => (a.period < b.period ? 1 : -1));
    sorted.forEach(trip => {
      const card = document.createElement('div');
      card.className = `trip-card ${trip.status}`;
      card.innerHTML = `
        <span class="tag">${trip.status === 'planned' ? '여행 예정' : '다녀옴'}</span>
        <h3>${trip.title}</h3>
        <div class="period">${trip.country} · ${trip.period}</div>
      `;
      card.addEventListener('click', () => openTripModal(trip));
      grid.appendChild(card);
    });
  }

  // ---------- 모달 ----------
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById('modal');

  function closeModal() {
    backdrop.classList.remove('open');
    modal.innerHTML = '';
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  function openLocationModal(loc) {
    if (loc.trips.length === 1) {
      openTripModal(loc.trips[0]);
      return;
    }
    // 여러 번 다녀온 장소면 목록 먼저 보여줌
    modal.innerHTML = `
      <button class="close-btn" aria-label="닫기">&times;</button>
      <h2>${loc.trips[0].country}</h2>
      <div class="period">이 곳으로 ${loc.trips.length}번 다녀왔어요</div>
      <div style="margin-top:16px; display:flex; flex-direction:column; gap:8px;">
        ${loc.trips.map((t, i) => `
          <button data-i="${i}" style="text-align:left; padding:12px 14px; border:1px solid var(--border); border-radius:12px; background:var(--paper); cursor:pointer; font-family:inherit;">
            <b>${t.title}</b><br><span style="font-size:12px;color:var(--ink-soft)">${t.period}</span>
          </button>
        `).join('')}
      </div>
    `;
    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.querySelectorAll('button[data-i]').forEach(btn => {
      btn.addEventListener('click', () => openTripModal(loc.trips[Number(btn.dataset.i)]));
    });
    backdrop.classList.add('open');
  }

  function photoUrl(trip, p) {
    return `photos/${trip.folder}/${p}`;
  }

  function openTripModal(trip) {
    const photosHtml = (trip.photos && trip.photos.length)
      ? `<div class="photo-grid">${trip.photos.map((p, i) => `<img src="${photoUrl(trip, p)}" alt="${trip.title}" loading="lazy" data-idx="${i}">`).join('')}</div>`
      : `<div class="placeholder-note">아직 이 여행의 사진이 등록되지 않았어요. <br>
           <code>해외여행/${trip.folder}</code> 폴더에 사진을 넣고
           <code>tools/generate_manifest.py</code> 를 실행하면 자동으로 채워집니다.</div>`;

    const planLink = trip.planPage
      ? `<a class="plan-link" href="${trip.planPage}">📋 여행 계획표 보러가기</a>`
      : '';

    modal.innerHTML = `
      <button class="close-btn" aria-label="닫기">&times;</button>
      <span class="tag ${trip.status}">${trip.status === 'planned' ? '여행 예정' : '다녀옴'}</span>
      <h2>${trip.title}</h2>
      <div class="period">${trip.country} · ${trip.period}${trip.note ? ' · ' + trip.note : ''}</div>
      ${photosHtml}
      ${planLink}
    `;
    modal.querySelector('.close-btn').addEventListener('click', closeModal);
    modal.querySelectorAll('.photo-grid img').forEach(img => {
      img.addEventListener('click', () => openLightbox(trip, Number(img.dataset.idx)));
    });
    backdrop.classList.add('open');
  }

  // ---------- 사진 라이트박스 (확대 보기) ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCount = document.getElementById('lightbox-count');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const lightboxClose = document.getElementById('lightbox-close');
  let lbTrip = null;
  let lbIndex = 0;

  function renderLightbox() {
    if (!lbTrip) return;
    lightboxImg.src = photoUrl(lbTrip, lbTrip.photos[lbIndex]);
    lightboxImg.alt = `${lbTrip.title} ${lbIndex + 1}`;
    lightboxCount.textContent = `${lbIndex + 1} / ${lbTrip.photos.length}`;
    const multi = lbTrip.photos.length > 1;
    lightboxPrev.style.display = multi ? 'flex' : 'none';
    lightboxNext.style.display = multi ? 'flex' : 'none';
  }

  function openLightbox(trip, index) {
    if (!trip.photos || !trip.photos.length) return;
    lbTrip = trip;
    lbIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lbTrip = null;
  }

  function showPrev() {
    if (!lbTrip) return;
    lbIndex = (lbIndex - 1 + lbTrip.photos.length) % lbTrip.photos.length;
    renderLightbox();
  }

  function showNext() {
    if (!lbTrip) return;
    lbIndex = (lbIndex + 1) % lbTrip.photos.length;
    renderLightbox();
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // esc / 방향키
  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
      return;
    }
    if (e.key === 'Escape') closeModal();
  });
});
