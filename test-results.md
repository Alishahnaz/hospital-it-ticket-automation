# Test Results — Hospital IT Support Ticket Automation

This template records the tests actually performed on the local Power Automate Desktop project. Do not mark a test as passed until you have run it and checked the result.

| Test | Expected result | Actual result | Status |
|---|---|---|---|
| Process six sample tickets | Completion message shows 6 processed | To be recorded | Not tested |
| Unknown issue type | REQ-005 has AssignedTeam = Manual Review and Status = Needs Review | To be recorded | Not tested |
| High urgency | REQ-001 and REQ-003 have Priority = High - Review | To be recorded | Not tested |
| Missing input file | Clear error message; flow stops without processing | To be recorded | Not tested |
| Rerun with unchanged input | Results file has 6 data rows, not 12 | To be recorded | Not tested |
| Activity log | Log contains one entry for each of the six ticket IDs | To be recorded | Not tested |

## Test environment

- **Tool:** Microsoft Power Automate Desktop
- **Operating system:** Windows (add version, if known)
- **Execution date:** Add date
- **Input data:** `requests.csv` (synthetic test records)

## Observations / fixes

Add any errors you encountered, their causes, and the changes you made. Describe only what you actually tested.

## Evidence

Refer to the screenshots in the `screenshots/` folder and the generated `triaged-tickets.csv` and `run-log.txt` files.
