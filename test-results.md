# Validation Record

## Coverage

This project has two verification layers:

1. **Automated repository tests** validate routing rules, CSV parsing/export, sample outputs and archived activity logs. See [automated tests](tests/triage.test.js), [file verifier](verify_results.py) and [CI workflow](.github/workflows/validate.yml).
2. **Desktop acceptance tests** exercise the Microsoft Power Automate Desktop workflow on Windows. These require an observed PAD execution and are recorded separately below.

## Evidence from committed sample files

Repository files were compared on **27 October 2026**. The saved output matches \`expected-results.csv\`, including six tickets, two high-priority flags and one exception requiring manual review. The activity log contains a run-start timestamp and six ticket records.

| Repository evidence | Observed result | Status |
|---|---|---|
| Six processed ticket records | Six output rows | Verified from saved output |
| Routing and priority | Matches all six reference rows | Verified from saved output |
| Unknown issue exception | REQ-005: Manual Review / Needs Review | Verified from saved output |
| Priority flags | REQ-001 and REQ-003: High - Review | Verified from saved output |
| Activity log | Start timestamp plus six entries | Verified from saved log |

The JavaScript regression tests and Python verifier are configured to run with GitHub Actions. Refer to the actual [Actions runs](../../actions) for their execution status; do not treat the presence of a workflow configuration as evidence of a successful CI run.

## Desktop acceptance checklist

The following cases should be tested on a Windows system with Power Automate Desktop. The saved screenshots are illustrative evidence; they are not a substitute for observing every test case.

| Test | Expected outcome | Latest independently observed result | Status |
|---|---|---|---|
| Six-ticket processing | Completion dialog: 6 processed, 1 manual review | Not recorded in this test log | Pending recorded execution |
| Output verification | Generated CSV matches expected-results.csv | Saved sample output matches; fresh PAD run not separately documented | Pending recorded execution |
| Repeatability | Running twice produces six, not twelve, output rows | Not recorded in this test log | Pending recorded execution |
| Missing input file | Warning displayed; processing stops | Not recorded in this test log | Pending recorded execution |
| Log creation | One timestamped record per ticket | Saved example contains six entries | Pending recorded execution |

### Acceptance procedure

1. Place [requests.csv](requests.csv) at \`Desktop\HospitalITDemo\requests.csv\`.
2. Open the existing flow in Power Automate Desktop; save and run it.
3. Capture the completion message and inspect the local \`triaged-tickets.csv\` and \`run-log.txt\`.
4. Run a second time and check that the output has exactly six rows.
5. Rename the input, confirm the missing-file warning, then restore its original filename.
6. Document the Windows version, PAD version, date, pass/fail status and supporting evidence.

## Design observations

- The PAD workflow uses exact-text issue category matching.
- The two high-urgency requests are priority flags and are distinct from the single manual-review status.
- The PAD output action concatenates CSV fields. Free-text commas, quotes and multiline fields need proper escaping before using arbitrary data.
- The browser preview includes more robust CSV handling, but it does not run or certify the desktop flow.
- Activity-log timestamps and browser-generated logs represent separate runs; byte-for-byte log comparison across runtime environments is not expected.

## Execution record

| Environment | Run date | PAD version | Result / supporting evidence |
|---|---|---|---|
| Desktop acceptance tests | To be entered after observed run | To be entered | To be entered |
