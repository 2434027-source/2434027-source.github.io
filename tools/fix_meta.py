# -*- coding: utf-8 -*-
from __future__ import annotations

import re
from pathlib import Path


DESC = (
    "UCB - это символ нашего крипто-братства. "
    "Мы сообщество трейдеров и новаторов, объединенных целью покорить мир криптовалют вместе."
)


def upsert_description(html: str) -> str:
    # Replace/insert description meta
    if re.search(r'<meta\s+name=["\']description["\']', html):
        html = re.sub(
            r'<meta\s+name=["\']description["\']\s+content=["\'][^"\']*["\']\s*/?>',
            f'<meta name="description" content="{DESC}"/>',
            html,
            count=1,
        )
    else:
        html = html.replace(
            "<head>",
            f'<head><meta name="description" content="{DESC}"/>',
            1,
        )

    # Replace og:description if present
    html = re.sub(
        r'<meta\s+content=["\'][^"\']*["\']\s+property=["\']og:description["\']\s*/?>',
        f'<meta content="{DESC}" property="og:description"/>',
        html,
        count=1,
    )
    return html


def upsert_title(html: str) -> str:
    if "<title>" in html:
        html = re.sub(r"<title>.*?</title>", "<title>UCB</title>", html, count=1)
        return html
    return html.replace("<head>", "<head><title>UCB</title>", 1)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    for name in ("index.html", "404.html", "sorry.html"):
        p = root / name
        if not p.exists():
            continue
        html = p.read_text(encoding="utf-8", errors="replace")
        html2 = upsert_title(html)
        html2 = upsert_description(html2)
        # Remove leftover Readymag default description if still present (to avoid duplicates).
        html2 = html2.replace(
            '<meta name="description" content="Built with Readymag—a tool to design anything on the web."/>',
            "",
        )

        # Fix corrupted page titles inside Readymag exported JSON (if present).
        # We target specific pages by numeric id so we don't touch unrelated content.
        html2 = html2.replace(
            '&quot;num_id&quot;:28736049,&quot;title&quot;:&quot;?? ??????&quot;',
            '&quot;num_id&quot;:28736049,&quot;title&quot;:&quot;О нас&quot;',
        )
        html2 = html2.replace(
            '&quot;num_id&quot;:25573443,&quot;title&quot;:&quot;??????????????&quot;',
            '&quot;num_id&quot;:25573443,&quot;title&quot;:&quot;Роадмап&quot;',
        )
        html2 = html2.replace(
            '&quot;num_id&quot;:28700777,&quot;title&quot;:&quot;????????????????????&quot;',
            '&quot;num_id&quot;:28700777,&quot;title&quot;:&quot;Токеномика&quot;',
        )
        html2 = html2.replace(
            '&quot;num_id&quot;:28700775,&quot;title&quot;:&quot;????????????????&quot;',
            '&quot;num_id&quot;:28700775,&quot;title&quot;:&quot;Контакты&quot;',
        )

        # Translate the Readymag 'sorry' page UI copy to Russian (and fix any corrupted text).
        if name == "sorry.html":
            html2 = re.sub(
                r'<h1 class="css-br0qk9">.*?</h1>',
                '<h1 class="css-br0qk9">Похоже, проблема в браузере.</h1>',
                html2,
                count=1,
            )
            # Replace the first two explanatory paragraphs (order matters).
            replacements = iter(
                [
                    '<div class="css-g5xqq8">Если есть проблемы с доступом — обновите браузер или попробуйте другой.</div>',
                    '<div class="css-g5xqq8">Мы поддерживаем последние версии Chrome, Opera, Firefox и Microsoft Edge, а также Safari 11+.</div>',
                ]
            )

            def _replace_two(match: re.Match[str]) -> str:
                try:
                    return next(replacements)
                except StopIteration:
                    return match.group(0)

            html2 = re.sub(r'<div class="css-g5xqq8">.*?</div>', _replace_two, html2)
        if html2 != html:
            p.write_text(html2, encoding="utf-8")
            print(f"updated {name}")

    # Fix wording in exported snippets menu (cosmetic).
    snippets_dir = root / "snippets"
    if snippets_dir.exists():
        for p in snippets_dir.glob("*.html"):
            html = p.read_text(encoding="utf-8", errors="replace")
            html2 = html.replace("Роадмапа", "Роадмап")
            if html2 != html:
                p.write_text(html2, encoding="utf-8")
                print(f"updated {p.as_posix()}")


if __name__ == "__main__":
    main()

