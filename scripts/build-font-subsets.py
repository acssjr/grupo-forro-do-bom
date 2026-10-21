"""Generate lossless Latin WOFF2 subsets from the preserved source fonts.

Requires fonttools[woff]. Keeps outlines, metrics and all OpenType features;
the original complete WOFF2 faces remain available for other characters.
"""
from pathlib import Path
from shutil import copyfile
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen

project = Path(__file__).resolve().parents[1]
root = project / "src" / "app" / "fonts"
output = project / "public" / "fonts"
output.mkdir(parents=True, exist_ok=True)
ranges = [
    (0x0, 0xFF),
    (0x300, 0x36F),
    (0x2000, 0x206F),
    (0x20AC, 0x20AC),
    (0x2190, 0x22FF),
    (0x2500, 0x27FF),
]
unicodes = {code for start, end in ranges for code in range(start, end + 1)}
for weight in ("Regular", "Medium", "SemiBold", "Bold"):
    source = root / f"Saans-TRIAL-{weight}.otf"
    font = TTFont(source)
    original = TTFont(source)
    options = subset.Options()
    options.layout_features = ["*"]
    options.glyph_names = True
    options.notdef_outline = True
    sub = subset.Subsetter(options=options)
    sub.populate(unicodes=unicodes)
    sub.subset(font)
    font.flavor = "woff2"
    target = output / f"Saans-TRIAL-{weight}-latin.woff2"
    font.save(target)
    result = TTFont(target)
    expected = {code: glyph for code, glyph in original.getBestCmap().items() if code in unicodes}
    assert result.getBestCmap() == expected
    for glyph in result.getGlyphOrder():
        assert result["hmtx"][glyph] == original["hmtx"][glyph]
        before, after = RecordingPen(), RecordingPen()
        original.getGlyphSet()[glyph].draw(before)
        result.getGlyphSet()[glyph].draw(after)
        assert before.value == after.value, f"Changed outline: {weight}/{glyph}"
    print(f"{target.name}: {target.stat().st_size} bytes; {len(expected)} characters verified")
    copyfile(root / f"Saans-TRIAL-{weight}.woff2", output / f"Saans-TRIAL-{weight}.woff2")
