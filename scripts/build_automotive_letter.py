#!/usr/bin/env python3
"""
Generate One-Page Motivation Letter PDF for M.Sc. Automotive Software Engineering
at TU Chemnitz, Summer Semester 2027.
Author: Muhammad Anwar
"""
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ---- Fonts (Liberation Serif = Times-equivalent) ----
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('LibSerif', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Italic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-BoldItalic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-BoldItalic.ttf'))
registerFontFamily('LibSerif', normal='LibSerif', bold='LibSerif-Bold',
                   italic='LibSerif-Italic', boldItalic='LibSerif-BoldItalic')

# ---- Colors (formal academic — navy + warm accent for automotive/industrial feel) ----
NAVY = colors.HexColor('#1E3A8A')        # primary accent
NAVY_DARK = colors.HexColor('#172554')
STEEL = colors.HexColor('#374151')       # industrial steel for the second band
TEXT_PRIMARY = colors.HexColor('#1F2937')
TEXT_MUTED = colors.HexColor('#4B5563')
BORDER = colors.HexColor('#CBD5E1')

# ---- Page geometry (tight margins for one page) ----
PAGE_W, PAGE_H = A4
LEFT_MARGIN = 1.9 * cm
RIGHT_MARGIN = 1.9 * cm
TOP_MARGIN = 1.2 * cm
BOTTOM_MARGIN = 1.2 * cm
CONTENT_W = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN

# ---- Styles ----
styles = getSampleStyleSheet()

sender_style = ParagraphStyle(
    'Sender', parent=styles['Normal'],
    fontName='LibSerif', fontSize=9.5, leading=12.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=0
)
date_style = ParagraphStyle(
    'Date', parent=styles['Normal'],
    fontName='LibSerif', fontSize=9.5, leading=12.5,
    textColor=TEXT_PRIMARY, alignment=TA_RIGHT, spaceAfter=8
)
recipient_style = ParagraphStyle(
    'Recipient', parent=styles['Normal'],
    fontName='LibSerif', fontSize=9.5, leading=12.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=6
)
subject_style = ParagraphStyle(
    'Subject', parent=styles['Normal'],
    fontName='LibSerif-Bold', fontSize=9.7, leading=13,
    textColor=NAVY_DARK, alignment=TA_LEFT, spaceAfter=6
)
salutation_style = ParagraphStyle(
    'Salutation', parent=styles['Normal'],
    fontName='LibSerif', fontSize=9.7, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=4
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontName='LibSerif', fontSize=9.4, leading=12.6,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceAfter=4, firstLineIndent=0
)
closing_style = ParagraphStyle(
    'Closing', parent=styles['Normal'],
    fontName='LibSerif', fontSize=9.7, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=2
)
signature_style = ParagraphStyle(
    'Signature', parent=styles['Normal'],
    fontName='LibSerif-Bold', fontSize=10, leading=13,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceBefore=10, spaceAfter=0
)
sig_detail_style = ParagraphStyle(
    'SigDetail', parent=styles['Normal'],
    fontName='LibSerif-Italic', fontSize=9, leading=12,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=0
)


def draw_letterhead(canvas, doc):
    """Slim navy + steel accent bands at top and bottom (one-page letter)."""
    canvas.saveState()
    # Top: navy band + thin steel accent
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 0.35 * cm, PAGE_W, 0.35 * cm, fill=1, stroke=0)
    canvas.setFillColor(STEEL)
    canvas.rect(0, PAGE_H - 0.50 * cm, PAGE_W, 0.15 * cm, fill=1, stroke=0)
    # Bottom: thin band mirror
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, 0.18 * cm, fill=1, stroke=0)
    canvas.restoreState()


def build_letter():
    story = []

    # ---- Sender (left) + Date (right) ----
    sender_html = (
        "<b>Muhammad Anwar</b><br/>"
        "BS Software Engineering (CGPA 3.73/4.00)<br/>"
        "COMSATS University Islamabad, Sahiwal Campus<br/>"
        "Registration No. CIIT/SP22-BSE-023/SWL<br/>"
        "Sahiwal, Pakistan"
    )
    date_html = "Sahiwal, 22 October 2026"
    header_table = Table(
        [[Paragraph(sender_html, sender_style), Paragraph(date_html, date_style)]],
        colWidths=[CONTENT_W * 0.62, CONTENT_W * 0.38]
    )
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 0.18 * cm))

    # Thin rule under header
    story.append(HRFlowable(width=CONTENT_W, thickness=0.5, color=NAVY,
                            spaceBefore=2, spaceAfter=6))

    # ---- Recipient block ----
    recipient_html = (
        "Admissions Office<br/>"
        "Faculty of Computer Science and Engineering<br/>"
        "Technische Universit&auml;t Chemnitz<br/>"
        "Chemnitz, Saxony, Germany"
    )
    story.append(Paragraph(recipient_html, recipient_style))

    # ---- Subject line ----
    subject_html = (
        "<b>Subject: Application for admission to the M.Sc. programme "
        "Automotive Software Engineering &mdash; Summer Semester 2027</b>"
    )
    story.append(Paragraph(subject_html, subject_style))

    # ---- Salutation ----
    story.append(Paragraph("Dear Members of the Admissions Committee,", salutation_style))

    # ---- Body paragraphs ----

    # P1 — Introduction: who I am, what I'm applying for, headline academic record
    p1 = (
        "I am writing to apply for admission to the Master&rsquo;s programme in "
        "<b>Automotive Software Engineering</b> at Technische Universit&auml;t Chemnitz "
        "for the Summer Semester 2027. I hold a Bachelor of Science in Software "
        "Engineering from COMSATS University Islamabad, which I completed in January "
        "2026 with a cumulative grade point average of 3.73 out of 4.00 over 134 credit "
        "hours, graduating with A grades in the large majority of my software-engineering "
        "and systems courses. My objective is to specialise in the development of "
        "embedded hardware/software systems for the automotive domain, and TU Chemnitz "
        "&mdash; with its long-standing reputation in automotive teaching and its "
        "location in the heart of the Saxony automotive region &mdash; is the ideal place "
        "for me to acquire that specialisation."
    )
    story.append(Paragraph(p1, body_style))

    # P2 — The bridge: SE degree → Automotive SE; relevant coursework with grades
    p2 = (
        "My undergraduate training maps directly onto the &ldquo;Automotive Software "
        "Engineering&rdquo; pillar of the Master programme. I completed the full software "
        "engineering lifecycle with the grade A in Software Engineering Concepts, "
        "Software Design and Architecture, Software Requirement Engineering, and Formal "
        "Methods, and the grade B+ in Software Construction and Development, Design "
        "Patterns, and Software Re-Engineering, culminating in a two-semester Senior "
        "Design Project (I and II) graded A\u2212 and A respectively. This coursework "
        "gave me hands-on command of requirements analysis, model-driven design, design "
        "patterns, and the formal verification of safety-critical properties &mdash; the "
        "exact skill set that distinguishes automotive software from general-purpose "
        "software and that underpins standards such as ISO 26262 and AUTOSAR. I am "
        "therefore confident that I enter the programme not as a newcomer to software "
        "engineering but as a graduate already fluent in its discipline."
    )
    story.append(Paragraph(p2, body_style))

    # P3 — Supporting systems coursework + relevance to embedded / real-time pillars
    p3 = (
        "The remaining two pillars of the programme &mdash; <b>Embedded Systems</b> and "
        "<b>Real-Time and Communication Systems</b> &mdash; are equally well supported "
        "by my transcript. I completed Principles of Operating Systems (A), Computer "
        "Networks (A\u2212), Data Structures and Algorithms (A), Computer Vision "
        "(A\u2212), and Mobile Application Development (B+), building concrete "
        "familiarity with concurrency, scheduling, protocol stacks, and the "
        "sensor-and-perception pipeline that an advanced driver-assistance system "
        "depends on. Coupled with Discrete Structures (A), Applied Physics for Engineers "
        "(A), and the mathematics sequence of Calculus, Linear Algebra, and Statistics "
        "&mdash; all graded A &mdash; this background equips me to engage confidently "
        "with the embedded, real-time, and signal-processing content of the curriculum "
        "from the very first semester."
    )
    story.append(Paragraph(p3, body_style))

    # P4 — Why TU Chemnitz specifically
    p4 = (
        "I have chosen TU Chemnitz for three concrete reasons. First, the Automotive "
        "Software Engineering programme is one of very few in Europe that integrates "
        "automotive software, embedded systems, and real-time communication as a single "
        "coherent curriculum rather than as loosely connected electives. Second, "
        "Chemnitz sits at the centre of the Saxon automotive cluster &mdash; with "
        "Volkswagen, Porsche, and BMW manufacturing plants and a dense ecosystem of "
        "Tier-1 suppliers within commuting distance &mdash; offering unparalleled "
        "opportunities for industrial collaboration, mandatory internships, and the "
        "Master&rsquo;s thesis. Third, the Faculty&rsquo;s close cooperation with "
        "research institutes such as the Fraunhofer IWU and the automotive research "
        "consortium AUTOSAR gives students direct exposure to industry-standard tools "
        "and processes that are difficult to access in South Asia."
    )
    story.append(Paragraph(p4, body_style))

    # P5 — Post-MS career plan
    p5 = (
        "After completing the Master&rsquo;s programme I intend to work in Germany&rsquo;s "
        "automotive industry as an embedded software engineer, ideally in an advanced "
        "driver-assistance systems (ADAS) or autonomous-driving team at an OEM such as "
        "Volkswagen, BMW, or Audi, or at a Tier-1 supplier such as Bosch, Continental, "
        "or ZF. Germany is the global centre of automotive engineering, and the "
        "combination of rigorous formal training, mandatory industrial exposure, and "
        "proximity to leading manufacturers makes TU Chemnitz the most direct route into "
        "this career. I would welcome the opportunity to contribute professionally to the "
        "German automotive sector after graduation, and I am fully prepared to relocate "
        "to Chemnitz and to acquire working proficiency in German alongside the "
        "English-taught curriculum."
    )
    story.append(Paragraph(p5, body_style))

    # P6 — Closing (concise, single short sentence)
    p6 = (
        "I thank the Committee for its time and remain at its disposal for any further "
        "information."
    )
    story.append(Paragraph(p6, body_style))

    # ---- Closing ----
    story.append(Spacer(1, 0.1 * cm))
    story.append(Paragraph("Yours sincerely,", closing_style))
    story.append(Paragraph("Muhammad Anwar", signature_style))
    story.append(Paragraph(
        "Applicant for the M.Sc. programme Automotive Software Engineering, "
        "TU Chemnitz",
        sig_detail_style))
    story.append(Paragraph(
        "Email: muhammadanwaar537@gmail.com &nbsp;&bull;&nbsp; "
        "Phone: +92 344 4336142",
        sig_detail_style))

    return story


def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LEFT_MARGIN, rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN,
        title="Motivation Letter - Muhammad Anwar - TU Chemnitz MSc Automotive Software Engineering",
        author="Muhammad Anwar",
        subject="One-Page Motivation Letter for M.Sc. Automotive Software Engineering, TU Chemnitz",
        creator="Muhammad Anwar",
    )
    story = build_letter()
    doc.build(story, onFirstPage=draw_letterhead, onLaterPages=draw_letterhead)
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    out = "/home/z/my-project/download/Motivation_Letter_TU_Chemnitz_Automotive_SE.pdf"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build_pdf(out)
