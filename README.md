# Hospital IT Support Ticket Automation

**Rule-based service-desk ticket triage | Microsoft Power Automate Desktop | CSV processing | Activity logging**

This portfolio project demonstrates a structured ticket-triage workflow for a hospital IT service-desk scenario. Incoming requests are classified by issue type, routed to a proposed support team, flagged for priority handling where applicable, and recorded in an output report and processing log. The demonstration uses representative sample requests.

## Explore the project

| Experience | What you can do |
|---|---|
| **[Launch interactive demo](demo/)** | Process sample tickets, edit inputs and download the output and log in your browser |
| [View the workflow](Flow-Design.png) | Inspect the Microsoft Power Automate Desktop action sequence |
| [Explore sample results](triaged-tickets.csv) | See the generated assignments, priorities and statuses |
| [Review activity log](run-log.txt) | Inspect the timestamped processing records |
| [Reproduce on Windows](#run-in-power-automate-desktop) | Run the original desktop workflow |
| [Validation and tests](test-results.md) | Inspect expected results, automated checks and desktop test procedures |

**Demo options:** The [browser preview](demo/) is interactive and reflects the same core routing rules; it is a separate JavaScript implementation. The **Power Automate Desktop flow** runs locally on Windows and uses the action source in [flow-actions.txt](flow-actions.txt). There is no video recording included in this repository.

> If the interactive link opens the GitHub folder listing instead of a website, open [demo/index.html](demo/index.html) and download it together with [demo/triage.js](demo/triage.js). Open the HTML file in a browser. Static hosting can also be enabled with GitHub Pages (see [Publishing the browser demo](#publishing-the-browser-demo)).

## Business scenario

An IT service desk receives requests across identity access, printing, networking and software. Consistent initial classification can reduce repetitive manual sorting while maintaining visibility into exceptions. This workflow illustrates an auditable, rules-based approach to initial triage.

**Flow at a glance**

\`\`\`text
Incoming requests.csv
        |
        v
Check file exists -> Read CSV -> Process each ticket
                                    |
                        Match issue type + check urgency
                                    |
                    Assign team + priority + status
                                    |
                    +---------------+---------------+
                    |                               |
                    v                               v
            triaged-tickets.csv                  run-log.txt
                    |
                    v
             Completion summary
\`\`\`

### Routing rules

| Issue type | Proposed support team |
|---|---|
| Account Access | Identity and Access |
| Printer | Desktop Support |
| Network | Network Team |
| Software | Application Support |
| Anything else | Manual Review |

Requests with \`Urgency = High\` receive \`Priority = High - Review\`. Unknown issue types receive \`Status = Needs Review\`; matched issue types receive \`Status = New\`. **Priority and status are separate fields.** The manual-review counter counts unmatched issue types only.

## Example run

Six sample tickets demonstrate four matching categories, two high-urgency flags and one unmatched request.

| Ticket | Issue type | Urgency | Assigned team | Priority | Status |
|---|---|---|---|---|---|
| REQ-001 | Account Access | High | Identity and Access | High - Review | New |
| REQ-002 | Printer | Low | Desktop Support | Standard | New |
| REQ-003 | Network | High | Network Team | High - Review | New |
| REQ-004 | Software | Normal | Application Support | Standard | New |
| REQ-005 | Unknown | Normal | Manual Review | Standard | Needs Review |
| REQ-006 | Account Access | Normal | Identity and Access | Standard | New |

**Sample totals:** 6 processed · 2 priority flags · 1 manual review

Source: [requests.csv](requests.csv) · Reference: [expected-results.csv](expected-results.csv) · Saved output: [triaged-tickets.csv](triaged-tickets.csv)

## Screenshots

### Power Automate Desktop workflow

![Power Automate Desktop flow design](Flow-Design.png)

### Execution summary

![Power Automate Desktop completion message](Completion.png)

### Generated report

![Result file after ticket processing](Results.png)

## Run in Power Automate Desktop

### Requirements

- Windows PC with Microsoft Power Automate Desktop installed and available to run desktop flows
- Permission to create and write files within the Windows Desktop folder
- Downloaded [requests.csv](requests.csv) and [flow-actions.txt](flow-actions.txt)

### 1. Prepare the input

Create a folder named \`HospitalITDemo\` on your Windows Desktop. Save [requests.csv](requests.csv) inside it with exactly that name.

\`\`\`text
Desktop/
└── HospitalITDemo/
    └── requests.csv
\`\`\`

### 2. Open or recreate the flow

**Existing installation:** Open the original ticket-triage flow in Power Automate Desktop.

**Fresh installation:** Create a desktop flow and use [flow-actions.txt](flow-actions.txt) to reconstruct the Main subflow. The file records the PAD actions for reference; it is not a standalone executable. Some PAD versions may accept action text copied from within the \`FUNCTION Main_copy GLOBAL\` and \`END FUNCTION\` wrapper directly into the designer; other versions require creating the equivalent actions manually. Review the expressions and action settings in the designer before saving.

The initial \`Get special folder\` action resolves the current user's Desktop path. All read/write operations use \`%SpecialFolderPath%\HospitalITDemo\...\`. If your Desktop is redirected to OneDrive or elsewhere, place the input file in the folder that the action resolves, or adjust the paths consistently.

### 3. Execute

Save and run the flow from PAD. For the supplied six tickets, the completion dialog should report:

\`\`\`text
IT Ticket Processing Complete

Automation completed.

Tickets processed: 6
Tickets needing manual review: 1
\`\`\`

### 4. Check the generated files

After running, your local folder should contain:

\`\`\`text
HospitalITDemo/
├── requests.csv
├── triaged-tickets.csv
└── run-log.txt
\`\`\`

Open \`triaged-tickets.csv\` and compare the six rows with [expected-results.csv](expected-results.csv). Open \`run-log.txt\` to verify the run-start timestamp and a record for each ticket. The files in this GitHub repository are a saved example, not files that update automatically when your desktop flow runs.

### 5. Verify resilience

- **Repeat run:** Run the flow a second time with the same input. The expected output is six ticket rows, not twelve, because the flow overwrites the report before writing its ticket entries.
- **Missing input:** Temporarily rename \`requests.csv\` to \`requests-backup.csv\` and run the flow. Check for its missing-input warning and restore the filename afterwards.

Record observed results in [test-results.md](test-results.md). The repository's automatic tests do not execute PAD on Windows.

## Browser demonstration

The separate [interactive browser demo](demo/) implements the documented routing logic, includes the six sample tickets, supports custom CSV inputs and allows downloading a generated report and activity log. It uses a standards-aware CSV parser and exporter to support quoted fields and provides a convenient way to review the workflow without installing PAD.

**Browser demo ≠ desktop runtime.** The browser simulation demonstrates routing rules and sample outcomes but cannot test PAD actions, Windows file handling, desktop permissions or local workflow execution.

### Publishing the browser demo

The source is already in the repository's \`demo/\` folder. To create a public hosted URL, enable GitHub Pages in repository **Settings → Pages**, select **Deploy from a branch**, use \`main\` and \`/(root)\`, then save. Once GitHub displays the published site address, the demo will be available at a URL similar to \`https://alishahnaz.github.io/hospital-it-ticket-automation/demo/\`. The hosting address is an expected pattern, **not a verified live link** until GitHub Pages deployment completes.

Alternatively, download both \`demo/index.html\` and \`demo/triage.js\` into the same local folder and open \`index.html\` in a browser.

## Quality assurance

The repository includes two complementary levels of checks:

1. **Automated:** [GitHub Actions validation](.github/workflows/validate.yml) runs JavaScript regression tests for routing, expected output and CSV edge cases, plus the Python [verify_results.py](verify_results.py) checks for committed results and log completeness. Locally run \`node --test tests/*.test.js\` (Node.js 22+) and \`python verify_results.py\` (Python 3).
2. **Desktop workflow:** The PAD-specific checklist covers successful execution, a repeat run, handling a missing input file, and confirmation of the generated report and log. Refer to [test-results.md](test-results.md) for evidence status.

Only executed checks should be described as passed.

## Implementation and considerations

The PAD implementation features local file existence checking, CSV data tables, conditional routing, urgency checks, ticket counters, CSV file output and timestamped logging. It operates as a manually started desktop workflow. Current constraints and potential extensions include:

- Exact string matching for issue types; standardising the input would improve coverage.
- The PAD action file concatenates output fields and does not fully escape commas, quotes or line breaks. The browser demo implements CSV escaping; the PAD flow should be enhanced before accepting arbitrary free-text inputs.
- Additional validation, resilient exception handling and monitoring would be needed for operational use.
- Escalation notifications, live ticket-system connectors, human approval checkpoints and unattended orchestration could extend the prototype if appropriate systems and permissions were available.

## Repository contents

| File / folder | Purpose |
|---|---|
| [requests.csv](requests.csv) | Representative input tickets |
| [flow-actions.txt](flow-actions.txt) | Desktop flow action text |
| [expected-results.csv](expected-results.csv) | Reference expected report |
| [triaged-tickets.csv](triaged-tickets.csv) | Saved example output |
| [run-log.txt](run-log.txt) | Saved activity log |
| [demo/](demo/) | Standalone interactive HTML and JavaScript preview |
| [tests/](tests/) | Automated regression test suite |
| [.github/workflows/validate.yml](.github/workflows/validate.yml) | Automated checks on push and pull requests |
| [verify_results.py](verify_results.py) | Validation of repository evidence |
| [test-results.md](test-results.md) | Test record and desktop QA procedure |
| [Flow-Design.png](Flow-Design.png), [Completion.png](Completion.png), [Results.png](Results.png) | Visual workflow evidence |

## Data handling

The example tickets are synthetic and contain no patient records, production credentials or confidential IT service-desk information. The scenario and team routing names are illustrative and should be adapted to any organisation's approved processes before operational use.
