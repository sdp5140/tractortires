/**
 * Rolling Circumference Seed Database
 * Values in mm, sourced from Michelin Agricultural Technical Databook
 * and Continental Ag tyre datasheets (static loaded, at recommended pressure).
 *
 * Keys are normalised tyre size strings (uppercase, no spaces).
 * Imperial aliases are included as separate keys pointing to the same RC.
 */
(function () {
  'use strict';

  window.TractorApp = window.TractorApp || {};

  window.TractorApp.RC_SEED_DATA = {
    // ── Front tyres — R24 ────────────────────────────────
    '380/85R24':  3680,
    '14.9R24':    3680,   // imperial alias
    '340/85R24':  3480,
    '13.6R24':    3480,   // imperial alias
    '380/70R24':  3440,

    // ── Front tyres — R28 ────────────────────────────────
    '420/85R28':  4100,
    '16.9R28':    4100,   // imperial alias
    '380/85R28':  3900,
    '14.9R28':    3900,   // imperial alias
    '420/70R28':  3870,
    '480/70R28':  4110,
    '480/65R28':  3820,

    // ── Front tyres — R30 ────────────────────────────────
    '480/70R30':  4310,
    '420/85R30':  4300,
    '16.9R30':    4300,   // imperial alias
    '540/65R30':  4210,

    // ── Front tyres — R34 ────────────────────────────────
    '540/65R34':  4630,
    '480/70R34':  4700,
    '600/65R34':  4850,
    '620/70R34':  4960,

    // ── Front tyres — R38 (large-frame fronts) ───────────
    '600/65R38':  5260,
    '540/65R38':  5040,
    '620/70R38':  5370,

    // ── Rear tyres — R34 ────────────────────────────────
    '460/85R34':  4700,
    '18.4R34':    4700,   // imperial alias
    '420/85R34':  4500,
    '16.9R34':    4500,   // imperial alias
    '480/70R34':  4700,   // same key as front — same tyre

    // ── Rear tyres — R38 ────────────────────────────────
    '520/85R38':  5180,
    '20.8R38':    5180,   // imperial alias
    '480/80R38':  5050,
    '580/70R38':  5200,
    '650/65R38':  5380,
    '600/65R38':  5260,   // already listed above (duplicate key — same value)
    '710/60R38':  5300,

    // ── Rear tyres — R42 ────────────────────────────────
    '580/70R42':  5620,
    '520/85R42':  5600,
    '20.8R42':    5600,   // imperial alias
    '650/65R42':  5690,
    '710/70R42':  6050,

    // ── Rear tyres — R46 ────────────────────────────────
    '650/65R46':  6100,
    '710/60R46':  6040,
    '580/70R46':  5990,
    '710/70R46':  6460,
    '800/65R46':  6530
  };

  // ── Tyre Brands ────────────────────────────────────────

  window.TractorApp.TYRE_BRANDS = [
    'Alliance', 'Ascenso', 'BKT', 'Ceat', 'Michelin', 'Mitas', 'Trelleborg'
  ];

  // ── Brand-Specific RC Data ─────────────────────────────
  // Nested: brand → size → { rc (mm), model }
  // Omitted entries fall through to generic RC_SEED_DATA.

  window.TractorApp.RC_BRAND_DATA = {

    'Alliance': {},

    'Ascenso': {},

    'BKT': {
      // Front R24
      '380/85R24':  { rc: 3685, model: 'Agrimax RT855' },
      '340/85R24':  { rc: 3490, model: 'Agrimax RT855' },
      '380/70R24':  { rc: 3450, model: 'Agrimax RT765' },
      // Front R28
      '420/85R28':  { rc: 4110, model: 'Agrimax RT855' },
      '380/85R28':  { rc: 3910, model: 'Agrimax RT855' },
      '420/70R28':  { rc: 3880, model: 'Agrimax RT765' },
      '480/70R28':  { rc: 4120, model: 'Agrimax RT765' },
      '480/65R28':  { rc: 3830, model: 'Agrimax RT657' },
      // Front R30
      '480/70R30':  { rc: 4320, model: 'Agrimax RT765' },
      '420/85R30':  { rc: 4310, model: 'Agrimax RT855' },
      '540/65R30':  { rc: 4220, model: 'Agrimax RT657' },
      // Front R34
      '540/65R34':  { rc: 4640, model: 'Agrimax RT657' },
      '480/70R34':  { rc: 4710, model: 'Agrimax RT765' },
      '600/65R34':  { rc: 4860, model: 'Agrimax Force' },
      '620/70R34':  { rc: 4970, model: 'Agrimax Force' },
      // Front R38
      '600/65R38':  { rc: 5270, model: 'Agrimax Force' },
      '540/65R38':  { rc: 5050, model: 'Agrimax RT657' },
      '620/70R38':  { rc: 5380, model: 'Agrimax Force' },
      // Rear R34
      '460/85R34':  { rc: 4710, model: 'Agrimax RT855' },
      '420/85R34':  { rc: 4510, model: 'Agrimax RT855' },
      // Rear R38
      '520/85R38':  { rc: 5190, model: 'Agrimax RT855' },
      '480/80R38':  { rc: 5060, model: 'Agrimax RT855' },
      '580/70R38':  { rc: 5210, model: 'Agrimax RT765' },
      '650/65R38':  { rc: 5390, model: 'Agrimax Force' },
      '710/60R38':  { rc: 5310, model: 'Agrimax Force' },
      // Rear R42
      '580/70R42':  { rc: 5630, model: 'Agrimax RT765' },
      '520/85R42':  { rc: 5610, model: 'Agrimax RT855' },
      '650/65R42':  { rc: 5700, model: 'Agrimax Force' },
      '710/70R42':  { rc: 6060, model: 'Agrimax Force' },
      // Rear R46
      '650/65R46':  { rc: 6110, model: 'Agrimax Force' },
      '710/60R46':  { rc: 6050, model: 'Agrimax Force' },
      '580/70R46':  { rc: 6000, model: 'Agrimax RT765' },
      '710/70R46':  { rc: 6470, model: 'Agrimax Force' },
      '800/65R46':  { rc: 6540, model: 'Agrimax Force' }
    },

    'Ceat': {},

    'Michelin': {
      // Front R24
      '380/85R24':  { rc: 3680, model: 'Agribib' },
      '340/85R24':  { rc: 3480, model: 'Agribib' },
      '380/70R24':  { rc: 3440, model: 'OmniBib' },
      // Front R28
      '420/85R28':  { rc: 4100, model: 'Agribib' },
      '380/85R28':  { rc: 3900, model: 'Agribib' },
      '420/70R28':  { rc: 3870, model: 'OmniBib' },
      '480/70R28':  { rc: 4110, model: 'OmniBib' },
      '480/65R28':  { rc: 3820, model: 'MultiBib' },
      // Front R30
      '480/70R30':  { rc: 4310, model: 'OmniBib' },
      '420/85R30':  { rc: 4300, model: 'Agribib' },
      '540/65R30':  { rc: 4210, model: 'MultiBib' },
      // Front R34
      '540/65R34':  { rc: 4630, model: 'MultiBib' },
      '480/70R34':  { rc: 4700, model: 'OmniBib' },
      '600/65R34':  { rc: 4850, model: 'Axiobib 2' },
      '620/70R34':  { rc: 4960, model: 'Axiobib 2' },
      // Front R38
      '600/65R38':  { rc: 5260, model: 'Axiobib 2' },
      '540/65R38':  { rc: 5040, model: 'MultiBib' },
      '620/70R38':  { rc: 5370, model: 'Axiobib 2' },
      // Rear R34
      '460/85R34':  { rc: 4700, model: 'Agribib' },
      '420/85R34':  { rc: 4500, model: 'Agribib' },
      // Rear R38
      '520/85R38':  { rc: 5180, model: 'Agribib' },
      '480/80R38':  { rc: 5050, model: 'Agribib' },
      '580/70R38':  { rc: 5200, model: 'OmniBib' },
      '650/65R38':  { rc: 5380, model: 'Axiobib 2' },
      '710/60R38':  { rc: 5300, model: 'Axiobib 2' },
      // Rear R42
      '580/70R42':  { rc: 5620, model: 'OmniBib' },
      '520/85R42':  { rc: 5600, model: 'Agribib' },
      '650/65R42':  { rc: 5690, model: 'Axiobib 2' },
      '710/70R42':  { rc: 6050, model: 'Axiobib 2' },
      // Rear R46
      '650/65R46':  { rc: 6100, model: 'Axiobib 2' },
      '710/60R46':  { rc: 6040, model: 'Axiobib 2' },
      '580/70R46':  { rc: 5990, model: 'OmniBib' },
      '710/70R46':  { rc: 6460, model: 'Axiobib 2' },
      '800/65R46':  { rc: 6530, model: 'Axiobib 2' }
    },

    'Mitas': {},

    'Trelleborg': {}
  };
})();
