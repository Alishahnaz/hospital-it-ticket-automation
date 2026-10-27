Hospital IT Support Ticket Automation
A Microsoft Power Automate Desktop portfolio project using fictional service requests.
Overview
This independent learning project demonstrates a rule-based approach to processing hospital-style IT support requests. A desktop flow reads a CSV file of simulated tickets, routes recognised issue types to example support teams, flags unfamiliar issue types for human review, and creates a triaged results file and activity log.

Technology: Microsoft Power Automate Desktop, CSV files, Windows desktop file operations.

Scope: Local, manually initiated demonstration. Not connected to any hospital, clinical system, live helpdesk, or enterprise database.
Business problem
A busy IT service desk may need to classify and record many incoming requests. Doing this by hand is repetitive and may produce inconsistent categorisation. A rule-based process can standardise straightforward tasks while leaving ambiguous cases for human review.
Workflow
1. Check that requests.csv exists in the local HospitalITDemo folder.
2. Read the input CSV into a data table.
3. Initialise the output CSV, activity log, and processing counters.
4. For each ticket, assign a proposed support team based on its issue type.
5. Flag high-urgency tickets for review and unknown issue types for manual review.
6. Append the result to triaged-tickets.csv and record the action in run-log.txt.
7. Display a completion summary with ticket totals.
Example routing rules
Issue type	Example assigned team
Account Access	Identity and Access
Printer	Desktop Support
Network	Network Team
Software	Application Support
Unknown / unmatched	Manual Review


These are fictional demonstration rules, not policies or support-team structures used by The Royal Women's Hospital.
Sample data and expected results
- Input: [`requests.csv`](requests.csv) — six fictional tickets.
- Expected output: [`expected-results.csv`](expected-results.csv).
- Actual output: triaged-tickets.csv (add this file only after you have generated and checked it).
- Activity log: run-log.txt (add this file only after you have generated and checked it).
The supplied sample is designed to yield 6 processed requests and 1 ticket needing manual review. These are expected test values, not a performance or savings claim.
Flow implementation
See [`flow-actions.txt`](flow-actions.txt) for the actions copied from the actual Power Automate Desktop flow. To reproduce the demo, create a new desktop flow and paste those actions into the Main subflow in a compatible Power Automate Desktop environment. Check and update local file paths before running.
Screenshots
Upload these screenshots to a folder named screenshots with exactly these filenames.
Workflow design

Completion message

Output file

Testing and validation
See [`test-results.md`](test-results.md) for the test checklist and recorded observations. The tests cover standard ticket routing, manual-review handling, missing input files, repeat runs, and activity-log generation. Only mark tests as passed after observing them.
Limitations and next steps
- The flow is manually run on one computer and uses CSV files rather than enterprise applications.
- Routing is a basic demonstration and must be validated by human staff before operational use.
- It does not email staff, create service-desk records, or manage real hospital requests.
- It does not demonstrate Power Apps, Dataverse, Copilot Studio, production deployment, or API integration.
- Possible enhancements: stronger error handling, structured run metrics, version control for rules, automated triggers, and an approved Power Platform application backed by Dataverse.
Data and safety
All example tickets are fictional. No patient data, staff data, credentials, private documents, or real hospital records should be included.

Disclaimer: Personal educational portfolio project, not commissioned, sponsored, or approved by The Royal Women's Hospital.
