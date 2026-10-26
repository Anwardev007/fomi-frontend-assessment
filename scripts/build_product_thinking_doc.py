#!/usr/bin/env python3
"""
Fomi — Product Thinking Document
Part B deliverable for the Frontend Developer Technical Assessment.
Answers the six required questions in a polished PDF.
"""
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ---- Fonts ----
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('LibSerif', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Italic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-BoldItalic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-BoldItalic.ttf'))
pdfmetrics.registerFont(TTFont('Sans', f'{FONT_DIR}/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Sans-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSans-Bold.ttf'))
registerFontFamily('LibSerif', normal='LibSerif', bold='LibSerif-Bold',
                   italic='LibSerif-Italic', boldItalic='LibSerif-BoldItalic')
registerFontFamily('Sans', normal='Sans', bold='Sans-Bold')

# ---- Fomi brand palette (matches the app: amber → fuchsia twilight) ----
AMBER = colors.HexColor('#F59E0B')
ROSE = colors.HexColor('#E11D48')
FUCHSIA = colors.HexColor('#A21CAF')
INK = colors.HexColor('#0B0A14')   # near-black with violet tint
TEXT_PRIMARY = colors.HexColor('#1F2937')
TEXT_MUTED = colors.HexColor('#4B5563')
BORDER = colors.HexColor('#E5E7EB')
SOFT_BG = colors.HexColor('#FAFAF9')

PAGE_W, PAGE_H = A4
LEFT_MARGIN = 2.2 * cm
RIGHT_MARGIN = 2.2 * cm
TOP_MARGIN = 2.0 * cm
BOTTOM_MARGIN = 2.0 * cm
CONTENT_W = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN

# ---- Styles ----
styles = getSampleStyleSheet()

cover_brand_style = ParagraphStyle(
    'CoverBrand', parent=styles['Normal'],
    fontName='Sans-Bold', fontSize=10, leading=13,
    textColor=FUCHSIA, alignment=TA_LEFT, spaceAfter=4
)
cover_title_style = ParagraphStyle(
    'CoverTitle', parent=styles['Normal'],
    fontName='LibSerif-Bold', fontSize=28, leading=34,
    textColor=INK, alignment=TA_LEFT, spaceAfter=10
)
cover_subtitle_style = ParagraphStyle(
    'CoverSubtitle', parent=styles['Normal'],
    fontName='LibSerif-Italic', fontSize=13, leading=18,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=24
)
cover_meta_style = ParagraphStyle(
    'CoverMeta', parent=styles['Normal'],
    fontName='Sans', fontSize=9.5, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=2
)
cover_meta_label = ParagraphStyle(
    'CoverMetaLabel', parent=styles['Normal'],
    fontName='Sans-Bold', fontSize=8, leading=11,
    textColor=FUCHSIA, alignment=TA_LEFT, spaceAfter=2
)
h1_style = ParagraphStyle(
    'H1', parent=styles['Normal'],
    fontName='LibSerif-Bold', fontSize=15, leading=20,
    textColor=INK, alignment=TA_LEFT,
    spaceBefore=14, spaceAfter=8, keepWithNext=True
)
h2_style = ParagraphStyle(
    'H2', parent=styles['Normal'],
    fontName='Sans-Bold', fontSize=10, leading=14,
    textColor=FUCHSIA, alignment=TA_LEFT,
    spaceBefore=8, spaceAfter=4, keepWithNext=True
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontName='LibSerif', fontSize=10.5, leading=15,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceAfter=6
)
body_left_style = ParagraphStyle(
    'BodyLeft', parent=body_style, alignment=TA_LEFT
)
bullet_style = ParagraphStyle(
    'Bullet', parent=body_style,
    fontSize=10.5, leading=14.5, leftIndent=14, bulletIndent=2,
    spaceAfter=3, alignment=TA_LEFT
)
quote_style = ParagraphStyle(
    'Quote', parent=styles['Normal'],
    fontName='LibSerif-Italic', fontSize=10.5, leading=15,
    textColor=TEXT_MUTED, alignment=TA_LEFT,
    leftIndent=14, rightIndent=14, spaceBefore=4, spaceAfter=8
)
footer_style = ParagraphStyle(
    'Footer', parent=styles['Normal'],
    fontName='Sans', fontSize=8.5, leading=10,
    textColor=TEXT_MUTED, alignment=TA_CENTER
)


def draw_chrome(canvas, doc):
    canvas.saveState()
    # Top thin amber band + fuchsia accent
    canvas.setFillColor(AMBER)
    canvas.rect(0, PAGE_H - 0.18 * cm, PAGE_W, 0.18 * cm, fill=1, stroke=0)
    canvas.setFillColor(FUCHSIA)
    canvas.rect(0, PAGE_H - 0.32 * cm, PAGE_W * 0.32, 0.14 * cm, fill=1, stroke=0)
    # Footer rule
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.4)
    canvas.line(LEFT_MARGIN, 1.3 * cm, PAGE_W - RIGHT_MARGIN, 1.3 * cm)
    # Footer text
    canvas.setFont('Sans', 8.5)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_MARGIN, 0.95 * cm, "Fomi · Product Thinking Document · Frontend Assessment")
    canvas.drawRightString(PAGE_W - RIGHT_MARGIN, 0.95 * cm, f"Page {doc.page}")
    canvas.restoreState()


def build_cover():
    story = []
    story.append(Spacer(1, 1.6 * cm))
    story.append(Paragraph("FOMI · FRONTEND ASSESSMENT", cover_brand_style))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph("Product Thinking Document", cover_title_style))
    story.append(Paragraph(
        "A short rationale for the redesigned Image Generation Workspace — "
        "the trade-offs, the inspirations, and the decisions that shaped it.",
        cover_subtitle_style))

    # Brand gradient bar
    bar = Table([[""]], colWidths=[CONTENT_W], rowHeights=[6])
    bar.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0.3, 0), AMBER),
        ('LINEABOVE', (0, 0), (-1, 0), 0, colors.white),
    ]))
    story.append(bar)
    story.append(Spacer(1, 0.8 * cm))

    # Meta block
    meta = [
        [Paragraph("PROJECT", cover_meta_label), Paragraph("Fomi — AI Creative Platform", cover_meta_style)],
        [Paragraph("DELIVERABLE", cover_meta_label), Paragraph("Image Generation Workspace (Part B)", cover_meta_style)],
        [Paragraph("AUTHOR", cover_meta_label), Paragraph("Frontend Engineer Candidate", cover_meta_style)],
        [Paragraph("STACK", cover_meta_label), Paragraph("Next.js 16 · TypeScript · Tailwind · shadcn/ui · Framer Motion", cover_meta_style)],
        [Paragraph("DEPLOYMENT", cover_meta_label), Paragraph("Vercel (preview link included separately)", cover_meta_style)],
        [Paragraph("DATE", cover_meta_label), Paragraph("October 2026", cover_meta_style)],
    ]
    t = Table(meta, colWidths=[3.2 * cm, CONTENT_W - 3.2 * cm])
    t.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LINEBELOW', (0, 0), (-1, -2), 0.3, BORDER),
    ]))
    story.append(t)

    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph(
        "&ldquo;The workspace is the hero &mdash; not the marketing page. &rdquo;",
        quote_style))
    story.append(Paragraph(
        "This document accompanies the live implementation. It explains the thinking behind "
        "the workspace: what problem it solves, which decisions matter most, what was "
        "deliberately left out, and where the design would go next.",
        body_style))
    story.append(PageBreak())
    return story


def build_q1():
    story = []
    story.append(Paragraph("1. What problem were you trying to solve? What type of user did you design for?", h1_style))

    story.append(Paragraph("The user I designed for", h2_style))
    story.append(Paragraph(
        "I designed for the <b>working creative professional</b> &mdash; the art director who "
        "generates forty variants before lunch, the social-media designer who ships a campaign "
        "every afternoon, the concept artist iterating on a hero shot for a pitch deck. This "
        "person has already signed in, has an existing project open, and will spend four to "
        "eight uninterrupted hours inside the application. They are not a beginner exploring "
        "AI for the first time; they are a practitioner who needs the tool to disappear into "
        "the work.",
        body_style))

    story.append(Paragraph("The problem", h2_style))
    story.append(Paragraph(
        "Every existing AI image generator I have used &mdash; Midjourney, DALL·E, Leonardo, "
        "Krea, ImagineArt &mdash; treats a generation as the end of the workflow. You type a "
        "prompt, you get four pictures, you pick one, and you start over. But for a "
        "professional, the generation is the <i>beginning</i> of the workflow. The four "
        "pictures are raw material: one is the colour reference, one has the right "
        "composition, one needs an upscale, one becomes the seed for a variation pass. The "
        "real work &mdash; comparing, refining, remixing, assembling &mdash; happens after the "
        "first generation, and existing tools offer almost no support for it. The user is "
        "forced to mentally juggle seeds, copy prompts into a notes app, and screenshot "
        "thumbnails to compare variants side by side.",
        body_style))
    story.append(Paragraph(
        "The problem I set out to solve, therefore, is not &ldquo;make another AI image "
        "generator.&rdquo; It is: <b>how do you build a workspace that treats generation as "
        "the start of a creative conversation, not the end of one?</b> The workspace must "
        "make comparison, refinement, and remix first-class operations &mdash; as effortless "
        "as the original prompt was.",
        body_style))
    return story


def build_q2():
    story = []
    story.append(Paragraph("2. What are the three most important UX decisions you made? Why?", h1_style))

    story.append(Paragraph("Decision 1 — The 2×2 canvas is the workspace, not a result list", h2_style))
    story.append(Paragraph(
        "Every variant occupies a fixed slot in a 2×2 grid that never moves. New generations "
        "replace the previous four in the same four slots, with a per-slot stagger animation "
        "so the eye can track which images changed. The history panel on the left keeps a "
        "thumbnail of every past generation, and clicking one restores those four variants to "
        "the canvas. <b>Why:</b> this gives the user a stable spatial memory of their work. "
        "Variant 2 is always variant 2. They can glance at the top-right tile and know exactly "
        "what is there, the same way a painter knows where their palette is. It also makes "
        "comparison effortless &mdash; the four variants are already side by side, by default, "
        "without any extra UI.",
        body_style))

    story.append(Paragraph("Decision 2 — Hover actions are contextual to the variant, not global", h2_style))
    story.append(Paragraph(
        "Hovering a variant reveals an action bar anchored to that specific tile: Upscale to "
        "4K, Make variations, Edit, Copy prompt, Download, Delete. These are the six things a "
        "professional does to a finished generation, and they are placed exactly where the "
        "user&rsquo;s attention already is. <b>Why:</b> in existing tools these actions live "
        "either in a global toolbar (forcing the user to first select, then act, in two "
        "steps) or in a right-click menu (invisible and undiscoverable). Anchoring them to "
        "the variant itself collapses select-and-act into a single gesture and makes the "
        "workspace feel like Figma, where every object carries its own affordances.",
        body_style))

    story.append(Paragraph("Decision 3 — Parameters live in a persistent right rail, not a modal", h2_style))
    story.append(Paragraph(
        "The right sidebar holds the model picker, style chips, aspect-ratio shapes, batch "
        "count, and an Advanced collapsible with guidance scale, steps, seed, and negative "
        "prompt. It is always visible on desktop and slides in as a drawer on mobile. "
        "<b>Why:</b> professionals adjust parameters between every generation. Hiding them "
        "behind a settings modal adds two clicks and a context switch to the most common "
        "action in the tool. A persistent rail makes parameter tweaking as cheap as typing a "
        "new prompt &mdash; which is exactly the ratio of effort the workflow demands.",
        body_style))
    return story


def build_q3():
    story = []
    story.append(Paragraph("3. Which features did you intentionally leave out? Why?", h1_style))
    story.append(Paragraph(
        "Strong product engineers know what not to build. The following features are common "
        "in AI image tools but were deliberately omitted from this workspace, because they "
        "either distract from the core workflow or solve problems the user does not actually "
        "have at the moment of generation.",
        body_style))

    items = [
        ("Onboarding tours and tooltip carousels",
         "The user is a professional who returns daily. A first-run tour adds friction to "
         "every subsequent visit for the benefit of a single visit. The interface should be "
         "discoverable by its layout alone; if a feature needs a tooltip to be found, the "
         "layout is wrong."),
        ("A social feed inside the workspace",
         "Community showcase belongs on the marketing site and a separate Explore tab. "
         "Mixing other people&rsquo;s creations into the working canvas invites comparison "
         "and breaks focus. The workspace is for the user&rsquo;s own work, full stop."),
        ("In-tool chat or comments",
         "Real-time collaboration is valuable, but bolting a chat sidebar onto a single-user "
         "canvas adds a second mental model without a clear payoff. If collaboration is added "
         "later, it should be re-architected around shared projects, not layered on as a "
         "chat dock."),
        ("Excessive prompt-engineering helpers (synonym pickers, magic-enhance buttons)",
         "Power users develop their own prompt vocabulary and resent tools that rewrite "
         "their words. A single &ldquo;Surprise me&rdquo; button for inspiration is enough; "
         "anything more turns the prompt box into a battle for control."),
        ("A separate &ldquo;preview full screen&rdquo; mode",
         "Clicking any variant already opens a metadata lightbox with the full image, scores, "
         "and seed. A second, separate full-screen viewer would be redundant. One zoomable "
         "view is enough; two is clutter."),
    ]
    for title, why in items:
        story.append(Paragraph(f"&bull; <b>{title}.</b> {why}", bullet_style))

    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph(
        "Each omission was a trade-off. The guiding question was always: <i>does this serve "
        "the professional in flow, or does it serve a metric the company is measuring?</i> "
        "If the answer was the latter, the feature was cut.",
        body_style))
    return story


def build_q4():
    story = []
    story.append(Paragraph("4. Which existing products inspired your thinking? What did you like? What would you improve?", h1_style))

    products = [
        ("Figma",
         "The gold standard for professional creative tools. The way every object carries its "
         "own contextual actions, the way the layers panel persists without intruding, the way "
         "keyboard shortcuts are first-class &mdash; these shaped my decision to anchor hover "
         "actions to each variant and to keep the parameter rail persistent.",
         "Figma&rsquo;s weakness for an AI context is that it assumes the user knows exactly "
         "what they want to make. AI generation is exploratory by nature, so the workspace "
         "needs stronger support for &ldquo;what if?&rdquo; branching than Figma offers."),
        ("Krea",
         "The real-time generation feedback loop is genuinely innovative. Krea taught me that "
         "speed of iteration matters more than the quality of any single output. I borrowed "
         "the idea of instant parameter feedback (changing the style chip immediately restyles "
         "the next generation, with no confirmation step).",
         "Krea&rsquo;s interface is busy. There are too many panels competing for attention, "
         "and the canvas itself feels small. I deliberately gave the canvas the largest area "
         "of any region in the workspace, even at the cost of fewer visible controls."),
        ("Linear",
         "Not a creative tool, but the benchmark for keyboard-first, opinionated, "
         "low-decoration software. Linear&rsquo;s use of ⌘K, its restraint with colour, and "
         "its obsessive typographic rhythm all informed the visual identity of the Fomi "
         "workspace.",
         "Linear&rsquo;s aesthetic is so austere that it can feel cold. For a creative tool, "
         "I wanted Linear&rsquo;s discipline without its severity &mdash; hence the warm "
         "amber-to-fuchsia gradient as the brand accent, applied sparingly."),
        ("Magnific",
         "Magnific&rsquo;s upscale interface is the best in the industry: before/after slider, "
         "side-by-side comparison, parameter presets. It directly inspired the per-variant "
         "&ldquo;Upscale to 4K&rdquo; action in the Fomi workspace.",
         "Magnific treats upscaling as a separate product. I believe upscaling is a verb you "
         "apply to an existing variant, not a destination you navigate to. Fomi keeps it "
         "inline."),
    ]
    for name, liked, improve in products:
        story.append(Paragraph(name, h2_style))
        story.append(Paragraph(f"<b>What I liked.</b> {liked}", body_style))
        story.append(Paragraph(f"<b>What I would improve.</b> {improve}", body_style))
    return story


def build_q5():
    story = []
    story.append(Paragraph("5. If you had another month to work on this product, what would you improve?", h1_style))
    story.append(Paragraph(
        "A month is enough time to make three substantial improvements, each of which would "
        "move the workspace from &ldquo;polished demo&rdquo; to &ldquo;tool I would use "
        "daily.&rdquo;",
        body_style))

    story.append(Paragraph("Improvement 1 — Real variant genealogy", h2_style))
    story.append(Paragraph(
        "Currently, history is a flat list of generations. With another month I would build a "
        "proper genealogy tree: every variant knows its parent (the seed it was generated "
        "from), and the user can scrub backwards through the tree to see how an idea evolved. "
        "This is the single feature that no existing AI image tool offers and that "
        "professionals need most. It turns the workspace from a generator into a sketchbook.",
        body_style))

    story.append(Paragraph("Improvement 2 — Side-by-side compare mode", h2_style))
    story.append(Paragraph(
        "A toggle that turns the 2×2 canvas into a 1×2 comparison view, with a draggable "
        "divider between two variants and a synced zoom. This is what every professional does "
        "manually today (screenshots, side-by-side in image editors). Building it natively "
        "would eliminate a real, frequent pain point.",
        body_style))

    story.append(Paragraph("Improvement 3 — Style transfer from a reference image", h2_style))
    story.append(Paragraph(
        "Drag any image from the canvas or the file system onto the prompt box, and the model "
        "uses it as a style reference for the next generation. The right rail gains a "
        "&ldquo;Reference&rdquo; slot showing the chosen image and a strength slider. This is "
        "the feature that would make Fomi a serious tool for art directors, who almost always "
        "have a visual reference in mind.",
        body_style))

    story.append(Paragraph("Smaller polish items", h2_style))
    for item in [
        "Proper keyboard shortcut layer: ⌘1–4 to focus each variant, ⌘E to upscale, ⌘D to download, ⌘←/→ to scrub history.",
        "A command palette (⌘K) for every action, parameter, and template, searchable.",
        "Real persistence: a backend that stores projects, generations, and genealogy across devices.",
        "Touch gestures on mobile: pinch to zoom a variant, swipe to scrub the canvas history.",
        "A dark/light theme toggle that respects the system preference and persists per user.",
    ]:
        story.append(Paragraph(f"&bull; {item}", bullet_style))
    return story


def build_q6():
    story = []
    story.append(Paragraph("6. What is the single feature or workflow that differentiates your workspace?", h1_style))
    story.append(Paragraph(
        "The single differentiator is what I call <b>the persistent canvas with hover-anchored "
        "actions</b> &mdash; the combination of Decision 1 and Decision 2 from Question 2.",
        body_style))
    story.append(Paragraph(
        "Every other AI image generator I have used treats the four generated images as a "
        "disposable result list. You look, you pick, you move on. The Fomi workspace treats "
        "the four slots as a <i>working surface</i>: the slots persist across generations, "
        "every slot carries its own contextual actions (upscale, variations, edit, download), "
        "and clicking a history entry restores the exact four variants that were there before. "
        "The user builds up a spatial memory of their own creative session.",
        body_style))
    story.append(Paragraph(
        "This is the difference between a slot machine and a sketchbook. A slot machine gives "
        "you a fresh result every pull and forgets the last one. A sketchbook keeps every "
        "page, lets you flip back, and lets you work on any page at any time. Existing AI "
        "image tools are slot machines. The Fomi workspace is a sketchbook.",
        body_style))
    story.append(Paragraph(
        "If I had to point to one moment that captures this, it is the act of hovering a "
        "variant and seeing Upscale, Variations, and Edit appear directly under the cursor &mdash; "
        "no toolbar, no menu, no second click. The image becomes the interface. That is the "
        "differentiator, and it is the thing I would defend most fiercely in a product review.",
        body_style))
    return story


def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LEFT_MARGIN, rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN,
        title="Fomi — Product Thinking Document",
        author="Frontend Engineer Candidate",
        subject="Part B deliverable: Product Thinking Document for Fomi Image Generation Workspace",
        creator="Fomi Frontend Assessment",
    )

    story = []
    story.extend(build_cover())
    story.extend(build_q1())
    story.extend(build_q2())
    story.extend(build_q3())
    story.extend(build_q4())
    story.extend(build_q5())
    story.extend(build_q6())

    doc.build(story, onFirstPage=draw_chrome, onLaterPages=draw_chrome)
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    out = "/home/z/my-project/download/Fomi_Product_Thinking_Document.pdf"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build_pdf(out)
