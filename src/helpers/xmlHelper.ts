export function escapeXml(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const DECL = "<?xml version='1.0'?>";

export type RosterCoverage = { week: number } | { date: string };
export interface RosterSlot {
  player_key: string;
  position: string;
}

export function buildRosterPayload(
  coverage: RosterCoverage,
  players: RosterSlot[]
): string {
  const cov =
    "week" in coverage
      ? `<coverage_type>week</coverage_type><week>${escapeXml(
          coverage.week
        )}</week>`
      : `<coverage_type>date</coverage_type><date>${escapeXml(
          coverage.date
        )}</date>`;
  const playerEls = players
    .map(
      (p) =>
        `<player><player_key>${escapeXml(
          p.player_key
        )}</player_key><position>${escapeXml(p.position)}</position></player>`
    )
    .join("");
  return `${DECL}<fantasy_content><roster>${cov}<players>${playerEls}</players></roster></fantasy_content>`;
}
