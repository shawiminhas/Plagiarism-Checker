from reportlab.lib.pagesizes import letter, landscape  # type: ignore
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle  # type: ignore
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle  # type: ignore
from reportlab.lib import colors  # type: ignore
from reportlab.lib.units import inch  # type: ignore
import re


def generate_pdf(content: str = None, api_response: dict = None, filename: str = "plagiarism_report.pdf") -> str:
    """
    Generates a PDF report from plagiarism analysis results.

    Args:
        content (str, optional): The original text content that was analyzed for plagiarism
        api_response (dict, optional): The API response contain plagiarism analysis results.
        filename (str, optional): he filename for the generated PDF. Defaulted to "plagiarism_report.pdf"

    Returns:
        str: The filename of the generated PDF.

    Raises:
        Exception: Prints error message to console if any error occurs.
    """
    try:
        pdf = SimpleDocTemplate(filename, pagesize=landscape(letter),
                                leftMargin=0.5*inch, rightMargin=0.5*inch)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(Paragraph("<b>Plagiarism Report</b>", styles["Title"]))
        elements.append(Spacer(1, 12))

        if content and api_response and "sources" in api_response:
            highlighted_content = content

            all_sequences = []
            for source in api_response["sources"]:
                plagiarism_found = source.get("plagiarismFound", [])
                for item in plagiarism_found:
                    if "sequence" in item:
                        all_sequences.append(item["sequence"])

            all_sequences.sort(key=len, reverse=True)

            highlighted_content = (highlighted_content
                                   .replace('&', '&amp;')
                                   .replace('<', '&lt;')
                                   .replace('>', '&gt;'))

            for sequence in all_sequences:
                safe_sequence = (sequence
                                 .replace('&', '&amp;')
                                 .replace('<', '&lt;')
                                 .replace('>', '&gt;'))

                pattern = re.escape(safe_sequence)

                highlighted_content = re.sub(
                    pattern,
                    f'<font color="red"><b>{safe_sequence}</b></font>',
                    highlighted_content,
                    flags=re.IGNORECASE
                )

            elements.append(
                Paragraph("<b>Original Content:</b>", styles["Heading2"]))
            elements.append(Paragraph(highlighted_content, styles["BodyText"]))
            elements.append(Spacer(1, 12))

        if api_response and "result" in api_response:
            overall_score = api_response["result"].get(
                "score", "N/A")
            overall_score_text = f"<b>Overall Plagiarism: {overall_score}%</b>"
            elements.append(Paragraph(overall_score_text, styles["Heading3"]))
            elements.append(Spacer(1, 12))

        cell_style = styles["BodyText"].clone('CellStyle')
        cell_style.wordWrap = 'CJK'

        data = [["Matched Text", "Similarity (%)", "Source URL"]]

        if api_response and "sources" in api_response:
            for source in api_response["sources"]:
                plagiarism_found = source.get("plagiarismFound", [])
                if plagiarism_found:
                    matched_text = plagiarism_found[0].get("sequence", "N/A")
                    url = source.get("url", "N/A")

                    data.append([
                        Paragraph(matched_text, cell_style),
                        f"{source.get('score', 'N/A')}%",
                        Paragraph(url, cell_style)
                    ])

        table = Table(data, colWidths=[
                      3.5*inch, 1*inch, 3.5*inch], repeatRows=1)

        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.darkgrey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, 0), "CENTER"),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
            ("TOPPADDING", (0, 0), (-1, 0), 12),

            ("BACKGROUND", (0, 1), (-1, -1), colors.whitesmoke),
            ("TEXTCOLOR", (0, 1), (-1, -1), colors.black),
            ("ALIGN", (1, 1), (1, -1), "CENTER"),
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),

            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("LINEBELOW", (0, 0), (-1, 0), 1, colors.black),

            ("ROWBACKGROUNDS", (0, 1), (-1, -1),
             [colors.whitesmoke, colors.lightgrey]),
            ("TOPPADDING", (0, 1), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 1), (-1, -1), 8),

            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ]))

        elements.append(table)
        pdf.build(elements)
        print("PDF generated successfully!")
        return filename

    except Exception as e:
        print(f"Error generating PDF: {e}")
