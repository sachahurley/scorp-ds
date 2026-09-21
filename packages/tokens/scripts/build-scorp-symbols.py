"""Build 'Scorp Symbols' and inline it into src/styles/tokens.css.

Scorp Symbols holds every glyph the design system renders that browsers do
not actually receive from Fragment Mono. Two gaps make it necessary:

1. Fragment Mono has no box-drawing, block, arrow, or most symbol glyphs.
2. Google Fonts serves Fragment Mono as unicode-range subsets that drop some
   glyphs the full font file does contain (arrows, triangles, check marks).

Without it, each missing glyph renders in a per-OS system font (Menlo, Apple
Symbols, Consolas...) whose advance width differs from Fragment's, so icons
vary by platform and tui-art frames lose column alignment.

Every glyph is transformed onto Fragment Mono's exact cell: advance 0.618em,
ascent/descent mapped onto Fragment's, so box-drawing strokes join and
columns align when these glyphs mix with Fragment text.

Glyph sources, in priority order:
  Fragment Mono (SIL OFL 1.1)          glyphs Google's subsets drop
  DejaVu Sans Mono (Bitstream Vera)    box drawing, blocks, most symbols
  Noto Sans Symbols 2 / Math (OFL)     the remainder (media controls etc.)

Glyph set: TUI_ICON_GLYPHS, tui-art escapes, full Box Drawing and Block
Elements ranges, non-ASCII literals in packages/*/src, plus EXTRA_CHARS for
glyphs consumer sites render. Run after adding a glyph that the glyph audit
(`npm run audit:glyphs`) flags:

    python3 -m venv /tmp/fontenv && /tmp/fontenv/bin/pip install fonttools brotli
    /tmp/fontenv/bin/python packages/tokens/scripts/build-scorp-symbols.py
"""
import base64
import io
import json
import os
import re
import urllib.request
import zipfile

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
TOKENS = os.path.join(REPO, 'packages', 'tokens')
CACHE = os.environ.get('SCORP_FONT_CACHE', '/tmp/scorp-font-cache')
BROWSER_UA = ('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 '
              '(KHTML, like Gecko) Chrome/126.0 Safari/537.36')

SOURCES = {
    'FragmentMono.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/fragmentmono/FragmentMono-Regular.ttf',
    # DejaVu publishes TTFs only inside its release zip: (zip url, member path)
    'DejaVuSansMono.ttf': ('https://github.com/dejavu-fonts/dejavu-fonts/releases/download/version_2_37/dejavu-fonts-ttf-2.37.zip',
                           'dejavu-fonts-ttf-2.37/ttf/DejaVuSansMono.ttf'),
    'NotoSansSymbols2.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosanssymbols2/NotoSansSymbols2-Regular.ttf',
    'NotoSansMath.ttf': 'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansmath/NotoSansMath-Regular.ttf',
}
# Glyphs consumer sites (portfolio, showcase) render that DS source does not.
EXTRA_CHARS = '·—•→↗≥θ░▒▓█▼☀☾♫⚔✓'

START, END = '/* SCORP-SYMBOLS:START', '/* SCORP-SYMBOLS:END */'


def fetch(name, source):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, name)
    if not os.path.exists(path):
        url, member = source if isinstance(source, tuple) else (source, None)
        req = urllib.request.Request(url, headers={'User-Agent': BROWSER_UA})
        data = urllib.request.urlopen(req).read()
        if member:
            data = zipfile.ZipFile(io.BytesIO(data)).read(member)
        open(path, 'wb').write(data)
    return path


def google_served_codepoints():
    """Codepoints Google Fonts actually delivers for Fragment Mono."""
    req = urllib.request.Request('https://fonts.googleapis.com/css2?family=Fragment+Mono&display=swap',
                                 headers={'User-Agent': BROWSER_UA})
    css = urllib.request.urlopen(req).read().decode()
    served = set()
    for rng in re.findall(r'unicode-range:\s*([^;]+);', css):
        for part in rng.split(','):
            a, _, b = part.strip().replace('U+', '').partition('-')
            served |= set(range(int(a, 16), int(b or a, 16) + 1))
    return served


def target_chars():
    chars = set(EXTRA_CHARS)
    icon_src = open(os.path.join(REPO, 'packages/components/src/components/TuiIcon.tsx')).read()
    tui_src = ''.join(open(os.path.join(dp, f)).read()
                      for dp, _, fs in os.walk(os.path.join(REPO, 'packages/tui-art/src')) for f in fs if f.endswith('.ts'))
    for src in (icon_src, tui_src):
        chars |= {chr(int(h, 16)) for h in re.findall(r'\\u([0-9A-Fa-f]{4})', src)}
    comments = re.compile(r'/\*.*?\*/|//[^\n]*|\{/\*.*?\*/\}', re.S)
    for pkg in ('components', 'tui-art', 'site'):
        for dp, _, fs in os.walk(os.path.join(REPO, 'packages', pkg, 'src')):
            for f in fs:
                if f.endswith(('.ts', '.tsx', '.css')):
                    chars |= set(comments.sub('', open(os.path.join(dp, f), encoding='utf-8').read()))
    chars |= {chr(c) for c in range(0x2500, 0x25A0)}  # Box Drawing + Block Elements
    return {c for c in chars if ord(c) > 0x7E}


def build():
    paths = {n: fetch(n, u) for n, u in SOURCES.items()}
    frag = TTFont(paths['FragmentMono.ttf'])
    f_adv = frag['hmtx'][frag.getBestCmap()[ord('M')]][0]
    f_asc, f_desc, f_gap = frag['hhea'].ascent, frag['hhea'].descent, frag['hhea'].lineGap
    served = set(frag.getBestCmap()) & google_served_codepoints()
    needed = sorted(c for c in target_chars() if ord(c) not in served)

    glyphs, cmap, order = {'.notdef': TTGlyphPen(None).glyph()}, {}, ['.notdef']
    remaining = list(needed)
    for name, monospace in (('FragmentMono.ttf', True), ('DejaVuSansMono.ttf', True),
                            ('NotoSansSymbols2.ttf', False), ('NotoSansMath.ttf', False)):
        src = TTFont(paths[name])
        s_cmap, gs = src.getBestCmap(), src.getGlyphSet()
        s_asc, s_desc = src['hhea'].ascent, src['hhea'].descent
        scale_units = 1000 / src['head'].unitsPerEm
        for ch in list(remaining):
            gname = s_cmap.get(ord(ch))
            if not gname:
                continue
            s_adv = src['hmtx'][gname][0] * scale_units
            asc, desc = s_asc * scale_units, s_desc * scale_units
            if monospace:
                # Stretch onto Fragment's cell so box strokes reach the cell edges.
                sx, sy = f_adv / s_adv, (f_asc - f_desc) / (asc - desc)
                dx, dy = 0, f_desc - desc * sy
            else:
                # Proportional symbols: uniform scale into the cell, centered.
                k = min(f_adv / s_adv, (f_asc - f_desc) / (asc - desc)) * 0.95
                sx = sy = k
                dx, dy = (f_adv - s_adv * k) / 2, 0
            rec = DecomposingRecordingPen(gs)
            gs[gname].draw(rec)
            out = TTGlyphPen(None)
            rec.replay(TransformPen(out, (sx * scale_units, 0, 0, sy * scale_units, dx, dy)))
            new = f'uni{ord(ch):04X}'
            glyphs[new] = out.glyph()
            cmap[ord(ch)] = new
            order.append(new)
            remaining.remove(ch)
    if remaining:
        raise SystemExit(f'No source font covers: {"".join(remaining)}')

    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyphs)
    glyf = fb.font['glyf']
    metrics = {}
    for g in order:
        glyphs[g].recalcBounds(glyf)
        metrics[g] = (f_adv, getattr(glyphs[g], 'xMin', 0) or 0)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=f_asc, descent=f_desc, lineGap=f_gap)
    fb.setupNameTable({
        'familyName': 'Scorp Symbols', 'styleName': 'Regular',
        'copyright': 'Glyphs derived from Fragment Mono and Noto Sans Symbols 2 / Noto Sans Math '
                     '(SIL OFL 1.1) and DejaVu Sans Mono (Bitstream Vera License). Renamed per license terms.',
        'licenseDescription': 'SIL Open Font License 1.1; Bitstream Vera License. See src/fonts/licenses.',
    })
    fb.setupOS2(sTypoAscender=f_asc, sTypoDescender=f_desc, sTypoLineGap=f_gap,
                usWinAscent=f_asc, usWinDescent=-f_desc, fsType=0, achVendID='SCRP')
    fb.setupPost(isFixedPitch=1)
    fb.font.flavor = 'woff2'
    buf = io.BytesIO()
    fb.font.save(buf)
    data = buf.getvalue()
    open(os.path.join(TOKENS, 'src/fonts/ScorpSymbols.woff2'), 'wb').write(data)

    ranges = ', '.join(f'U+{c:04X}' for c in sorted(cmap))
    block = (f"{START} generated by packages/tokens/scripts/build-scorp-symbols.py; do not edit */\n"
             "@font-face {\n"
             "  font-family: 'Scorp Symbols';\n"
             f"  src: url(data:font/woff2;base64,{base64.b64encode(data).decode()}) format('woff2');\n"
             "  font-display: block;\n"
             f"  unicode-range: {ranges};\n"
             "}\n"
             f"{END}")
    css_path = os.path.join(TOKENS, 'src/styles/tokens.css')
    css = open(css_path).read()
    css = re.sub(re.escape(START) + r'.*?' + re.escape(END), lambda _: block, css, flags=re.S)
    open(css_path, 'w').write(css)
    print(f'Scorp Symbols: {len(cmap)} glyphs, {len(data)} bytes woff2 -> tokens.css')


if __name__ == '__main__':
    build()
