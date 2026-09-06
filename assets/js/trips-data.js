/**
 * trips-data.js
 * -----------------------------------------------------------------------
 * 여행 데이터 원본 파일입니다. 새로운 여행을 추가하려면 이 배열에
 * 객체 하나를 더 추가하면 됩니다 (좌표는 대략적인 값이라 필요하면
 * 자유롭게 수정하세요).
 *
 * folder 값은 D:\05_클로드코드폴더\05_여행계획표\해외여행\ 아래의
 * 실제 폴더명과 반드시 일치해야, tools/generate_manifest.py 가 사진을
 * 자동으로 찾아 photos 배열을 채울 수 있습니다.
 *
 * status: 'visited'(다녀온 여행) | 'planned'(여행 예정)
 * -----------------------------------------------------------------------
 */

const TRIPS = [
  {
    id: 't1',
    title: '후쿠오카 · 유후인',
    period: '2016.04.03 ~ 04.05',
    country: '일본',
    coords: [33.5904, 130.4017],
    status: 'visited',
    note: '민주와 함께',
    folder: '20160403~0405_일본_후쿠오카, 유후인_민주',
    photos: []
  },
  {
    id: 't2',
    title: '태국여행',
    period: '2016.08.28 ~ 09.03',
    country: '태국',
    coords: [13.7563, 100.5018],
    status: 'visited',
    folder: '20160828~0903_태국여행',
    photos: []
  },
  {
    id: 't3',
    title: '대마도',
    period: '2017.05.04',
    country: '일본',
    coords: [34.2064, 129.2916],
    status: 'visited',
    folder: '20170504_일본 대마도',
    photos: []
  },
  {
    id: 't4',
    title: '대부도 (민주 생일여행)',
    period: '2017.07.07 ~ 07.08',
    country: '대한민국',
    coords: [37.2361, 126.5997],
    status: 'visited',
    folder: '20170707~0708_대부도_민주생일여행with민',
    photos: []
  },
  {
    id: 't5',
    title: '코타키나발루',
    period: '2017.08.22 ~ 08.28',
    country: '말레이시아',
    coords: [5.9804, 116.0735],
    status: 'visited',
    folder: '20170822~0828_코타키나발루',
    photos: []
  },
  {
    id: 't6',
    title: '대마도',
    period: '2017.12.29 ~ 12.31',
    country: '일본',
    coords: [34.2064, 129.2916],
    status: 'visited',
    folder: '20171229~1231_대마도',
    photos: []
  },
  {
    id: 't7',
    title: '마카오 (민혜네와 함께)',
    period: '2018.04.05 ~ 04.08',
    country: '마카오',
    coords: [22.1987, 113.5439],
    status: 'visited',
    folder: '20180405~0408_마카오_with 민혜네',
    photos: []
  },
  {
    id: 't8',
    title: '대만',
    period: '2018.12.28 ~ 2019.01.01',
    country: '대만',
    coords: [25.033, 121.565],
    status: 'visited',
    folder: '20181228~0101_대만',
    photos: []
  },
  {
    id: 't9',
    title: '몽골',
    period: '2019.06.05 ~ 06.09',
    country: '몽골',
    coords: [47.8864, 106.9057],
    status: 'visited',
    folder: '20190605~0609_몽골',
    photos: []
  },
  {
    id: 't10',
    title: '필리핀 팔라완',
    period: '2019.07.26 ~ 07.29',
    country: '필리핀',
    coords: [9.7392, 118.7353],
    status: 'visited',
    folder: '20190726~0729_필리핀 팔라완',
    photos: []
  },
  {
    id: 't11',
    title: '대마도 여행',
    period: '2020.01.26',
    country: '일본',
    coords: [34.2064, 129.2916],
    status: 'visited',
    folder: '20200126_일본_대마도여행',
    photos: []
  },
  {
    id: 't12',
    title: '베트남 푸꾸옥 (시율이 돌잔치)',
    period: '2024.08.24',
    country: '베트남',
    coords: [10.2202, 103.9663],
    status: 'visited',
    folder: '20240824_베트남_푸꾸옥_시율이돌잔치',
    photos: []
  },
  {
    id: 't13',
    title: '스페인 & 포르투갈',
    period: '2024.11.21 ~ 11.30',
    country: '스페인 · 포르투갈',
    coords: [40.4168, -3.7038],
    status: 'visited',
    folder: '20241121~1130_스페인&포르투칼',
    photos: []
  },
  {
    id: 't14',
    title: '세부 가족여행',
    period: '2025.03.20 ~ 03.24',
    country: '필리핀',
    coords: [10.3157, 123.8854],
    status: 'visited',
    folder: '20250320~0324_세부_가족여행',
    photos: []
  },
  {
    id: 't15',
    title: '도쿄 디즈니랜드 (민주 · 선율)',
    period: '2025.11.01',
    country: '일본',
    coords: [35.6329, 139.8804],
    status: 'visited',
    folder: '20251101_이본_민주선율디즈니랜드여행',
    photos: []
  },
  {
    id: 't16',
    title: '베트남 (w. 시아네)',
    period: '2025.11.28 ~ 12.03',
    country: '베트남',
    // 정확한 도시가 불확실해 다낭 좌표로 임시 지정 — 필요하면 수정하세요.
    coords: [16.0544, 108.2022],
    status: 'visited',
    folder: '20251128~1203_베남_w시아네',
    photos: []
  },
  {
    id: 't17',
    title: '중국 광저우',
    period: '2025.12.04',
    country: '중국',
    coords: [23.1291, 113.2644],
    status: 'visited',
    folder: '20251204_중국 광저우',
    photos: []
  },
  {
    id: 'macau2026',
    title: '마카오 가족여행',
    period: '2026.09.18 ~ 09.22',
    country: '마카오',
    coords: [22.1987, 113.5439],
    status: 'planned',
    folder: '2026_마카오여행',
    photos: [],
    planPage: 'macau-plan.html'
  }
];

// 브라우저 전역에서 바로 쓸 수 있도록 window 에 붙여둡니다.
window.TRIPS = TRIPS;
