/* Shared routing rules for the browser-based walkthrough.
 * Mirrors the exact-match routing and status behaviour of flow-actions.txt.
 * This does not execute Power Automate Desktop.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.HospitalTriage = api;
})(typeof window !== "undefined" ? window : null, function () {
  "use strict";

  const OUTPUT_COLUMNS = ["TicketID", "IssueType", "Urgency", "AssignedTeam", "Priority", "Status"];
  const INPUT_COLUMNS = ["TicketID", "IssueType", "Urgency", "Description"];
  const ROUTES = Object.freeze({
    "Account Access": "Identity and Access",
    "Printer": "Desktop Support",
    "Network": "Network Team",
    "Software": "Application Support"
  });

  const SAMPLE = Object.freeze([
    { TicketID: "REQ-001", IssueType: "Account Access", Urgency: "High", Description: "Employee login locked" },
    { TicketID: "REQ-002", IssueType: "Printer", Urgency: "Low", Description: "Administrative printer offline" },
    { TicketID: "REQ-003", IssueType: "Network", Urgency: "High", Description: "Training room wireless not working" },
    { TicketID: "REQ-004", IssueType: "Software", Urgency: "Normal", Description: "Approved application installation request" },
    { TicketID: "REQ-005", IssueType: "Unknown", Urgency: "Normal", Description: "General technical question" },
    { TicketID: "REQ-006", IssueType: "Account Access", Urgency: "Normal", Description: "Employee asks for password reset guidance" }
  ]);

  function sampleTickets() {
    return SAMPLE.map(row => ({ ...row }));
  }

  function triageTicket(ticket) {
    const type = String(ticket.IssueType ?? "");
    const urgency = String(ticket.Urgency ?? "");
    const team = Object.prototype.hasOwnProperty.call(ROUTES, type) ? ROUTES[type] : "Manual Review";
    return {
      TicketID: String(ticket.TicketID ?? ""),
      IssueType: type,
      Urgency: urgency,
      AssignedTeam: team,
      Priority: urgency === "High" ? "High - Review" : "Standard",
      Status: team === "Manual Review" ? "Needs Review" : "New"
    };
  }

  function triageTickets(tickets, date = new Date()) {
    if (!Array.isArray(tickets)) throw new TypeError("tickets must be an array");
    const results = tickets.map(triageTicket);
    const timestamp = date instanceof Date && !Number.isNaN(date.getTime()) ? date.toISOString() : new Date().toISOString();
    return {
      results,
      processedCount: results.length,
      reviewCount: results.filter(row => row.Status === "Needs Review").length,
      highPriorityCount: results.filter(row => row.Priority === "High - Review").length,
      log: ["Run started: " + timestamp, ...results.map(row =>
        timestamp + " | " + row.TicketID + " | " + row.AssignedTeam + " | " + row.Status
      )].join("\n") + "\n"
    };
  }

  function csvEscape(value) {
    const text = String(value ?? "");
    return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  }

  function toCsv(records, columns = OUTPUT_COLUMNS) {
    return [columns.join(","), ...records.map(record => columns.map(col => csvEscape(record[col])).join(","))].join("\r\n") + "\r\n";
  }

  // Simple RFC 4180-compatible CSV parser for the standalone browser preview.
  function parseCsv(source) {
    const s = String(source).replace(/^\uFEFF/, "");
    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (quoted) {
        if (c === '"') {
          if (s[i + 1] === '"') { field += '"'; i++; }
          else quoted = false;
        } else field += c;
      } else if (c === '"' && field.length === 0) {
        quoted = true;
      } else if (c === ",") {
        row.push(field); field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && s[i + 1] === "\n") i++;
        row.push(field); field = "";
        if (row.some(value => value !== "")) rows.push(row);
        row = [];
      } else field += c;
    }
    if (quoted) throw new Error("CSV contains an unterminated quoted field");
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    if (!rows.length) throw new Error("CSV is empty");
    const headers = rows.shift();
    if (new Set(headers).size !== headers.length) throw new Error("CSV has duplicate headers");
    if (!INPUT_COLUMNS.every(column => headers.includes(column))) {
      throw new Error("CSV requires: " + INPUT_COLUMNS.join(", "));
    }
    return rows.map((values, index) => {
      if (values.length !== headers.length) throw new Error("Invalid column count at data row " + (index + 1));
      return Object.fromEntries(headers.map((name, j) => [name, values[j]]));
    });
  }

  return { INPUT_COLUMNS, OUTPUT_COLUMNS, ROUTES, sampleTickets, triageTicket, triageTickets, toCsv, parseCsv };
});
