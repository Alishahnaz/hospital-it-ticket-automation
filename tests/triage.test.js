"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const api = require("../demo/triage.js");
const root = path.resolve(__dirname, "..");
const read = name => fs.readFileSync(path.join(root, name), "utf8").replace(/^\uFEFF/, "");
const normalize = s => s.trimEnd().replace(/\r\n/g, "\n");

test("sample tickets match the tracked requests.csv", () => {
  assert.deepEqual(api.parseCsv(read("requests.csv")), api.sampleTickets());
});
test("generated results match expected and saved output files", () => {
  const outcome = api.triageTickets(api.sampleTickets(), new Date("2026-10-27T00:00:00Z"));
  const output = normalize(api.toCsv(outcome.results));
  assert.equal(output, normalize(read("expected-results.csv")));
  assert.equal(output, normalize(read("triaged-tickets.csv")));
  assert.equal(outcome.processedCount, 6);
  assert.equal(outcome.highPriorityCount, 2);
  assert.equal(outcome.reviewCount, 1);
});
test("unknown issues require review; urgency does not change status", () => {
  assert.deepEqual(api.triageTicket({TicketID:"T",IssueType:"Unknown",Urgency:"Normal"}), {
    TicketID:"T",IssueType:"Unknown",Urgency:"Normal",AssignedTeam:"Manual Review",Priority:"Standard",Status:"Needs Review"
  });
  const high = api.triageTicket({TicketID:"T",IssueType:"Network",Urgency:"High"});
  assert.equal(high.Priority,"High - Review");
  assert.equal(high.Status,"New");
});
test("CSV escaping round trips commas, quotes and line breaks", () => {
  const record = {TicketID:"T-1",IssueType:"Printer",Urgency:"High",Description:'A "quoted",\nline'};
  assert.deepEqual(api.parseCsv(api.toCsv([record], api.INPUT_COLUMNS)), [record]);
});
test("CSV parser rejects bad headers and malformed records", () => {
  assert.throws(() => api.parseCsv("TicketID,IssueType\n1,Printer"), /requires/);
  assert.throws(() => api.parseCsv("TicketID,IssueType,Urgency,Description\n1,Printer,High"), /column count/);
  assert.throws(() => api.parseCsv('TicketID,IssueType,Urgency,Description\n"1,Printer,High,Test'), /unterminated/);
});
test("each run resets counters and logs one event per ticket", () => {
  const one = api.triageTickets(api.sampleTickets(), new Date("2026-10-27T00:00:00Z"));
  const two = api.triageTickets(api.sampleTickets(), new Date("2026-10-27T00:00:00Z"));
  assert.deepEqual(one.results, two.results);
  assert.equal(one.log.trim().split("\n").length, 7);
  assert.equal(two.processedCount, 6);
});
test("existing PAD source retains matching routing and missing-file check", () => {
  const source = read("flow-actions.txt");
  for(const value of ["Account Access","Printer","Network","Software","Manual Review","High - Review","Needs Review"]) {
    assert.ok(source.includes(value), "Missing PAD rule: " + value);
  }
  assert.ok(source.includes("File.IfFile.DoesNotExist"));
  assert.ok(source.includes("File.IfFileExists.Overwrite"));
});
