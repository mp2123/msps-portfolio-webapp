import os

base_dir = "/Users/michael_s_panico/Desktop/DevBase/active_projects/MPs_Web-App_Ecosystem/apps/portfolio-app/source-material"

artifacts = {
    "tjix-net-sales-drivers": {
        "title": "TJIX Net Sales Drivers",
        "meta": "Multivariable regression",
        "color": "99,102,241",
        "textColor": "a5b4fc",
        "problem": "Needed to explain why TJX e-commerce penetration lagged peers and what levers could most credibly increase total net sales.",
        "method": "Used regression, correlation analysis, and competitor comparison to relate advertising and e-commerce growth to net-sales outcomes.",
        "impact": "Estimated ~$12.7M in net-sales lift per +$1M of advertising spend.",
        "content": """## Project Final Report & Scenario Summary\n\nBelow is the finalized reporting bundle submitted detailing the statistical models, coefficient weights, and commercial application.\n\n<div style="margin-top: 2rem; border-radius: 1rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); background-color: rgba(0,0,0,0.6);">\n  <iframe src="/artifacts/tjix-net-sales.pdf#view=FitH" style="width: 100%; height: 80vh; border: none;" title="Final Report"></iframe>\n</div>\n\n<div style="margin-top: 2rem; display: flex; justify-content: center;">\n  <a href="/artifacts/tjix-net-sales.pdf" download style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 0.5rem; background-color: white; color: black; padding: 12px 24px; font-size: 0.875rem; font-weight: 600; text-decoration: none;">\n    Download PDF\n  </a>\n</div>"""
    },
    "relational-database-design": {
        "title": "Relational Database Design",
        "meta": "Access + SQL queries",
        "color": "14,165,233",
        "textColor": "7dd3fc",
        "problem": "A growing IT support firm had outgrown shared spreadsheets, making staffing, project status, and customer support visibility hard to manage cleanly.",
        "method": "Designed normalized entities, bridge tables, business rules, metadata, and query patterns for projects, employees, clients, assets, tickets, and services.",
        "impact": "Replaced spreadsheet thinking with a relational model built for queryability, consistency, and future growth.",
        "content": """## Database Normalization Report\n\nBelow is the public-safe database methodology report showcasing ERDs and architectural schemas.\n\n<div style="margin-top: 2rem; border-radius: 1rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); background-color: rgba(0,0,0,0.6);">\n  <iframe src="/artifacts/relational-db.pdf#view=FitH" style="width: 100%; height: 80vh; border: none;" title="Relational DB Report"></iframe>\n</div>\n\n<div style="margin-top: 2rem; display: flex; justify-content: center;">\n  <a href="/artifacts/relational-db.pdf" download style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 0.5rem; background-color: white; color: black; padding: 12px 24px; font-size: 0.875rem; font-weight: 600; text-decoration: none;">\n    Download Relational ERD\n  </a>\n</div>"""
    },
    "yelp-review-modeling": {
        "title": "Yelp Review Rating / Sentiment Modeling",
        "meta": "TF-IDF + logistic regression",
        "color": "236,72,153",
        "textColor": "f9a8d4",
        "problem": "Needed a structured way to turn large volumes of review text into actionable insight about customer sentiment.",
        "method": "Applied text preprocessing, TF-IDF vectorization, VADER and FLAIR sentiment labeling, and logistic regression classification.",
        "impact": "High-accuracy sentiment classification paired with operational feedback signals a manager could act on.",
        "content": """## Sentiment Modeling Presentation\n\nBelow is the recorded presentation outlining the classification modeling and text-mining pipeline.\n\n<div style="margin-top: 2rem; border-radius: 1rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); background-color: rgba(0,0,0,0.6); padding: 8px;">\n  <video controls style="width: 100%; border-radius: 0.75rem;" src="/artifacts/yelp-presentation.mp4"></video>\n</div>"""
    },
    "spotify-modeling": {
        "title": "Spotify Popularity Prediction",
        "meta": "Regression + cross-validation",
        "color": "34,197,94",
        "textColor": "86efac",
        "problem": "Needed to understand which measurable audio features aligned most with song popularity.",
        "method": "Applied multiple linear regression, correlation analysis, outlier handling, and cross-validation-oriented model evaluation.",
        "impact": "Statistically significant regression work with feature-level interpretation instead of inflated black-box claims.",
        "content": """## Regression Feature Presentation\n\nBelow is the presentation walkthrough highlighting the multi-linear regression outcomes and feature correlations.\n\n<div style="margin-top: 2rem; border-radius: 1rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); background-color: rgba(0,0,0,0.6); padding: 8px;">\n  <video controls style="width: 100%; border-radius: 0.75rem;" src="/artifacts/spotify-presentation.mp4"></video>\n</div>"""
    },
    "ticket-routing-prediction": {
        "title": "Ticket Reassignment Prediction",
        "meta": "Adidas IT · Gradient Boosting",
        "color": "245,158,11",
        "textColor": "fcd34d",
        "problem": "IT support workflows were bleeding time through preventable reassignments and misrouted work.",
        "method": "Built a Gradient Boosting workflow around ticket urgency, service, category, and geography variables.",
        "impact": "76% accuracy, 86% recall, 73% F1, and roughly $280K in modeled annual labor savings.",
        "content": """## Classification Methodology Payload\n\nWeb browsers cannot securely render `.pptx` (PowerPoint) presentation structures directly without disrupting page flows. To view the Gradient Boosting model presentation deck, please download the raw asset locally.\n\n<div style="margin-top: 3rem; display: flex; justify-content: center; padding: 3rem; background-color: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 1rem;">\n  <a href="/artifacts/ticket-routing.pptx" download style="display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 0.5rem; background-color: white; color: black; padding: 12px 24px; font-size: 0.875rem; font-weight: 600; text-decoration: none;">\n    Download Original .PPTX\n  </a>\n</div>"""
    }
}

template = '''
<div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
  <div>
    <h1 style="font-size: 2.25rem; font-weight: bold; color: white; margin: 0; line-height: 1.2;">{title}</h1>
    <p style="color: #a1a1aa; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 8px;">{meta}</p>
  </div>
</div>

<div style="display: grid; gap: 24px; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); margin-bottom: 48px;">
  <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 20px;">
    <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; font-weight: 600; margin-bottom: 8px; margin-top: 0;">The Problem</p>
    <p style="color: #d4d4d8; font-size: 0.875rem; line-height: 1.6; margin: 0;">{problem}</p>
  </div>
  <div style="background-color: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 20px;">
    <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #71717a; font-weight: 600; margin-bottom: 8px; margin-top: 0;">The Method</p>
    <p style="color: #d4d4d8; font-size: 0.875rem; line-height: 1.6; margin: 0;">{method}</p>
  </div>
  <div style="background-color: rgba({color},0.1); border: 1px solid rgba({color},0.2); border-radius: 1rem; padding: 20px;">
    <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #{textColor}; font-weight: 600; margin-bottom: 8px; margin-top: 0;">The Impact</p>
    <p style="color: #e0e7ff; font-size: 0.875rem; line-height: 1.6; margin: 0; font-weight: 500;">{impact}</p>
  </div>
</div>

{content}
'''

for d, data in artifacts.items():
    path = os.path.join(base_dir, d, "02-sanitized", "artifact.md")
    md = template.format(**data)
    with open(path, "w") as f:
        f.write(md)
    print(f"Wrote {path}")
