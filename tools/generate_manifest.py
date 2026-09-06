#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_manifest.py
---------------------------------------------------------------
해외여행 사진 폴더를 스캔해서
  1) 사이트가 참조하는 photos/<폴더명>/ 아래로 이미지를 복사하고
  2) assets/data/photo-manifest.json 을 새로 만들어줍니다.

사용법 (저장소 루트에서 실행):
    python tools/generate_manifest.py

기본적으로 아래 경로를 스캔합니다. 다른 위치를 쓰고 싶다면
--source 옵션으로 바꿔주세요.
    D:\\05_클로드코드폴더\\05_여행계획표\\해외여행

지원 확장자: jpg, jpeg, png, heic, webp
---------------------------------------------------------------
"""

import argparse
import json
import shutil
from pathlib import Path

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".heic", ".webp"}
DEFAULT_SOURCE = r"D:\05_클로드코드폴더\05_여행계획표\해외여행"


def scan_and_copy(source_dir: Path, repo_root: Path):
    photos_dir = repo_root / "photos"
    manifest_path = repo_root / "assets" / "data" / "photo-manifest.json"
    manifest = {}

    if not source_dir.exists():
        print(f"[경고] 소스 폴더를 찾을 수 없습니다: {source_dir}")
        manifest_path.write_text("{}", encoding="utf-8")
        return

    for folder in sorted(p for p in source_dir.iterdir() if p.is_dir()):
        images = sorted(
            f.name for f in folder.iterdir()
            if f.is_file() and f.suffix.lower() in IMAGE_EXTS
        )
        if not images:
            continue

        dest_folder = photos_dir / folder.name
        dest_folder.mkdir(parents=True, exist_ok=True)
        for img_name in images:
            src = folder / img_name
            dst = dest_folder / img_name
            # 변경되지 않았으면 다시 복사하지 않음 (repo 용량/시간 절약)
            if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
                shutil.copy2(src, dst)

        manifest[folder.name] = images
        print(f"  - {folder.name}: 사진 {len(images)}장")

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"\n완료! {manifest_path} 에 {len(manifest)}개 폴더 정보를 기록했습니다.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="여행 사진 매니페스트 생성기")
    parser.add_argument("--source", default=DEFAULT_SOURCE, help="원본 해외여행 폴더 경로")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    scan_and_copy(Path(args.source), repo_root)
