#!/usr/bin/env python3
"""Verify the checked-in sample output and activity log.

This checks evidence files only. It does not execute or test Power Automate Desktop.
Run from any directory: python verify_results.py
"""
from collections import Counter
import csv
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent

def read_csv(filename):
    with (ROOT / filename).open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        return reader.fieldnames, list(reader)

def main():
    errors = []
    try:
        input_columns, requests = read_csv("requests.csv")
        expected_columns, expected = read_csv("expected-results.csv")
        output_columns, actual = read_csv("triaged-tickets.csv")
        log = (ROOT / "run-log.txt").read_text(encoding="utf-8-sig")
    except (OSError, UnicodeError, csv.Error) as exc:
        print(f"FAIL: Unable to read sample files: {exc}")
        return 1

    required_input = {"TicketID", "IssueType", "Urgency", "Description"}
    required_output = {"TicketID", "IssueType", "Urgency", "AssignedTeam", "Priority", "Status"}
    if not required_input.issubset(input_columns or []):
        errors.append("Input CSV is missing required columns")
    if not required_output.issubset(output_columns or []):
        errors.append("Output CSV is missing required columns")
    if output_columns != expected_columns or actual != expected:
        errors.append("Output CSV does not match expected-results.csv (headers/order/rows)")
    if len(requests) != 6 or len(actual) != 6:
        errors.append("Sample must contain six input and six output tickets")

    by_id = {row["TicketID"]: row for row in actual} if required_output.issubset(output_columns or []) else {}
    if len(by_id) != len(actual):
        errors.append("Duplicate TicketID found in output")
    expected_urgent = {"REQ-001", "REQ-003"}
    actual_urgent = {tid for tid, row in by_id.items() if row["Priority"] == "High - Review"}
    if actual_urgent != expected_urgent:
        errors.append(f"Incorrect high-priority flags: {sorted(actual_urgent)}")
    manual = {tid for tid, row in by_id.items() if row["Status"] == "Needs Review"}
    if manual != {"REQ-005"} or by_id.get("REQ-005", {}).get("AssignedTeam") != "Manual Review":
        errors.append("REQ-005 must be assigned to Manual Review and marked Needs Review")
    if any(row["Status"] != "New" for tid, row in by_id.items() if tid != "REQ-005"):
        errors.append("Routed tickets are expected to retain Status=New in this demo")

    ids = [row.get("TicketID", "") for row in requests]
    log_lines = [line for line in log.splitlines() if line.strip()]
    if not log_lines or not log_lines[0].startswith("Run started: "):
        errors.append("Activity log lacks a run-start line")
    logged_ids = re.findall(r"\bREQ-\d{3}\b", log)
    if Counter(logged_ids) != Counter(ids) or len(log_lines) != len(requests) + 1:
        errors.append("Activity log must contain one entry per input ticket and one run-start line")

    if errors:
        for message in errors:
            print(f"FAIL: {message}")
        return 1
    print("PASS: 6 input and 6 output tickets; output matches expected results.")
    print("PASS: 2 high-priority flags; 1 unknown ticket requires manual review.")
    print("PASS: activity log has a start line and exactly one entry per ticket.")
    print("NOTE: This validates committed files, NOT the live PAD flow, missing-file handling or repeat-run behaviour.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
