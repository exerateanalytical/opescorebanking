#!/usr/bin/env python3
"""Recover the byte-identical, SHA-256-verified original checkpoint AN ZIP."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import hashlib

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "regulatory/recovery/source/AN"
ARCHIVES = ROOT / "regulatory/recovery/archives"
TARGET = ARCHIVES / "OPES_Core_Banking_Checkpoint_AN_2026-10-09.zip"
PREVIOUS = ARCHIVES / "OPES_Core_Banking_Checkpoint_AM_2026-10-09.zip"
EXPECTED_ZIP_SHA256 = "9ee3193e10f9e00f125f9cb29161563278ab5fa8698461bc6cbfcffeebbb44c5"
EXPECTED_PREVIOUS_SHA256 = "9d15b534696a3edc9eca4dd131b1b7c6f751c6820e571827f4f748df4a598e93"
NAMES = [
    "README.md", "SOURCE_REGISTER.json", "REQUIREMENTS.json",
    "ACCEPTANCE_TESTS.json", "QUALITY_REVIEW.md", "CONTINUATION_STATE.json",
    "GAP_UPDATE.md", "EVIDENCE_REQUEST_PLAN.md",
    "prior_checkpoint_AM.zip", "SHA256SUMS.txt"
]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def main():
    raw = {
        name: (PREVIOUS if name == "prior_checkpoint_AM.zip" else SOURCE / name).read_bytes()
        for name in NAMES
    }
    if digest(raw["prior_checkpoint_AM.zip"]) != EXPECTED_PREVIOUS_SHA256:
        raise RuntimeError("AM binary does not match the AN source archive's nested predecessor")
    expected = {
        name: sha for sha, name in (
            line.split("  ", 1)
            for line in raw["SHA256SUMS.txt"].decode("utf-8").strip().splitlines()
        )
    }
    for name in NAMES[:-1]:
        if expected.get(name) != digest(raw[name]):
            raise RuntimeError("SHA-256 verification failed for " + name)
    ARCHIVES.mkdir(parents=True, exist_ok=True)
    with ZipFile(TARGET, "w", compression=ZIP_DEFLATED, compresslevel=6) as z:
        for name in NAMES:
            info = ZipInfo(name, date_time=(2026, 10, 9, 15, 55, 0))
            z.writestr(info, raw[name], compress_type=ZIP_DEFLATED, compresslevel=6)
    actual = digest(TARGET.read_bytes())
    if actual != EXPECTED_ZIP_SHA256:
        TARGET.unlink()
        raise RuntimeError("Byte identity failed; computed AN SHA-256: " + actual)
    print(f"VERIFIED: {TARGET.name}, {TARGET.stat().st_size} bytes, SHA-256 {actual}")

if __name__ == "__main__":
    main()
