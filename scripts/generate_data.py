"""Generate synthetic data for the product-delivery-dashboard portfolio repo.

Fictional company: Northstar AI, which sells AI agents to financial institutions.
Every name, client, deal and ticket here is invented.
"""
import json, random, sys, os
from datetime import date, timedelta

random.seed(20261028)
out = sys.argv[1]
os.makedirs(out, exist_ok=True)

TODAY = date(2026, 10, 28)
QUARTERS = ['Q4 2026', 'Q1 2027', 'Q2 2027', 'Q3 2027']
Q_END = {'Q4 2026': date(2026, 12, 31), 'Q1 2027': date(2027, 3, 31),
         'Q2 2027': date(2027, 6, 30), 'Q3 2027': date(2027, 9, 30)}
PRODUCTS = ['Platform (All Products)', 'Atlas Reconciliation', 'Beacon Document AI',
            'Compass Analytics', 'Harbor Settlements', 'Relay Email Triage']
CLIENTS = ['Northwind Bank', 'Contoso Credit Union', 'Fabrikam Insurance', 'Tailspin Capital',
           'Woodgrove Trust', 'Litware Securities', 'Adatum Asset Management']
ENGINEERS = ['Priya S.', 'Tomas R.', 'Lena K.', 'Omar F.', 'Grace L.', 'Ivan P.', 'Aiko M.', 'Sam D.']
AES = ['Maya Chen', 'Daniel Okafor', 'Sofia Marquez']
TEAMS = ['Backend', 'ML Platform', 'Frontend', 'Data Engineering', 'Multiple Teams']
SIZES = [('S-Small 2wks', 2), ('M-Medium 4wks', 4), ('L-Large 8wks', 8), ('XL-Extra Large 12wks+', 12)]

# (name, product, category, platform_vs_custom, primary_client)
FEATURES = [
    ('LLM extraction for scanned confirmations', 'Beacon Document AI', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Break auto-resolution for cash reconciliation', 'Atlas Reconciliation', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('SSO and SCIM provisioning', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Multiple'),
    ('Audit trail export for regulators', 'Platform (All Products)', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Settlement fail prediction', 'Harbor Settlements', 'Platform Improvements', 'Platform Enhancement', 'Litware Securities'),
    ('Custom GL mapping for Northwind', 'Atlas Reconciliation', 'Client-Specific Work', 'Client-Specific', 'Northwind Bank'),
    ('Claims email triage pilot', 'Relay Email Triage', 'Client-Specific Work', 'Client-Specific', 'Fabrikam Insurance'),
    ('Human-in-the-loop review queue', 'Platform (All Products)', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Model evaluation harness', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Internal'),
    ('Prompt injection guardrails', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Multiple'),
    ('Executive KPI pack', 'Compass Analytics', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Exception aging report', 'Compass Analytics', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Standing instruction validation', 'Harbor Settlements', 'Platform Improvements', 'Platform Enhancement', 'Woodgrove Trust'),
    ('Member correspondence classifier', 'Relay Email Triage', 'Client-Specific Work', 'Client-Specific', 'Contoso Credit Union'),
    ('Multi-entity ledger support', 'Atlas Reconciliation', 'Platform Improvements', 'Both', 'Tailspin Capital'),
    ('Public REST API v2', 'Platform (All Products)', 'API Development', 'Platform Enhancement', 'Multiple'),
    ('Webhook event stream', 'Platform (All Products)', 'API Development', 'Platform Enhancement', 'Multiple'),
    ('Data residency in Canada region', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Multiple'),
    ('Table extraction accuracy uplift', 'Beacon Document AI', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Corporate action notice parsing', 'Beacon Document AI', 'Client-Specific Work', 'Client-Specific', 'Adatum Asset Management'),
    ('Reconciliation rules builder UI', 'Atlas Reconciliation', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Cost per task metering', 'Compass Analytics', 'Platform Improvements', 'Platform Enhancement', 'Internal'),
    ('SOC 2 evidence automation', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Internal'),
    ('Fix duplicate alerts on retries', 'Platform (All Products)', 'Bug Fixes', 'Platform Enhancement', 'Multiple'),
    ('Fix timezone drift in cutoffs', 'Harbor Settlements', 'Bug Fixes', 'Platform Enhancement', 'Litware Securities'),
    ('Northwind data migration', 'Atlas Reconciliation', 'Client-Specific Work', 'Client-Specific', 'Northwind Bank'),
    ('Model routing for cost control', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Internal'),
    ('Agent run replay and debugging', 'Platform (All Products)', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Underwriting document pack', 'Beacon Document AI', 'Client-Specific Work', 'Client-Specific', 'Fabrikam Insurance'),
    ('Trust account statement matching', 'Atlas Reconciliation', 'Client-Specific Work', 'Client-Specific', 'Woodgrove Trust'),
    ('Role-based access by desk', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Multiple'),
    ('Email reply drafting', 'Relay Email Triage', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Benchmark dashboard for clients', 'Compass Analytics', 'Platform Improvements', 'Platform Enhancement', 'Multiple'),
    ('Retry and dead-letter handling', 'Platform (All Products)', 'Core Infrastructure', 'Platform Enhancement', 'Internal'),
    ('Fix PDF page order on upload', 'Beacon Document AI', 'Bug Fixes', 'Platform Enhancement', 'Multiple'),
    ('Settlement netting simulator', 'Harbor Settlements', 'Platform Improvements', 'Platform Enhancement', 'Tailspin Capital'),
]

def score(arr, repl, conv, effort):
    if effort == 0:
        return 0
    return round((arr / 1000) * repl * (conv / 100) / effort / 3, 1)

def tier(risk, s):
    if risk == 'YES':
        return 'Tier 0: Emergency'
    if s >= 100: return 'Tier 1: Fast Track'
    if s >= 50: return 'Tier 2: Standard Delivery'
    if s >= 10: return 'Tier 3: Custom Engagement'
    return 'Tier 4: Backlog'

features = []
for i, (name, prod, cat, pvc, client) in enumerate(FEATURES, start=1):
    fid = f'F-{i:03d}'
    q = QUARTERS[min(3, i * 4 // len(FEATURES))] if i > 3 else 'Q4 2026'
    size_label, effort = random.choice(SIZES)
    if cat == 'Bug Fixes':
        size_label, effort = SIZES[0]
    repl = 5 if pvc == 'Platform Enhancement' else (3 if pvc == 'Both' else random.choice([1, 2]))
    if client == 'Internal':
        arr, conv = 0, 0
    elif client == 'Multiple':
        arr = random.choice([150, 200, 250, 300, 400, 450, 600]) * 1000
        conv = random.choice([40, 50, 60, 70])
    else:
        arr = random.choice([180, 240, 320, 450, 520, 750]) * 1000
        conv = random.choice([60, 75, 90, 100])
    risk = 'YES' if name in ('Fix timezone drift in cutoffs', 'Northwind data migration') else ''
    s = score(arr, repl, conv, effort)
    if cat == 'Core Infrastructure' and arr == 0:
        s = round(random.uniform(12, 40), 1)
    if q == 'Q4 2026':
        status = random.choice(['In Progress', 'In Progress', 'Completed', 'Completed', 'Blocked'])
    elif q == 'Q1 2027':
        status = random.choice(['In Progress', 'In Progress', 'Blocked', 'Not Started'])
    else:
        status = 'Not Started'
    if risk:
        status = 'In Progress'
        q = 'Q4 2026'
    comp = {'Completed': 100, 'In Progress': random.choice([20, 35, 50, 65, 80]),
            'Blocked': random.choice([30, 45]), 'Not Started': 0}[status]
    start = Q_END[q] - timedelta(days=88)
    close = (Q_END[q] - timedelta(days=random.randint(0, 40))) if arr else None
    features.append({
        'Feature_ID': fid, 'Feature_Name': name, 'Agent_Type': prod, 'Category': cat,
        'Quarter_Planned': q, 'Replicability_Score': repl, 'Primary_Client': client,
        'Additional_Clients': ', '.join(random.sample([c for c in CLIENTS if c != client], 2)) if client == 'Multiple' else '',
        'Platform_vs_Custom': pvc, 'ARR_Amount': arr,
        'Revenue_Type': ('Retention/Risk of Loss' if risk else ('New Contract' if pvc != 'Platform Enhancement' else 'Expansion')) if arr else '',
        'Contract_Status': ('Signed' if conv == 100 else 'In Negotiation') if arr else '',
        'Pipeline_Stage': ('Closed Won' if conv == 100 else random.choice(['Proposal', 'POC', 'Contract Negotiation'])) if arr else '',
        'Conversion_Probability': conv, 'Current_Status': status, 'Completion_Percent': comp,
        'Target_Completion_Date': Q_END[q].isoformat(), 'Effort_Estimate_Weeks': effort,
        'Revenue_at_Risk': risk, 'Priority_Score': s,
        'Engineering_Notes': {'Blocked': 'Waiting on client test environment access.',
                              'In Progress': 'On track for the planned sprint.',
                              'Completed': 'Shipped and monitored for two weeks.'}.get(status, ''),
        'Management_Notes': 'Contract renewal depends on this fix.' if risk else '',
        'Client_Count': len(CLIENTS) if client == 'Multiple' else 1,
        'Deal_Close_Date': close.isoformat() if close else '',
        'Days_to_Close': max(0, (close - TODAY).days) if close else 0,
        'Multi_Client_Benefit': 'Yes' if client == 'Multiple' else 'No',
        'Effort_T_Shirt_Size': size_label,
        'Engineering_Complexity': {2: 'Low', 4: 'Medium', 8: 'High', 12: 'High'}[effort],
        'Dependencies': random.choice(['', '', 'SSO and SCIM provisioning', 'Public REST API v2', 'Model evaluation harness']),
        'Team_Required': random.choice(TEAMS), 'Priority_Tier': tier(risk, s),
        'Revenue_Impact_Type': 'Negative (Risk of Loss)' if risk else ('Positive (New Revenue)' if arr else 'Neutral (Internal/Platform)'),
        'Weighted_ARR': round(arr * conv / 100), 'Assigned_To': random.choice(ENGINEERS) if status != 'Not Started' else '',
        'Sprint_Assignment': f'Sprint {random.randint(41, 46)}' if status in ('In Progress', 'Blocked') else '',
        'JIRA_Ticket_Count': 0, 'Created_Date': (start - timedelta(days=random.randint(20, 90))).isoformat(),
        'Target_Start_Date': start.isoformat(),
        'Sales_Notes': 'Expansion tied to this release.' if arr and pvc != 'Platform Enhancement' else '',
        'Manual_Override': '', 'Manual_Override_Score': 0,
    })

TICKET_VERBS = ['Implement', 'Add tests for', 'Design', 'Refactor', 'Document', 'Spike on', 'Wire up', 'Load test']
tickets = []
n = 101
for f in features:
    k = random.randint(3, 7)
    for _ in range(k):
        if f['Current_Status'] == 'Completed':
            st = 'Done'
        elif f['Current_Status'] == 'Blocked':
            st = random.choice(['Blocked', 'Blocked', 'In Progress'])
        elif f['Current_Status'] == 'In Progress':
            st = random.choice(['To Do', 'In Progress', 'In Progress', 'Code Review', 'Done'])
        else:
            st = 'To Do'
        size = random.choice(['S', 'M', 'M', 'L', 'XL'])
        tickets.append({
            'JIRA_Ticket_ID': f'NS-{n}', 'Title': f"{random.choice(TICKET_VERBS)} {f['Feature_Name'].lower()}",
            'Status': st, 'Category': f['Category'],
            'Client_Name': f['Primary_Client'], 'Effort_T_Shirt_Size': size,
            'Story_Points': {'S': 2, 'M': 5, 'L': 8, 'XL': 13}[size], 'Mapped_Feature_ID': f['Feature_ID'],
        })
        n += 1
    f['JIRA_Ticket_Count'] = k

STAGES = [('Introduction', 10), ('Qualification', 25), ('Proposal', 40), ('POC', 60),
          ('Contract Negotiation', 80), ('Closed Won', 100)]
OPPS = [
    ('Northwind Bank', 'Atlas Reconciliation', 'Northwind reconciliation expansion', 5),
    ('Northwind Bank', 'Beacon Document AI', 'Northwind document AI pilot', 3),
    ('Contoso Credit Union', 'Relay Email Triage', 'Contoso member email triage', 4),
    ('Fabrikam Insurance', 'Relay Email Triage', 'Fabrikam claims inbox automation', 3),
    ('Fabrikam Insurance', 'Beacon Document AI', 'Fabrikam underwriting packs', 2),
    ('Tailspin Capital', 'Atlas Reconciliation', 'Tailspin multi-entity rollout', 4),
    ('Tailspin Capital', 'Harbor Settlements', 'Tailspin netting simulator', 1),
    ('Woodgrove Trust', 'Atlas Reconciliation', 'Woodgrove trust account matching', 5),
    ('Woodgrove Trust', 'Harbor Settlements', 'Woodgrove instruction validation', 2),
    ('Litware Securities', 'Harbor Settlements', 'Litware settlement fail prediction', 3),
    ('Litware Securities', 'Compass Analytics', 'Litware benchmark dashboards', 0),
    ('Adatum Asset Management', 'Beacon Document AI', 'Adatum corporate action parsing', 4),
    ('Adatum Asset Management', 'Compass Analytics', 'Adatum executive KPI pack', 1),
    ('Contoso Credit Union', 'Platform (All Products)', 'Contoso platform renewal', 5),
    ('Northwind Bank', 'Platform (All Products)', 'Northwind enterprise renewal', 5),
    ('Fabrikam Insurance', 'Compass Analytics', 'Fabrikam cost per task reporting', 0),
    ('Tailspin Capital', 'Relay Email Triage', 'Tailspin client service inbox', 2),
    ('Woodgrove Trust', 'Platform (All Products)', 'Woodgrove Canada region expansion', 3),
]
opps = []
for i, (acct, prod, name, stage_i) in enumerate(OPPS, start=1):
    stage, prob = STAGES[stage_i]
    arr = random.choice([120, 180, 240, 300, 360, 450, 600, 850]) * 1000
    mapped = [f['Feature_ID'] for f in features if f['Agent_Type'] == prod and f['Primary_Client'] in (acct, 'Multiple')][:2]
    created = TODAY - timedelta(days=random.randint(40, 220))
    close = TODAY + timedelta(days=random.randint(-30, 160)) if stage != 'Closed Won' else TODAY - timedelta(days=random.randint(5, 60))
    opps.append({
        'Opportunity_ID': f'OPP-{i:03d}', 'Opportunity_Name': name, 'Account_Name': acct,
        'Stage': stage, 'ARR_Value': arr, 'Close_Date': close.isoformat(), 'Probability': prob,
        'Owner': random.choice(AES), 'Agent_Type': prod, 'Mapped_Feature_ID': ', '.join(mapped),
        'Status': 'Renewal' if 'renewal' in name else ('At Risk' if i == 15 else ('Early Stage' if stage_i <= 1 else 'Active')),
        'Created_Date': created.isoformat(),
        'Last_Activity_Date': (TODAY - timedelta(days=random.randint(1, 20))).isoformat(),
        'Notes': 'Security review in progress.' if stage == 'POC' else '',
        'Weighted_ARR': round(arr * prob / 100), 'Days_in_Stage': random.randint(4, 45),
    })

for nm, data in (('features', features), ('jira', tickets), ('sales', opps)):
    with open(os.path.join(out, nm + '.json'), 'w') as fh:
        json.dump(data, fh, indent=2)
from collections import Counter
print(len(features), len(tickets), len(opps))
print(Counter(f['Priority_Tier'] for f in features))
print(Counter(f['Current_Status'] for f in features), Counter(t['Status'] for t in tickets))
