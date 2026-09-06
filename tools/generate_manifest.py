#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_manifest.py
---------------------------------------------------------------
해외여행 사진 폴더를 스캔해서
  1) 이미지를 리사이즈/압축한 뒤 photos/<폴더명>/ 아래로 저장하고
     (동영상 파일은 자동으로 제외합니다)
  2) assets/data/photo-manifest.json 을 새로 만들어줍니다.

사용법 (저장소 루트에서 실행):
    python tools/generate_manifest.py

기본적으로 아래 경로를 스캔합니다. 다른 위치를 쓰고 싶다면
--source 옵션으로 바꿔주세요.
    D:\\05_클로드코드폴더\\05_여행계획표\\해외여행

옵션:
    --max-dim   긴 변 최대 픽셀 (기본 1600)
    --quality   JPEG 저장 품질 (기본 80)
---------------------------------------------------------------
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageOps

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff"}
HEIC_EXTS = {".heic", ".heif"}
VIDEO_EXTS = {".mp4", ".mov", ".avi", ".mkv", ".m4v", ".wmv", ".3gp", ".webm"}
DEFAULT_SOURCE = r"D:\05_클로드코드폴더\05_여행계획표\해외여행"

HEIC_OK = False
try:
    import pillow_heif
    pillow_heif.register_heif_opener()
    HEIC_OK = True
except ImportError:
    pass


def optimize_one(src: Path, dst: Path, max_dim: int, quality: int) -> bool:
    """src 이미지를 리사이즈/압축해서 dst(jpg)로 저장. 성공하면 True."""
    try:
        with Image.open(src) as im:
            im = ImageOps.exif_transpose(im)  # 스마트폰 회전 정보 반영
            if im.mode in ("RGBA", "P"):
                im = im.convert("RGB")
            elif im.mode != "RGB":
                im = im.convert("RGB")
            w, h = im.size
            scale = min(1.0, max_dim / max(w, h))
            if scale < 1.0:
                im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)
            dst.parent.mkdir(parents=True, exist_ok=True)
            im.save(dst, "JPEG", quality=quality, optimize=True)
        return True
    except Exception as e:
        print(f"    [실패] {src.name}: {e}")
        return False


def scan_and_optimize(source_dir: Path, repo_root: Path, max_dim: int, quality: int):
    photos_dir = repo_root / "photos"
    manifest_path = repo_root / "assets" / "data" / "photo-manifest.json"
    manifest = {}

    if not source_dir.exists():
        print(f"[경고] 소스 폴더를 찾을 수 없습니다: {source_dir}")
        manifest_path.write_text("{}", encoding="utf-8")
        return

    total_src_mb = 0.0
    total_dst_mb = 0.0
    skipped_heic = 0
    skipped_video = 0

    for folder in sorted(p for p in source_dir.iterdir() if p.is_dir()):
        out_names = []
        files = sorted(f for f in folder.iterdir() if f.is_file())
        n_vid = sum(1 for f in files if f.suffix.lower() in VIDEO_EXTS)
        if n_vid:
            skipped_video += n_vid

        for f in files:
            ext = f.suffix.lower()
            if ext in VIDEO_EXTS:
                continue  # 동영상은 완전히 제외
            if ext in HEIC_EXTS and not HEIC_OK:
                skipped_heic += 1
                continue
            if ext not in IMAGE_EXTS and ext not in HEIC_EXTS:
                continue

            out_name = f.stem + ".jpg"
            dst = photos_dir / folder.name / out_name
            src_mb = f.stat().st_size / 1024 / 1024
            need_convert = (
                not dst.exists()
                or dst.stat().st_mtime < f.stat().st_mtime
            )
            if need_convert:
                ok = optimize_one(f, dst, max_dim, quality)
                if not ok:
                    continue
            total_src_mb += src_mb
            total_dst_mb += dst.stat().st_size / 1024 / 1024
            out_names.append(out_name)

        if out_names:
            manifest[folder.name] = out_names
            print(f"  - {folder.name}: {len(out_names)}장 처리 완료"
                  + (f" (동영상 {n_vid}개 제외)" if n_vid else ""))

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\n완료! {manifest_path}")
    print(f"원본 총 용량: {total_src_mb:.1f} MB → 최적화 후: {total_dst_mb:.1f} MB "
          f"({(1 - total_dst_mb / total_src_mb) * 100:.0f}% 절감)" if total_src_mb else "")
    if skipped_video:
        print(f"동영상 {skipped_video}개는 사진이 아니라서 자동으로 제외했습니다.")
    if skipped_heic:
        print(f"[안내] HEIC {skipped_heic}개는 pillow-heif 가 없어 건너뛰었습니다. "
              f"'pip install pillow-heif' 설치 후 다시 실행하면 처리됩니다.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="여행 사진 최적화 + 매니페스트 생성기")
    parser.add_argument("--source", default=DEFAULT_SOURCE, help="원본 해외여행 폴더 경로")
    parser.add_argument("--max-dim", type=int, default=1600, help="긴 변 최대 픽셀")
    parser.add_argument("--quality", type=int, default=80, help="JPEG 저장 품질(1~95)")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    scan_and_optimize(Path(args.source), repo_root, args.max_dim, args.quality)
