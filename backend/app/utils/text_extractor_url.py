import re
import requests
from bs4 import BeautifulSoup, Tag, NavigableString


def extract_text(url: str):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text
        soup = BeautifulSoup(html_content, 'html.parser')
    except Exception as e:
        return {'error': str(e)}
    faqs = ""

    # Strategy 1: Details/Summary elements
    for details in soup.find_all('details'):
        summary = details.find('summary')
        if summary:
            question = clean_text(summary.get_text())
            answer_parts = []
            for elem in details.children:
                if elem != summary and hasattr(elem, 'get_text'):
                    answer_parts.append(clean_text(elem.get_text()))
            answer = ' '.join(filter(None, answer_parts))
            if question and answer:
                faqs += f"{question} {answer}\n"

    # Strategy 2: Bootstrap accordions
    accordion_selectors = ['.accordion', '[class*="accordion"]', '.collapse', '[data-bs-toggle="collapse"]',
                           '[data-toggle="collapse"]']
    for selector in accordion_selectors:
        for element in soup.select(selector):
            question_elem = element.find('button') or element.find('.accordion-button') or element.find(
                'h1, h2, h3, h4, h5, h6')
            if question_elem:
                question = clean_text(question_elem.get_text())
                answer_elem = element.find('.collapse') or element.find('.panel-body') or element.find('.card-body')
                if answer_elem:
                    answer = clean_text(answer_elem.get_text())
                    if question and answer:
                        faqs += f"{question} {answer}\n"

    # Strategy 3: Header-based questions
    for header in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
        question = clean_text(header.get_text())
        if '?' in question:
            answer_parts = []
            current = header.next_sibling
            count = 0
            while current and count < 3:
                if hasattr(current, 'name') and current.name in ['p', 'div', 'span', 'ul', 'ol']:
                    text = clean_text(current.get_text())
                    if text:
                        answer_parts.append(text)
                elif hasattr(current, 'name') and current.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
                    break
                current = current.next_sibling
                count += 1
            answer = ' '.join(answer_parts)
            if question and answer:
                faqs += f"{question} {answer}\n"

    # Strategy 4: Button-based sections
    for button in soup.find_all('button'):
        question = clean_text(button.get_text())
        if '?' in question:
            answer = None
            target_id = button.get('data-target', '').lstrip('#') or button.get('aria-controls', '')
            if target_id:
                target_elem = soup.find(id=target_id)
                if target_elem:
                    answer = clean_text(target_elem.get_text())
            if not answer:
                next_elem = button.find_next_sibling()
                if next_elem:
                    answer = clean_text(next_elem.get_text())
            if question and answer:
                faqs += f"{question} {answer}\n"

    # Strategy 5: Class-based selectors
    class_patterns = ['faq', 'question', 'accordion', 'expandable', 'toggle']
    for pattern in class_patterns:
        for container in soup.find_all(attrs={'class': re.compile(pattern, re.I)}):
            question_elems = container.find_all(attrs={'class': re.compile('question|title|header', re.I)})
            for q_elem in question_elems:
                question = clean_text(q_elem.get_text())
                if question:
                    answer_elem = (q_elem.find_next_sibling(attrs={'class': re.compile('answer|content|body', re.I)}) or
                                   container.find(attrs={'class': re.compile('answer|content|body', re.I)}))
                    if answer_elem:
                        answer = clean_text(answer_elem.get_text())
                        if question and answer:
                            faqs += f"{question} {answer}\n"

    # Strategy 6: Generic pattern matching
    for text_node in soup.find_all(string=re.compile(r'\?')):
        if isinstance(text_node, NavigableString):
            parent = text_node.parent
            if parent and parent.name:
                question = clean_text(text_node)
                if '?' in question and len(question) > 5:
                    answer = None
                    current = parent.next_sibling
                    attempts = 0
                    while current and attempts < 2:
                        if hasattr(current, 'get_text'):
                            text = clean_text(current.get_text())
                            if text and len(text) > 10 and '?' not in text:
                                answer = text
                                break
                        current = current.next_sibling
                        attempts += 1
                    if question and answer:
                        faqs += f"{question} {answer}\n"

    return faqs


def clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text.strip())
    text = re.sub(r'^(Show|Hide|Toggle|Click|Expand|Collapse)\s*', '', text, flags=re.I)
    return text.strip()

