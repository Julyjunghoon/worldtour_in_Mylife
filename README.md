# 🌍 World Tour in My Life

우리 가족이 다녀온 여행, 그리고 앞으로 갈 여행을 3D 지구본 위에서 살펴보는
개인 여행 아카이브입니다. GitHub Pages로 정적 호스팅됩니다.

## 구조

```
index.html                 메인 페이지 (인트로 + 3D 지구본)
macau-plan.html             2026 마카오 여행 계획표 (여행 예정 전용 페이지)
assets/
  css/style.css              공통 스타일
  js/trips-data.js            여행 목록 원본 데이터 (직접 수정)
  js/main.js                  지구본 렌더링 · 갤러리 모달 로직
  data/photo-manifest.json    tools/generate_manifest.py 가 자동 생성
photos/<폴더명>/…            여행별 사진 (자동 생성/복사됨, 직접 넣지 않아도 됨)
tools/generate_manifest.py   해외여행 폴더를 스캔해 사진을 복사하고 매니페스트를 만드는 스크립트
```

## 새 여행 추가하는 방법

1. `D:\05_클로드코드폴더\05_여행계획표\해외여행\` 아래에 사진 폴더를 추가합니다.
   (폴더명 예시: `20160403~0405_일본_후쿠오카, 유후인_민주`)
2. `assets/js/trips-data.js` 에 여행 객체를 하나 추가합니다. `folder` 값은
   1번의 폴더명과 정확히 같아야 합니다. `coords` 는 대략적인 위도/경도면
   충분합니다.
3. 저장소 루트에서 아래 명령을 실행하면 사진이 `photos/` 아래로 복사되고
   `assets/data/photo-manifest.json` 이 갱신됩니다.

   ```bash
   python tools/generate_manifest.py
   ```

4. `git add`, `git commit`, `git push` 하면 GitHub Pages에 자동 반영됩니다.

## 마카오 여행 계획표 페이지

`macau-plan.html` 은 여행 전 준비용 페이지입니다. 지구본에서 "마카오
가족여행(2026)" 점을 클릭하면 이 페이지로 연결됩니다. 일자별 일정,
공항→호텔 셔틀버스 안내, 동선 지도가 담겨 있습니다. 여행 후에는
`status: 'visited'` 로 바꾸고 실제 사진을 채워 넣으면 다른 여행들과
동일하게 갤러리로 전환할 수 있습니다.

## 로컬에서 미리보기

`index.html` 을 파일로 직접 열면 사진 매니페스트를 못 불러올 수 있습니다
(브라우저의 `file://` 제한). 아래처럼 로컬 서버로 열어서 확인하세요.

```bash
python -m http.server 8000
# 이후 http://localhost:8000 접속
```

## 사용 라이브러리

- [globe.gl](https://globe.gl) — 3D 인터랙티브 지구본
- [Leaflet](https://leafletjs.com) — 마카오 동선 지도 (OpenStreetMap 타일)
