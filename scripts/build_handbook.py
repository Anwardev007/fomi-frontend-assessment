#!/usr/bin/env python3
"""
Generate Handbook of Modules PDF for RPTU MS Application
- Short description of all mathematics courses attended during BS Software Engineering
- Author: Muhammad Anwar (CIIT/SP22-BSE-023/SWL)
"""
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, HRFlowable, Image
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ---- Font Registration ----
# Tinos files are corrupted on this system; use Liberation Serif (Times-equivalent)
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('Tinos', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Bold', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-Italic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-Italic.ttf'))
pdfmetrics.registerFont(TTFont('Tinos-BoldItalic', f'{FONT_DIR}/truetype/liberation/LiberationSerif-BoldItalic.ttf'))
registerFontFamily('Tinos', normal='Tinos', bold='Tinos-Bold', italic='Tinos-Italic', boldItalic='Tinos-BoldItalic')

pdfmetrics.registerFont(TTFont('Carlito', f'{FONT_DIR}/truetype/english/Carlito-Regular.ttf'))
pdfmetrics.registerFont(TTFont('Carlito-Bold', f'{FONT_DIR}/truetype/english/Carlito-Bold.ttf'))
registerFontFamily('Carlito', normal='Carlito', bold='Carlito-Bold')

# ---- Color palette (formal academic European) ----
NAVY = colors.HexColor('#1E3A8A')        # accent / header fill
NAVY_DARK = colors.HexColor('#172554')   # cover title
TEXT_PRIMARY = colors.HexColor('#1F2937')
TEXT_MUTED = colors.HexColor('#4B5563')
BORDER = colors.HexColor('#CBD5E1')
TABLE_STRIPE = colors.HexColor('#F1F5F9')
TABLE_HEADER = colors.HexColor('#1E3A8A')
COVER_BG = colors.HexColor('#F8FAFC')
RULE_LINE = colors.HexColor('#1E3A8A')

# ---- Page geometry ----
PAGE_W, PAGE_H = A4
LEFT_MARGIN = 2.2 * cm
RIGHT_MARGIN = 2.2 * cm
TOP_MARGIN = 2.0 * cm
BOTTOM_MARGIN = 2.0 * cm
CONTENT_W = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN

# ---- Styles ----
styles = getSampleStyleSheet()

cover_title_style = ParagraphStyle(
    'CoverTitle', parent=styles['Normal'],
    fontName='Tinos-Bold', fontSize=22, leading=28,
    textColor=NAVY_DARK, alignment=TA_CENTER, spaceAfter=10
)
cover_subtitle_style = ParagraphStyle(
    'CoverSubtitle', parent=styles['Normal'],
    fontName='Tinos', fontSize=14, leading=20,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER, spaceAfter=6
)
cover_meta_style = ParagraphStyle(
    'CoverMeta', parent=styles['Normal'],
    fontName='Tinos', fontSize=11, leading=16,
    textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=4
)
cover_label_style = ParagraphStyle(
    'CoverLabel', parent=styles['Normal'],
    fontName='Tinos-Bold', fontSize=10, leading=14,
    textColor=NAVY, alignment=TA_CENTER, spaceAfter=2
)

h1_style = ParagraphStyle(
    'H1', parent=styles['Normal'],
    fontName='Tinos-Bold', fontSize=16, leading=22,
    textColor=NAVY_DARK, alignment=TA_LEFT,
    spaceBefore=14, spaceAfter=8, keepWithNext=True
)
h2_style = ParagraphStyle(
    'H2', parent=styles['Normal'],
    fontName='Tinos-Bold', fontSize=13, leading=18,
    textColor=NAVY, alignment=TA_LEFT,
    spaceBefore=10, spaceAfter=6, keepWithNext=True
)
h3_style = ParagraphStyle(
    'H3', parent=styles['Normal'],
    fontName='Tinos-Bold', fontSize=11, leading=15,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT,
    spaceBefore=8, spaceAfter=4, keepWithNext=True
)
body_style = ParagraphStyle(
    'Body', parent=styles['Normal'],
    fontName='Tinos', fontSize=10.5, leading=15,
    textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY,
    spaceAfter=6, firstLineIndent=0
)
body_left_style = ParagraphStyle(
    'BodyLeft', parent=body_style,
    alignment=TA_LEFT
)
course_meta_style = ParagraphStyle(
    'CourseMeta', parent=styles['Normal'],
    fontName='Tinos-Italic', fontSize=10, leading=14,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=4
)
course_desc_style = ParagraphStyle(
    'CourseDesc', parent=body_style,
    spaceAfter=2, alignment=TA_JUSTIFY
)
topics_style = ParagraphStyle(
    'Topics', parent=body_style,
    fontSize=10, leading=14, textColor=TEXT_PRIMARY,
    leftIndent=10, bulletIndent=0, spaceAfter=2
)
small_note_style = ParagraphStyle(
    'SmallNote', parent=styles['Normal'],
    fontName='Tinos-Italic', fontSize=9, leading=12,
    textColor=TEXT_MUTED, alignment=TA_LEFT, spaceAfter=4
)
table_header_style = ParagraphStyle(
    'TableHeader', parent=styles['Normal'],
    fontName='Tinos-Bold', fontSize=9.5, leading=12,
    textColor=colors.white, alignment=TA_CENTER
)
table_cell_style = ParagraphStyle(
    'TableCell', parent=styles['Normal'],
    fontName='Tinos', fontSize=9.5, leading=12,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT
)
table_cell_center_style = ParagraphStyle(
    'TableCellC', parent=table_cell_style, alignment=TA_CENTER
)
footer_style = ParagraphStyle(
    'Footer', parent=styles['Normal'],
    fontName='Tinos-Italic', fontSize=8.5, leading=10,
    textColor=TEXT_MUTED, alignment=TA_CENTER
)

# ---- Header / Footer ----
def draw_page_chrome(canvas, doc):
    canvas.saveState()
    # Top rule
    canvas.setStrokeColor(NAVY)
    canvas.setLineWidth(0.6)
    canvas.line(LEFT_MARGIN, PAGE_H - 1.4 * cm, PAGE_W - RIGHT_MARGIN, PAGE_H - 1.4 * cm)
    # Header text
    canvas.setFont('Tinos-Italic', 9)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_MARGIN, PAGE_H - 1.15 * cm,
                      "Handbook of Modules - Mathematics Courses")
    canvas.drawRightString(PAGE_W - RIGHT_MARGIN, PAGE_H - 1.15 * cm,
                           "Muhammad Anwar | RPTU Application")
    # Footer rule
    canvas.setLineWidth(0.4)
    canvas.line(LEFT_MARGIN, 1.4 * cm, PAGE_W - RIGHT_MARGIN, 1.4 * cm)
    # Footer text
    canvas.setFont('Tinos-Italic', 9)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LEFT_MARGIN, 1.05 * cm,
                      "BS Software Engineering, COMSATS University Islamabad (Sahiwal Campus)")
    canvas.drawRightString(PAGE_W - RIGHT_MARGIN, 1.05 * cm, f"Page {doc.page}")
    canvas.restoreState()


def draw_cover_chrome(canvas, doc):
    """Cover page: no header/footer, just a top color bar."""
    canvas.saveState()
    # Top navy band
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 0.7 * cm, PAGE_W, 0.7 * cm, fill=1, stroke=0)
    # Bottom thin band
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, PAGE_W, 0.35 * cm, fill=1, stroke=0)
    canvas.restoreState()


# ---- Content builders ----
def build_cover():
    story = []
    story.append(Spacer(1, 2.6 * cm))
    story.append(Paragraph("HANDBOOK OF MODULES", cover_label_style))
    story.append(Paragraph("Short Description of Mathematics Courses Attended", cover_title_style))
    story.append(Spacer(1, 0.3 * cm))
    # decorative rule
    story.append(HRFlowable(width=4 * cm, thickness=1.2, color=NAVY,
                            spaceBefore=2, spaceAfter=10, hAlign='CENTER'))
    story.append(Paragraph("Submitted in support of the application for admission to",
                           cover_meta_style))
    story.append(Paragraph("the Master programmes of the Graduate School", cover_meta_style))
    story.append(Paragraph("&ldquo;Mathematics as a Key Technology&rdquo;", cover_subtitle_style))
    story.append(Spacer(1, 0.2 * cm))
    story.append(Paragraph("RPTU Kaiserslautern-Landau", cover_subtitle_style))
    story.append(Spacer(1, 0.7 * cm))

    # Programmes applied
    prog_data = [
        [Paragraph("<b>Programmes Applied For</b>", cover_meta_style)],
        [Paragraph("1. Mathematics for Technology and Data Science <i>(first preference)</i>", cover_meta_style)],
        [Paragraph("2. Actuarial and Financial Mathematics", cover_meta_style)],
        [Paragraph("3. Mathematics International", cover_meta_style)],
    ]
    prog_table = Table(prog_data, colWidths=[CONTENT_W])
    prog_table.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.6, NAVY),
        ('LINEBELOW', (0, 0), (-1, 0), 0.4, NAVY),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_STRIPE),
    ]))
    story.append(prog_table)

    story.append(Spacer(1, 0.7 * cm))

    # Applicant details
    applicant_data = [
        [Paragraph("<b>Applicant</b>", cover_meta_style),
         Paragraph("Muhammad Anwar", cover_meta_style)],
        [Paragraph("<b>Date of Birth</b>", cover_meta_style),
         Paragraph("15 October 2000", cover_meta_style)],
        [Paragraph("<b>Registration No.</b>", cover_meta_style),
         Paragraph("CIIT/SP22-BSE-023/SWL", cover_meta_style)],
        [Paragraph("<b>Bachelor Degree</b>", cover_meta_style),
         Paragraph("BS Software Engineering (Regular Mode)", cover_meta_style)],
        [Paragraph("<b>Home Institution</b>", cover_meta_style),
         Paragraph("COMSATS University Islamabad, Sahiwal Campus", cover_meta_style)],
        [Paragraph("<b>Department</b>", cover_meta_style),
         Paragraph("Department of Computer Science", cover_meta_style)],
        [Paragraph("<b>Date of Completion</b>", cover_meta_style),
         Paragraph("16 January 2026", cover_meta_style)],
        [Paragraph("<b>CGPA</b>", cover_meta_style),
         Paragraph("3.73 / 4.00 (Total Credits: 134)", cover_meta_style)],
        [Paragraph("<b>Medium of Instruction</b>", cover_meta_style),
         Paragraph("English", cover_meta_style)],
    ]
    app_table = Table(applicant_data, colWidths=[5.0 * cm, CONTENT_W - 5.0 * cm])
    app_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LINEBELOW', (0, 0), (-1, -2), 0.3, BORDER),
        ('BACKGROUND', (0, 0), (0, -1), TABLE_STRIPE),
    ]))
    story.append(app_table)

    story.append(Spacer(1, 0.8 * cm))
    story.append(Paragraph("Issue Date: March 2026", cover_meta_style))
    story.append(Spacer(1, 0.15 * cm))
    story.append(Paragraph(
        "Document prepared for submission to the Admissions Office, "
        "Graduate School &ldquo;Mathematics as a Key Technology&rdquo;, "
        "RPTU Kaiserslautern-Landau.", small_note_style))
    story.append(PageBreak())
    return story


def build_introduction():
    story = []
    story.append(Paragraph("1. Introduction and Purpose", h1_style))
    story.append(Paragraph(
        "This handbook provides a structured description of all mathematics and "
        "mathematics-intensive courses that I, Muhammad Anwar, attended and successfully "
        "completed during my four-year Bachelor of Science in Software Engineering "
        "programme at COMSATS University Islamabad (Sahiwal Campus). The document has been "
        "prepared in response to the admission requirement of the Graduate School "
        "&ldquo;Mathematics as a Key Technology&rdquo; at RPTU Kaiserslautern-Landau, "
        "which asks applicants to submit a short description of the mathematics courses "
        "they have previously attended, in the form of a handbook of modules.",
        body_style))
    story.append(Paragraph(
        "My undergraduate programme followed the standard Pakistani semester system, "
        "with two regular semesters of sixteen weeks each per academic year, supplemented "
        "by an optional eight-week summer session. The programme totalled one hundred and "
        "thirty-four (134) credit hours and was completed with a cumulative grade point "
        "average (CGPA) of <b>3.73 out of 4.00</b>. The medium of instruction throughout "
        "the programme was English. The descriptions that follow follow the conventions of "
        "a European module handbook: each module entry states the course code, title, "
        "credit hours, semester of attendance, letter grade achieved, and a short summary "
        "of the topics covered, the learning outcomes attained, and the relevance of the "
        "module to graduate-level study in mathematics.",
        body_style))
    story.append(Paragraph(
        "The handbook is organised in three parts. Section 2 presents a tabular summary "
        "of the six courses carrying an explicit <b>MTH</b> prefix, which form the core of "
        "my mathematical preparation. Section 3 provides the detailed module descriptions, "
        "including two non-credit foundation courses (MTH100 and MTH101) that I completed "
        "in addition to the regular degree requirements in order to strengthen my "
        "preparation in calculus. Section 4 then describes a set of supporting quantitative "
        "and computational courses (Applied Physics, Discrete Structures, Data Structures "
        "and Algorithms, Formal Methods, Data Science, Artificial Intelligence, and "
        "Computer Vision) whose content is heavily mathematical and which therefore "
        "complement the MTH-prefixed modules in building the analytical foundation required "
        "for the Master programmes to which I am applying. Section 5 reproduces the official "
        "grading scale and the credit-hour definition used by COMSATS University Islamabad.",
        body_style))
    return story


def build_summary_table():
    story = []
    story.append(Paragraph("2. Summary of Mathematics Courses (MTH-prefixed)", h1_style))
    story.append(Paragraph(
        "The following table lists all six courses with an <b>MTH</b> prefix that appear "
        "on my official transcript. The two foundation courses, MTH100 (Mathematics I) and "
        "MTH101 (Calculus I), were taken on a non-credit (N.C.) basis as supplementary "
        "preparation; the remaining four courses carry full credit weight and constitute "
        "the formal mathematics component of my undergraduate degree.",
        body_style))

    header = [
        Paragraph("Code", table_header_style),
        Paragraph("Course Title", table_header_style),
        Paragraph("Cr.", table_header_style),
        Paragraph("Grade", table_header_style),
        Paragraph("GP", table_header_style),
        Paragraph("Semester", table_header_style),
    ]
    rows = [
        ("MTH100", "Mathematics I (Non-Credit Foundation)", "N.C.", "Pass", "\u2013", "Preparatory"),
        ("MTH101", "Calculus I (Non-Credit Foundation)", "N.C.", "Pass", "\u2013", "Preparatory"),
        ("MTH104", "Calculus and Analytic Geometry", "3", "A", "4.00", "Spring 2023"),
        ("MTH251", "Linear Algebra", "3", "A", "4.00", "Spring 2023"),
        ("MTH262", "Statistics and Probability Theory", "3", "A", "4.00", "Fall 2023"),
        ("MTH467", "Operations Research", "3", "B+", "3.33", "Fall 2024"),
    ]
    table_data = [header]
    for r in rows:
        table_data.append([
            Paragraph(r[0], table_cell_center_style),
            Paragraph(r[1], table_cell_style),
            Paragraph(r[2], table_cell_center_style),
            Paragraph(r[3], table_cell_center_style),
            Paragraph(r[4], table_cell_center_style),
            Paragraph(r[5], table_cell_center_style),
        ])
    # Totals row
    table_data.append([
        Paragraph("<b>Total</b>", table_cell_center_style),
        Paragraph("<b>4 credited MTH courses + 2 non-credit foundations</b>", table_cell_style),
        Paragraph("<b>12</b>", table_cell_center_style),
        Paragraph("\u2013", table_cell_center_style),
        Paragraph("<b>3.78 avg</b>", table_cell_center_style),
        Paragraph("<b>2023\u20132024</b>", table_cell_center_style),
    ])

    col_widths = [1.6 * cm, 7.6 * cm, 1.1 * cm, 1.4 * cm, 1.1 * cm, 2.7 * cm]
    tbl = Table(table_data, colWidths=col_widths, repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -2), [colors.white, TABLE_STRIPE]),
        ('BACKGROUND', (0, -1), (-1, -1), TABLE_STRIPE),
        ('LINEABOVE', (0, -1), (-1, -1), 0.8, NAVY),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(Spacer(1, 0.2 * cm))
    story.append(tbl)
    story.append(Spacer(1, 0.3 * cm))
    story.append(Paragraph(
        "<i>Grading symbols: A = 4.00 (85\u2013100%), A\u2212 = 3.66 (80\u201384%), "
        "B+ = 3.33 (75\u201379%). Cr. = credit hours; GP = grade points on a 4.00 scale; "
        "N.C. = non-credit course taken for supplementary preparation.</i>",
        small_note_style))
    return story


def course_block(code, title, credits, grade, gp, semester, meta_line, description, topics):
    """Render a single course module description block."""
    elements = []
    # Heading: course code + title
    title_para = Paragraph(
        f"<b>{code} &ndash; {title}</b>", h3_style)
    meta_para = Paragraph(
        f"<b>Credits:</b> {credits} &nbsp;&nbsp;|&nbsp;&nbsp; "
        f"<b>Grade:</b> {grade} &nbsp;&nbsp;|&nbsp;&nbsp; "
        f"<b>Grade Points:</b> {gp} &nbsp;&nbsp;|&nbsp;&nbsp; "
        f"<b>Semester:</b> {semester}",
        course_meta_style)
    elements.append(KeepTogether([title_para, meta_para, Spacer(1, 2)]))
    if meta_line:
        elements.append(Paragraph(meta_line, course_meta_style))
    elements.append(Paragraph(description, course_desc_style))
    if topics:
        elements.append(Paragraph("<b>Key topics covered:</b>", course_desc_style))
        for t in topics:
            elements.append(Paragraph(f"&bull; {t}", topics_style))
    elements.append(Spacer(1, 0.35 * cm))
    return elements


def build_detailed_descriptions():
    story = []
    story.append(Paragraph("3. Detailed Module Descriptions &ndash; Mathematics Courses",
                           h1_style))
    story.append(Paragraph(
        "The following pages contain detailed module-handbook-style descriptions of the "
        "six MTH-prefixed courses. Each entry follows the structure recommended for "
        "European module handbooks: an identification block (course code, title, credits, "
        "grade, semester), a short prose description of the content and learning outcomes, "
        "and a bulleted list of the principal topics covered. The two non-credit "
        "foundation courses (MTH100, MTH101) are described first, followed by the four "
        "credit-bearing courses in chronological order.",
        body_style))

    # MTH100
    story.extend(course_block(
        "MTH100", "Mathematics I (Non-Credit Foundation Course)",
        "Non-Credit (N.C.)", "Pass", "\u2013", "Preparatory, prior to Spring 2022",
        "Type: Preparatory mathematics &nbsp;|&nbsp; "
        "Format: Lecture + Tutorial &nbsp;|&nbsp; "
        "Assessment: Continuous assessment and final examination",
        "Mathematics I was a non-credit preparatory course intended to consolidate the "
        "pre-university mathematical background of incoming students before they undertook "
        "the formal calculus and linear algebra sequence. The course rehearsed the "
        "fundamental operations of algebra, the properties of elementary functions, and "
        "the basic vocabulary of trigonometry and coordinate geometry, providing a "
        "self-contained bridge between school mathematics and the more rigorous treatment "
        "expected at university level. I completed the course successfully on a "
        "non-credit basis in order to ensure that my foundation was strong enough to "
        "tackle the subsequent credit-bearing calculus sequence with confidence.",
        ["Review of algebraic manipulation, equations, and inequalities",
         "Elementary functions: polynomial, rational, exponential, logarithmic, trigonometric",
         "Coordinate geometry in two dimensions; lines, circles, conic sections",
         "Sequences, series, and the binomial theorem",
         "Introduction to limits and the intuitive notion of continuity"]
    ))

    # MTH101
    story.extend(course_block(
        "MTH101", "Calculus I (Non-Credit Foundation Course)",
        "Non-Credit (N.C.)", "Pass", "\u2013", "Preparatory, prior to Spring 2022",
        "Type: Preparatory calculus &nbsp;|&nbsp; "
        "Format: Lecture + Tutorial &nbsp;|&nbsp; "
        "Assessment: Continuous assessment and final examination",
        "Calculus I was the second non-credit preparatory course, devoted to a first "
        "encounter with single-variable differential and integral calculus. The course "
        "introduced the formal \u03b5-\u03b4 definition of the limit, the derivative as "
        "a limit of difference quotients, and the definite integral as the limit of "
        "Riemann sums, together with the fundamental theorem of calculus that links "
        "differentiation and integration. Although the course carried no credit weight, "
        "it played a decisive role in building the analytical intuition that allowed me "
        "to achieve an A grade in the subsequent credit-bearing calculus sequence.",
        ["Limits and continuity of functions of one variable",
         "Differentiation rules; derivatives of elementary functions",
         "Applications of the derivative: optima, related rates, curve sketching",
         "The definite integral and the fundamental theorem of calculus",
         "Techniques of integration and applications to area and volume"]
    ))

    # MTH104
    story.extend(course_block(
        "MTH104", "Calculus and Analytic Geometry",
        "3", "A", "4.00", "Spring 2023 (Semester 2)",
        "Type: Core mathematics &nbsp;|&nbsp; "
        "Format: 3 credit hours (3 h lecture / week) &nbsp;|&nbsp; "
        "Assessment: Mid-term (50%) + Final examination (50%)",
        "This was the first credit-bearing calculus course of my programme and covered "
        "single-variable and multivariable calculus together with the elements of analytic "
        "geometry. The course developed the differential and integral calculus of "
        "functions of one and several variables, the geometry of curves and surfaces in "
        "two and three dimensions, and the basic theory of infinite series. The grade "
        "achieved was A, corresponding to a percentage of 85% or above and to a grade "
        "point of 4.00. The conceptual maturity acquired in this course underpinned my "
        "later work in optimisation, probability, and machine learning.",
        ["Functions of several variables; partial derivatives; the chain rule",
         "Directional derivatives, gradients, and tangent planes",
         "Multiple integrals (double and triple); change of variables",
         "Vector calculus: line and surface integrals; the theorems of Green, Gauss, and Stokes",
         "Infinite sequences and series; power series; Taylor and Maclaurin expansions",
         "Conic sections and the geometry of quadric surfaces"]
    ))

    # MTH251
    story.extend(course_block(
        "MTH251", "Linear Algebra",
        "3", "A", "4.00", "Spring 2023 (Semester 2)",
        "Type: Core mathematics &nbsp;|&nbsp; "
        "Format: 3 credit hours (3 h lecture / week) &nbsp;|&nbsp; "
        "Assessment: Mid-term (50%) + Final examination (50%)",
        "Linear Algebra introduced the algebraic structures that pervade modern applied "
        "mathematics, statistics, and computational finance. The course covered linear "
        "systems, matrices, determinants, vector spaces, linear transformations, "
        "eigenvalues and eigenvectors, and inner product spaces, with regular reference "
        "to applications in computer graphics, network analysis, and statistical "
        "modelling. The course was completed with the grade A (grade point 4.00). The "
        "matrix-algebraic way of thinking acquired here is, in my view, the single most "
        "important prerequisite for the Actuarial and Financial Mathematics and "
        "Mathematics for Technology and Data Science programmes at RPTU.",
        ["Linear systems and Gaussian elimination; matrix algebra and inverses",
         "Determinants and their properties; Cramer&rsquo;s rule",
         "Vector spaces and subspaces; linear independence; basis and dimension",
         "Linear transformations; kernel and image; the rank\u2013nullity theorem",
         "Eigenvalues, eigenvectors, and diagonalisation; symmetric and orthogonal matrices",
         "Inner product spaces; Gram\u2013Schmidt orthogonalisation; least-squares approximation"]
    ))

    # MTH262
    story.extend(course_block(
        "MTH262", "Statistics and Probability Theory",
        "3", "A", "4.00", "Fall 2023 (Semester 3)",
        "Type: Core mathematics &nbsp;|&nbsp; "
        "Format: 3 credit hours (3 h lecture / week) &nbsp;|&nbsp; "
        "Assessment: Mid-term (50%) + Final examination (50%)",
        "This course provided a rigorous introduction to probability theory and "
        "mathematical statistics, building on the calculus and linear algebra of the "
        "previous year. The probability component covered the axiomatic foundations, "
        "discrete and continuous random variables, joint and conditional distributions, "
        "and the law of large numbers and the central limit theorem. The statistics "
        "component treated point and interval estimation, hypothesis testing, and an "
        "introduction to linear regression. The course was completed with the grade A "
        "(grade point 4.00). This module is the natural prerequisite for the stochastic "
        "processes, risk theory, and financial mathematics courses that form the core of "
        "the Actuarial and Financial Mathematics programme at RPTU.",
        ["Axioms of probability; conditional probability and Bayes&rsquo; theorem",
         "Discrete and continuous random variables; standard distributions",
         "Joint distributions; covariance, correlation, and independence",
         "Law of large numbers and the central limit theorem",
         "Point and interval estimation; properties of estimators",
         "Hypothesis testing; type I and type II errors; p-values",
         "Simple and multiple linear regression; analysis of residuals"]
    ))

    # MTH467
    story.extend(course_block(
        "MTH467", "Operations Research",
        "3", "B+", "3.33", "Fall 2024 (Semester 5)",
        "Type: Applied mathematics &nbsp;|&nbsp; "
        "Format: 3 credit hours (3 h lecture / week) &nbsp;|&nbsp; "
        "Assessment: Mid-term (50%) + Final examination (50%)",
        "Operations Research introduced the principal mathematical models and methods "
        "of constrained optimisation, with explicit reference to decision-making in "
        "industry, finance, and the public sector. The course covered linear programming "
        "and the simplex method, duality and sensitivity analysis, the transportation and "
        "assignment problems, integer programming, network optimisation, and an "
        "introduction to dynamic programming and queuing models. The course was completed "
        "with the grade B+ (grade point 3.33). This module is particularly relevant to the "
        "Mathematics for Technology and Data Science programme, in which optimisation "
        "plays a central role, and to the Actuarial and Financial Mathematics programme, "
        "where optimisation underpins portfolio selection and risk-budget allocation.",
        ["Linear programming: formulation, graphical solution, the simplex method",
         "Duality theory and economic interpretation of dual variables",
         "Sensitivity and post-optimality analysis",
         "Transportation, transhipment, and assignment problems",
         "Network models: shortest path, maximum flow, minimum spanning tree",
         "Integer and mixed-integer programming; branch-and-bound",
         "Dynamic programming and Markov decision processes; introduction to queuing theory"]
    ))

    return story


def build_supporting_courses():
    story = []
    story.append(PageBreak())
    story.append(Paragraph("4. Supporting Quantitative and Computational Courses",
                           h1_style))
    story.append(Paragraph(
        "In addition to the six MTH-prefixed courses described above, my undergraduate "
        "programme contained a number of courses in physics, theoretical computer "
        "science, and data-driven computing whose mathematical content is substantial. "
        "These courses developed my fluency with mathematical reasoning in settings "
        "outside a pure mathematics classroom and are therefore directly relevant to "
        "graduate study in applied mathematics. The descriptions below focus "
        "specifically on the mathematical content of each course.",
        body_style))

    supporting = [
        ("PHY121", "Applied Physics for Engineers",
         "4 cr.", "A", "Spring 2022",
         "Covered mechanics, oscillations and waves, electromagnetism, and an "
         "introduction to quantum phenomena, with a strong emphasis on the differential "
         "and integral calculus used to formulate physical laws. The course reinforced "
         "my fluency with vector calculus, ordinary differential equations, and the "
         "modelling of physical systems."),
        ("CSC102", "Discrete Structures",
         "3 cr.", "A", "Fall 2022",
         "An introduction to the discrete mathematics that underpins computer science: "
         "propositional and predicate logic, set theory, relations and functions, "
         "combinatorics, graph theory, and modular arithmetic. The course developed "
         "rigorous proof skills and the algebraic vocabulary that recurs in cryptography, "
         "coding theory, and algorithm analysis."),
        ("CSC211", "Data Structures and Algorithms",
         "4 cr.", "A", "Fall 2023",
         "Studied the design and analysis of algorithms with explicit reference to "
         "asymptotic complexity (Big-O, Big-&Theta;, Big-&Omega; notation), recurrence "
         "relations, and amortised analysis. Mathematical content includes the "
         "master theorem, graph algorithms (DFS, BFS, Dijkstra, Kruskal, Prim), "
         "dynamic programming, and greedy algorithms."),
        ("CSE356", "Formal Methods",
         "3 cr.", "A", "Spring 2024",
         "An introduction to the use of mathematical logic and discrete mathematics for "
         "the specification and verification of software systems. Topics included "
         "propositional and first-order logic, model checking, temporal logics (LTL and "
         "CTL), and the use of formal specification languages. The course required "
         "constructing rigorous mathematical proofs and reasoning about program "
         "correctness."),
        ("CSC461", "Introduction to Data Science",
         "3 cr.", "A", "Spring 2024",
         "Covered the mathematical and computational foundations of data-driven "
         "modelling: matrix decomposition (SVD, PCA), linear and logistic regression "
         "from a likelihood perspective, cross-validation, regularisation, and the "
         "bias\u2013variance trade-off. The course made extensive use of multivariable "
         "calculus, linear algebra, and probability theory."),
        ("CSC462", "Artificial Intelligence",
         "4 cr.", "A\u2212", "Fall 2024",
         "A mathematically-oriented treatment of artificial intelligence, including "
         "search algorithms, constraint satisfaction, Markov decision processes, "
         "Bayesian networks, and an introduction to statistical learning. The course "
         "applied dynamic programming, probability theory, and linear algebra to "
         "questions of inference and decision-making under uncertainty."),
        ("CSC455", "Computer Vision",
         "3 cr.", "A\u2212", "Fall 2025",
         "Covered the mathematical foundations of image processing and computer vision, "
         "including linear filtering in the spatial and frequency domains, the Fourier "
         "transform, edge detection, camera geometry and projective transformations, "
         "and the use of singular value decomposition in structure-from-motion. The "
         "course relied heavily on linear algebra and multivariable calculus."),
    ]

    for code, title, cr, grade, sem, desc in supporting:
        head = Paragraph(f"<b>{code} &ndash; {title}</b>", h3_style)
        meta = Paragraph(
            f"<b>Credits:</b> {cr} &nbsp;|&nbsp; <b>Grade:</b> {grade} "
            "&nbsp;|&nbsp; <b>Semester:</b> " + sem,
            course_meta_style)
        body = Paragraph(desc, course_desc_style)
        story.append(KeepTogether([head, meta, Spacer(1, 2), body, Spacer(1, 0.25 * cm)]))

    return story


def build_grading_section():
    story = []
    story.append(PageBreak())
    story.append(Paragraph("5. Grading Scale, Credit-Hour Definition and Academic Standing",
                           h1_style))
    story.append(Paragraph(
        "The following information is reproduced from the official transcript issued by "
        "COMSATS University Islamabad and explains the grading and credit-hour conventions "
        "used throughout this handbook.",
        body_style))

    story.append(Paragraph("5.1 Grading Scale", h2_style))
    story.append(Paragraph(
        "Each course is assessed on a scale of 100 marks, of which 50% are reserved for "
        "continuous assessment (mid-term examinations, quizzes, assignments, and "
        "laboratory work) and 50% for the terminal examination. The minimum pass mark in "
        "any course is 50%. Marks are converted to letter grades and grade points "
        "according to the following scale, which is reproduced verbatim from my "
        "transcript.",
        body_style))

    grade_header = [
        Paragraph("Percentage", table_header_style),
        Paragraph("Letter Grade", table_header_style),
        Paragraph("Grade Points", table_header_style),
        Paragraph("Percentage", table_header_style),
        Paragraph("Letter Grade", table_header_style),
        Paragraph("Grade Points", table_header_style),
    ]
    grade_rows = [
        ("85 and above", "A", "4.00", "61 \u2013 63", "C", "2.00"),
        ("80 \u2013 84", "A\u2212", "3.66", "58 \u2013 60", "C\u2212", "1.66"),
        ("75 \u2013 79", "B+", "3.33", "54 \u2013 57", "D+", "1.30"),
        ("71 \u2013 74", "B", "3.00", "50 \u2013 53", "D", "1.00"),
        ("68 \u2013 70", "B\u2212", "2.66", "Below 50", "F", "0.00"),
        ("64 \u2013 67", "C+", "2.33", "", "", ""),
    ]
    table_data = [grade_header]
    for r in grade_rows:
        table_data.append([
            Paragraph(r[0], table_cell_center_style),
            Paragraph(r[1], table_cell_center_style),
            Paragraph(r[2], table_cell_center_style),
            Paragraph(r[3], table_cell_center_style),
            Paragraph(r[4], table_cell_center_style),
            Paragraph(r[5], table_cell_center_style),
        ])
    col_widths = [3.0 * cm, 2.2 * cm, 2.4 * cm, 3.0 * cm, 2.2 * cm, 2.4 * cm]
    tbl = Table(table_data, colWidths=col_widths, repeatRows=1)
    tbl.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, TABLE_STRIPE]),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(Spacer(1, 0.2 * cm))
    story.append(tbl)
    story.append(Spacer(1, 0.3 * cm))

    story.append(Paragraph("5.2 Credit-Hour Definition", h2_style))
    story.append(Paragraph(
        "Following the standard convention of the Higher Education Commission of "
        "Pakistan, one credit hour corresponds to one hour of lecture per week over a "
        "sixteen-week semester, or equivalently to three hours of laboratory work per "
        "week over the same period. A typical three-credit course therefore represents "
        "approximately forty-eight contact hours of instruction in a regular semester, "
        "in addition to independent study. The COMSATS semester is sixteen weeks long, "
        "with an optional eight-week summer session that follows the same weekly load.",
        body_style))

    story.append(Paragraph("5.3 Academic Standing", h2_style))
    story.append(Paragraph(
        "Over the course of my four-year Bachelor of Science in Software Engineering "
        "programme I registered for a total of <b>134 credit hours</b> and passed all "
        "of them, accumulating a total of <b>499.67 credit points</b> and achieving a "
        "<b>cumulative grade point average (CGPA) of 3.73 out of 4.00</b>. Within the "
        "mathematics component specifically, I obtained the grade A (4.00) in Calculus "
        "and Analytic Geometry, Linear Algebra, and Statistics and Probability Theory, "
        "and the grade B+ (3.33) in Operations Research, giving an average grade point "
        "of approximately 3.83 across the four credit-bearing MTH courses. This record "
        "demonstrates a consistent level of academic excellence in mathematics that I "
        "intend to build upon at the Graduate School &ldquo;Mathematics as a Key "
        "Technology&rdquo; of RPTU Kaiserslautern-Landau.",
        body_style))

    story.append(Spacer(1, 0.6 * cm))
    story.append(HRFlowable(width=CONTENT_W, thickness=0.4, color=BORDER, spaceBefore=4, spaceAfter=8))
    story.append(Paragraph(
        "<i>This handbook has been prepared by the applicant on the basis of his "
        "official transcript issued by COMSATS University Islamabad, attested by the "
        "Higher Education Commission of Pakistan (Regional Centre, Lahore) on 4 May 2026. "
        "The original transcript is submitted separately as part of the application "
        "package.</i>",
        small_note_style))
    return story


# ---- Main ----
def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=LEFT_MARGIN, rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN, bottomMargin=BOTTOM_MARGIN,
        title="Handbook of Modules - Mathematics Courses (Muhammad Anwar)",
        author="Muhammad Anwar",
        subject="Short Description of Mathematics Courses - RPTU MS Application",
        creator="Muhammad Anwar",
    )

    story = []
    # Cover (use first page template without header/footer)
    story.extend(build_cover())
    # Body
    story.extend(build_introduction())
    story.extend(build_summary_table())
    story.extend(build_detailed_descriptions())
    story.extend(build_supporting_courses())
    story.extend(build_grading_section())

    # We use a single template; cover_chrome is drawn on page 1 only via onFirstPage
    doc.build(story, onFirstPage=draw_cover_chrome, onLaterPages=draw_page_chrome)
    print(f"Generated: {output_path}")


if __name__ == "__main__":
    out = "/home/z/my-project/download/Handbook_of_Modules_Mathematics_Courses.pdf"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build_pdf(out)
