from pathlib import Path
import json


ROOT_DIR = Path(__file__).resolve().parent
SOURCE_DIR = ROOT_DIR / "source-material"
OUTPUT_PATH = ROOT_DIR / "src" / "content" / "artifacts.ts"


def collect_artifact_docs() -> dict[str, str]:
    docs: dict[str, str] = {}

    for artifact_path in sorted(SOURCE_DIR.glob("*/02-sanitized/artifact.md")):
        folder = artifact_path.parent.parent.name
        docs[folder] = artifact_path.read_text(encoding="utf-8").strip()

    return docs


def write_artifact_ts(docs: dict[str, str]) -> None:
    lines = ['export const artifactDocs: Record<string, string> = {};', ""]

    for folder, content in docs.items():
        lines.append(f'artifactDocs["{folder}"] = {json.dumps(content)};')

    OUTPUT_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    docs = collect_artifact_docs()
    write_artifact_ts(docs)
    print(f"Wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
