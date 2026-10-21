#!/usr/bin/env python3
"""
Generate One-Page Motivation Letter PDF for RPTU MS Application
- Author: Muhammad Anwar
- Target: Mathematics for Technology and Data Science (1st preference),
          Actuarial and Financial Mathematics (2nd),
          Mathematics International (3rd)
- Constraint: MUST fit on a single A4 page
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

# ---- Fonts (Liberation Serif = Times-equivalent; Tinos broken on this system) ----
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('LibSerif', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Italic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-BoldItalic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-BoldItalic.ttf'))
registerFontFamily('LibSerif', normal='LibSerif', bold='LibSerif-Bold',
                   italic='LibSerif-Italic', boldItalic='LibSerif-BoldItalic')

# ---- Colors (formal academic) ----
NAVY = colors.HexColor('#1E3A8A')
NAVY_DARK = colors.HexColor('#172554')
TEXT_PRIMARY = colors.HexColor('#1F2937')
TEXT_MUTED = colors.HexColor('#4B5563')
BORDER = colors.HexColor('#CBD5E1')

# ---- Page geometry (tight margins to fit one page) ----
PAGE_W, PAGE_H = A4
LEFT_MARGIN = 1.9 * cm
RIGHT_MARGIN = 1.9 * cm
TOP_MARGIN = 1.4 * cm
BOTTOM_MARGIN = 1.4 * cm
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
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=8
)
subject_style = ParagraphStyle(
    'Subject', parent=styles['Normal'],
    fontName='LibSerif-Bold', fontSize=10, leading=13.5,
    textColor=NAVY_DARK, alignment=TA_LEFT, spaceAfter=8
)
salutation_style = ParagraphStyle(
    'Salutation', parent=styles['Normal'],
    fontName='LibSerif', fontSize=10, leading=13.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=5
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontName='LibSerif', fontSize=9.7, leading=13.3,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceAfter=5, firstLineIndent=0
)
closing_style = ParagraphStyle(
    'Closing', parent=styles['Normal'],
    fontName='LibSerif', fontSize=10, leading=13.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceAfter=2
)
signature_style = ParagraphStyle(
    'Signature', parent=styles['Normal'],
    fontName='LibSerif-Bold', fontSize=10.5, leading=13.5,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT, spaceBefore=14, spaceAfter=0
)
sig_detail_style = ParagraphStyle(
    'SigDetail', parent=styles['Normal'],
    fontName='LibSerif-Italic', fontSize=9, leading=12,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=0
)


def draw_letterhead(canvas, doc):
    """Slim navy band at the top, no footer (one-page letter)."""
    canvas.saveState()
    # Top thin navy band
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 0.35 * cm, PAGE_W, 0.35 * cm, fill=1, stroke=0)
    # Bottom thin band
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, 0.18 * cm, fill=1, stroke=0)
    canvas.restoreState()


def build_letter():
    story = []

    # ---- Sender block (left) and date (right), laid out as a 2-col table ----
    sender_html = (
        "<b>Muhammad Anwar</b><br/>"
        "BS Software Engineering (CGPA 3.73/4.00)<br/>"
        "COMSATS University Islamabad, Sahiwal Campus<br/>"
        "Registration No. CIIT/SP22-BSE-023/SWL<br/>"
        "Sahiwal, Pakistan"
    )
    date_html = "Sahiwal, 21 October 2026"
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
                            spaceBefore=2, spaceAfter=8))

    # ---- Recipient block ----
    recipient_html = (
        "Admissions Office<br/>"
        "Graduate School &ldquo;Mathematics as a Key Technology&rdquo;<br/>"
        "RPTU Kaiserslautern-Landau<br/>"
        "Kaiserslautern, Germany"
    )
    story.append(Paragraph(recipient_html, recipient_style))

    # ---- Subject line ----
    subject_html = (
        "<b>Subject: Application for admission to the Master programmes "
        "Mathematics for Technology and Data Science, Actuarial and Financial "
        "Mathematics, and Mathematics International &mdash; Summer Semester 2027</b>"
    )
    story.append(Paragraph(subject_html, subject_style))

    # ---- Salutation ----
    story.append(Paragraph("Dear Members of the Admissions Committee,", salutation_style))

    # ---- Body paragraphs ----
    # P1 - Introduction & primary motivation
    p1 = (
        "I am writing to apply for admission to the Master programmes offered by the "
        "Graduate School &ldquo;Mathematics as a Key Technology&rdquo; at RPTU "
        "Kaiserslautern-Landau, with <b>Mathematics for Technology and Data Science</b> "
        "as my first preference, followed by Actuarial and Financial Mathematics and "
        "Mathematics International. I hold a Bachelor of Science in Software Engineering "
        "from COMSATS University Islamabad, which I completed in January 2026 with a "
        "CGPA of 3.73 out of 4.00 over 134 credit hours, achieving the grade A in every "
        "credit-bearing mathematics course on my transcript. I now wish to redirect my "
        "academic path from software engineering towards applied and financial "
        "mathematics, and RPTU is, in my judgement, the most suitable institution in "
        "Europe at which to do so."
    )
    story.append(Paragraph(p1, body_style))

    # P2 - Why this pivot; academic preparation
    p2 = (
        "My undergraduate training combined a rigorous mathematics sequence "
        "&mdash; Calculus and Analytic Geometry (A), Linear Algebra (A), Statistics and "
        "Probability Theory (A), and Operations Research (B+) &mdash; with the "
        "algorithmic and modelling disciplines of computer science, including Discrete "
        "Structures, Data Structures and Algorithms, Formal Methods, Data Science, and "
        "Artificial Intelligence. This dual exposure has convinced me that the most "
        "consequential problems in modern finance and risk management &mdash; portfolio "
        "optimisation under uncertainty, derivative pricing, machine-learning-driven "
        "credit scoring, and the regulatory mathematics of Solvency II &mdash; sit "
        "exactly at the interface of mathematical analysis, stochastic modelling, and "
        "computation. I therefore see my software-engineering background not as a "
        "diversion from mathematics but as a complementary asset that will allow me to "
        "engage directly with the computational and data-driven side of the discipline."
    )
    story.append(Paragraph(p2, body_style))

    # P3 - Why RPTU specifically
    p3 = (
        "I have chosen RPTU Kaiserslautern-Landau for three concrete reasons. First, the "
        "Graduate School&rsquo;s explicit positioning of mathematics as a &ldquo;key "
        "technology&rdquo; reflects my own conviction that mathematics acquires its "
        "fullest meaning in dialogue with engineering, finance, and the sciences. "
        "Second, the curriculum of Mathematics for Technology and Data Science "
        "combines the core subjects of applied mathematics &mdash; numerical analysis, "
        "optimisation, and stochastics &mdash; with elective pathways in financial "
        "mathematics and data science, allowing me to construct a coherent profile at "
        "the intersection of all three programmes to which I am applying. Third, the "
        "research environment at the Fraunhofer ITWM, which is closely linked to RPTU, "
        "offers an exceptional opportunity to encounter industrial applied mathematics "
        "at first hand, an experience that is rarely available at this intensity in "
        "South Asian universities."
    )
    story.append(Paragraph(p3, body_style))

    # P4 - Post-MS plans
    p4 = (
        "On completion of the Master programme I intend to work in Germany&rsquo;s "
        "financial and insurance industry, ideally in a quantitative role &mdash; as an "
        "actuarial analyst, risk modeller, or quantitative developer &mdash; where the "
        "combination of mathematical depth and software-engineering discipline that I "
        "will have acquired at RPTU is in active demand. Germany&rsquo;s regulatory "
        "environment, its strong insurance and reinsurance sector, and the presence of "
        "institutions such as Allianz, Munich Re, and the BaFin make it the most "
        "attractive destination in Europe in which to begin such a career, and I would "
        "welcome the opportunity to contribute professionally to the German economy "
        "after graduation."
    )
    story.append(Paragraph(p4, body_style))

    # P5 - Closing
    p5 = (
        "I would be honoured to bring my academic record, my computational experience, "
        "and my motivation to RPTU Kaiserslautern-Landau, and I am fully prepared to "
        "relocate to Kaiserslautern and to engage with the programme in English while "
        "acquiring working proficiency in German. I thank the Committee for considering "
        "my application and remain at its disposal for any further information."
    )
    story.append(Paragraph(p5, body_style))

    # ---- Closing ----
    story.append(Spacer(1, 0.15 * cm))
    story.append(Paragraph("Yours sincerely,", closing_style))
    story.append(Paragraph("Muhammad Anwar", signature_style))
    story.append(Paragraph(
        "Applicant for the Master programmes of the Graduate School "
        "&ldquo;Mathematics as a Key Technology&rdquo;",
        sig_detail_style))
    story.append(Paragraph(
        "Email: anwar.applicant.rptu@example.com &nbsp;&bull;&nbsp; "
        "Phone: +92 344 4336142",
        sig_detail_style))

    return story


def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LEFT_MARGIN, rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN,
        title="Motivation Letter - Muhammad Anwar - RPTU MS Application",
        author="Muhammad Anwar",
        subject="One-Page Motivation Letter for RPTU Graduate School Application",
        creator="Muhammad Anwar",
    )
    story = build_letter()
    doc.build(story, onFirstPage=draw_letterhead, onLaterPages=draw_letterhead)
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    out = "/home/z/my-project/download/Motivation_Letter_RPTU.pdf"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build_pdf(out)
