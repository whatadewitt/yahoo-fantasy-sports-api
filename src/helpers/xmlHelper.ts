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

function addPlayerEl(playerKey: string, teamKey: string): string {
  return `<player><player_key>${escapeXml(
    playerKey
  )}</player_key><transaction_data><type>add</type><destination_team_key>${escapeXml(
    teamKey
  )}</destination_team_key></transaction_data></player>`;
}

function dropPlayerEl(playerKey: string, teamKey: string): string {
  return `<player><player_key>${escapeXml(
    playerKey
  )}</player_key><transaction_data><type>drop</type><source_team_key>${escapeXml(
    teamKey
  )}</source_team_key></transaction_data></player>`;
}

export function buildAddPayload(
  addPlayerKey: string,
  teamKey: string
): string {
  return `${DECL}<fantasy_content><transaction><type>add</type>${addPlayerEl(
    addPlayerKey,
    teamKey
  )}</transaction></fantasy_content>`;
}

export function buildDropPayload(
  dropPlayerKey: string,
  teamKey: string
): string {
  return `${DECL}<fantasy_content><transaction><type>drop</type>${dropPlayerEl(
    dropPlayerKey,
    teamKey
  )}</transaction></fantasy_content>`;
}

export function buildAddDropPayload(
  addPlayerKey: string,
  dropPlayerKey: string,
  teamKey: string
): string {
  return `${DECL}<fantasy_content><transaction><type>add/drop</type><players>${addPlayerEl(
    addPlayerKey,
    teamKey
  )}${dropPlayerEl(
    dropPlayerKey,
    teamKey
  )}</players></transaction></fantasy_content>`;
}

export interface WaiverOptions {
  faab_bid?: number;
  drop_player_key?: string;
}

export function buildWaiverPayload(
  addPlayerKey: string,
  teamKey: string,
  opts: WaiverOptions = {}
): string {
  const faab =
    opts.faab_bid !== undefined
      ? `<faab_bid>${escapeXml(opts.faab_bid)}</faab_bid>`
      : "";
  if (opts.drop_player_key) {
    return `${DECL}<fantasy_content><transaction><type>add/drop</type>${faab}<players>${addPlayerEl(
      addPlayerKey,
      teamKey
    )}${dropPlayerEl(
      opts.drop_player_key,
      teamKey
    )}</players></transaction></fantasy_content>`;
  }
  return `${DECL}<fantasy_content><transaction><type>add</type>${faab}${addPlayerEl(
    addPlayerKey,
    teamKey
  )}</transaction></fantasy_content>`;
}
