# Hospital IT Ticket Automation — Test Evidence

This project uses fictional tickets. **Evidence checks are different from executing the Windows Power Automate Desktop (PAD) flow.** Do not report an unperformed test as passed.

## Checked-in file validation (reviewed 27 October 2026)

The committed files were compared directly with the supplied expected outputs:

| Evidence check | Observation | Status |
|---|---|---|
| Compare `triaged-tickets.csv` with `expected-results.csv` | Exact same header and six data rows (ignoring UTF-8 BOM) | PASS — repository file comparison |
| Unknown category | REQ-005 assigned `Manual Review` with `Needs Review` status | PASS — repository file comparison |
| High urgency | REQ-001 and REQ-003 have `High - Review` priority | PASS — repository file comparison |
| Activity log | Start timestamp and six ticket records present | PASS — repository file inspection |
| Missing input | Flow contains an input existence check and warning, but no recorded observed run | NOT YET VERIFIED IN PAD |
| Repeat run | Flow overwrites output and log headers before appending; no recorded observed repeat-run test | NOT YET VERIFIED IN PAD |
| Current completion dialog | Screenshot exists, but current PAD execution was not observed during this repository review | NOT INDEPENDENTLY VERIFIED |

To repeat the file-level checks, download or clone this repository, install Python 3, and run:

```powershell
python verify_results.py
```

The script checks sample output, counts, routing, and log entries. A PASS does not establish that a freshly executed PAD flow works.

## Manual PAD test checklist

1. On Windows, create `Desktop\HospitalITDemo` and copy the supplied `requests.csv` there.
2. In Power Automate Desktop, run the flow from `flow-actions.txt`.
3. Record the completion dialog counts and compare the generated CSV to `expected-results.csv`.
4. Check the log includes a run-start line and exactly one record for each ticket.
5. Run again with unchanged input. Check the CSV still has **six data rows**, not twelve.
6. Temporarily rename the input to `requests-backup.csv`. Run the flow; capture the missing-file warning. Restore the original filename.
7. Record your test date, PAD version, Windows version, actual result and screenshot or video evidence here.

| Manual test | Expected outcome | Actual observed result | Status |
|---|---|---|---|
| Process six tickets | Completion dialog: 6 processed, 1 needing manual review | Not recorded here | Not verified |
| Re-run | 6 output rows, not 12 | Not recorded here | Not verified |
| Missing file | Warning; processing stops | Not recorded here | Not verified |
| Verify generated output | Output matches expected-results.csv | Not recorded from a fresh PAD run | Not verified |

## Interpreting status and priority

`Priority = High - Review` means a high urgency request was flagged, **not** that its status became `Needs Review`. `Status = Needs Review` and the `ReviewCount` counter apply only to tickets with unknown/unmatched issue types. Thus the sample has **two priority flags** and **one manual-review ticket**.

## Known limitations

The desktop flow uses exact-text matches (case and whitespace variations may not route). It writes CSV rows by concatenating strings without CSV escaping, so input containing commas, quotes, or line breaks could produce malformed output. It relies on a local Desktop folder; there is no enterprise service-desk integration, automated trigger, human approval workflow, or notification mechanism. Use only fictional data.
