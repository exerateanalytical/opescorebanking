#!/usr/bin/env python3
"""Validate unified codebase provenance using exact immutable Git object IDs.

Archive evidence must remain byte-for-byte original. This script does not
certify operational readiness or legal/regulatory suitability.
"""
import json
import pathlib
import subprocess

root = pathlib.Path(__file__).resolve().parents[1]
manifest = json.loads((root / "governance/consolidation/UNIFIED_SOURCE_INVENTORY.json").read_text())
assert manifest["schema"] == "opes-core-banking-unified-source-inventory-v1"
assert len(manifest["domains"]) == 25
assert len(manifest["artifacts"]["controlModules"]["ids"]) == 6
assert manifest["financeSafety"]["realMoneyDeploymentApproved"] is False
assert manifest["artifacts"]["screens"]["totalDefined"] == 726
assert manifest["artifacts"]["forms"]["totalDefined"] == 726
assert manifest["artifacts"]["documents"]["totalDefined"] == 407
assert manifest["artifacts"]["reports"]["totalDefined"] == 378
assert manifest["artifacts"]["domainContracts"]["typedCandidateDomains"] == 25
checked = 0
for group in manifest["archives"]:
    assert group["fileCount"] == len(group["files"]), group["name"]
    for item in group["files"]:
        path = root / item["path"]
        assert path.is_file(), item["path"]
        digest = subprocess.check_output(["git", "hash-object", str(path)], cwd=root, text=True).strip()
        assert digest == item["blob"], f"Historical source altered: {item['path']}"
        checked += 1
for item in manifest["archivedWorkflows"]:
    path = root / item["path"]
    assert path.is_file(), item["path"]
    digest = subprocess.check_output(["git","hash-object",str(path)],cwd=root,text=True).strip()
    assert digest == item["blob"], item["path"]
    checked += 1

for path in manifest["runtimeSingleSources"]:
    assert (root / path).is_dir(), path
assert not (root / "apps/opes-core-banking-reports").exists(), "Legacy reports app must not be an active runtime"
assert not (root / "apps/opes-core-banking-forms").exists(), "Legacy forms app must not be an active runtime"
assert not (root / "apps/opes-core-banking-ui").exists(), "Legacy screens app must not be an active runtime"
assert not (root / "apps/opes-core-banking-documents").exists(), "Legacy documents app must not be an active runtime"
print("UNIFIED_SOURCE_PROVENANCE_PASS", checked, "original Git blobs, 25 domain statuses, one canonical application stack")
