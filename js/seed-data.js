/**
 * Seed Data — 31 popular UK tractor models
 * Specifications are a starting reference. Always verify measurements
 * on your specific tractor before purchasing.
 */
(function () {
  'use strict';

  window.TractorApp = window.TractorApp || {};

  function t(size, type, sizeAlt) {
    var entry = { size: size, type: type || 'Radial' };
    if (sizeAlt) entry.sizeAlt = sizeAlt;
    return entry;
  }

  function ws(pcd, studs, centreBore, offset, rimWidth, rimDiameter) {
    return {
      pcd: pcd,
      studs: studs,
      centreBore: centreBore,
      offset: offset,
      rimWidth: rimWidth,
      rimDiameter: rimDiameter
    };
  }

  window.TractorApp.SEED_DATA = [
    // ── John Deere (8) ──────────────────────────────────────
    {
      id: 'jd-6120m',
      make: 'John Deere',
      model: '6120M',
      series: '6M',
      yearStart: 2015,
      yearEnd: 2024,
      notes: 'CommandQuad or AutoQuad transmission. Popular mid-range utility tractor.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'CommandQuad / AutoQuad', ratio: 1.462 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 10, 24),
          tires: [
            t('380/85R24', 'Radial', '14.9R24'),
            t('340/85R24', 'Radial', '13.6R24'),
            t('380/70R24', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 15, 34),
          tires: [
            t('460/85R34', 'Radial', '18.4R34'),
            t('420/85R34', 'Radial', '16.9R34'),
            t('480/70R34', 'Radial')
          ]
        }
      }
    },
    {
      id: 'jd-6130r',
      make: 'John Deere',
      model: '6130R',
      series: '6R',
      yearStart: 2016,
      yearEnd: 2024,
      notes: 'AutoPowr IVT or CommandQuad. 4-cylinder with DPF and SCR.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'AutoPowr IVT', ratio: 1.374 },
        { label: 'CommandQuad', ratio: 1.385 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 10, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('380/85R28', 'Radial', '14.9R28'),
            t('420/70R28', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 16, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('480/80R38', 'Radial'),
            t('520/70R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'jd-6155r',
      make: 'John Deere',
      model: '6155R',
      series: '6R',
      yearStart: 2016,
      yearEnd: 2024,
      notes: 'AutoPowr IVT or CommandQuad. 4-cylinder, very popular mid-range.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'AutoPowr IVT', ratio: 1.374 },
        { label: 'CommandQuad', ratio: 1.385 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'jd-6195r',
      make: 'John Deere',
      model: '6195R',
      series: '6R',
      yearStart: 2016,
      yearEnd: 2024,
      notes: 'AutoPowr IVT. 6-cylinder, top of the 6R range.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'AutoPowr IVT', ratio: 1.374 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 14, 30),
          tires: [
            t('480/70R30', 'Radial'),
            t('420/85R30', 'Radial', '16.9R30'),
            t('480/65R28', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 20, 42),
          tires: [
            t('580/70R42', 'Radial'),
            t('520/85R42', 'Radial', '20.8R42'),
            t('650/65R42', 'Radial')
          ]
        }
      }
    },
    {
      id: 'jd-6250r',
      make: 'John Deere',
      model: '6250R',
      series: '6R',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'AutoPowr IVT. 6-cylinder premium with CommandPRO joystick.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'AutoPowr IVT', ratio: 1.374 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 16, 30),
          tires: [
            t('540/65R30', 'Radial'),
            t('480/70R30', 'Radial'),
            t('420/85R30', 'Radial', '16.9R30')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 20, 42),
          tires: [
            t('650/65R42', 'Radial'),
            t('580/70R42', 'Radial'),
            t('520/85R42', 'Radial', '20.8R42')
          ]
        }
      }
    },
    {
      id: 'jd-7r270',
      make: 'John Deere',
      model: '7R 270',
      series: '7R',
      yearStart: 2020,
      yearEnd: 2025,
      notes: 'e23 PowerShift or IVT. 6-cylinder 8.1L. High-spec cab.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'e23 / IVT', ratio: 1.374 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 10, 221, 0, 16, 34),
          tires: [
            t('540/65R34', 'Radial'),
            t('480/70R34', 'Radial'),
            t('600/65R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 10, 221, 0, 24, 46),
          tires: [
            t('650/65R46', 'Radial'),
            t('710/60R46', 'Radial'),
            t('580/70R46', 'Radial')
          ]
        }
      }
    },
    {
      id: 'jd-8r370',
      make: 'John Deere',
      model: '8R 370',
      series: '8R',
      yearStart: 2020,
      yearEnd: 2025,
      notes: 'e23 PowerShift or IVT. 9.0L 6-cylinder. Row-crop or standard axle.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'e23 / IVT', ratio: 1.374 }
      ],
      axles: {
        front: {
          wheelSpec: ws(335, 10, 281, 0, 18, 38),
          tires: [
            t('600/65R38', 'Radial'),
            t('540/65R38', 'Radial'),
            t('620/70R38', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(335, 10, 281, 0, 28, 46),
          tires: [
            t('710/70R46', 'Radial'),
            t('650/65R46', 'Radial'),
            t('800/65R46', 'Radial')
          ]
        }
      }
    },
    {
      id: 'jd-6r150',
      make: 'John Deere',
      model: '6R 150',
      series: '6R',
      yearStart: 2022,
      yearEnd: 2025,
      notes: 'New-generation 6R. AutoPowr or DirectDrive. 4-cylinder.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'AutoPowr IVT', ratio: 1.374 },
        { label: 'DirectDrive', ratio: 1.385 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },

    // ── New Holland (5) ─────────────────────────────────────
    {
      id: 'nh-t6180',
      make: 'New Holland',
      model: 'T6.180',
      series: 'T6',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'Dynamic Command or Electro Command. 6-cylinder NEF engine.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Dynamic Command', ratio: 1.369 },
        { label: 'Electro Command', ratio: 1.369 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('380/85R28', 'Radial', '14.9R28'),
            t('480/70R28', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'nh-t7210',
      make: 'New Holland',
      model: 'T7.210',
      series: 'T7',
      yearStart: 2015,
      yearEnd: 2024,
      notes: 'Power Command or Auto Command CVT. 6-cylinder. Good all-rounder.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Power Command', ratio: 1.369 },
        { label: 'Auto Command CVT', ratio: 1.375 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 14, 30),
          tires: [
            t('480/70R30', 'Radial'),
            t('420/85R30', 'Radial', '16.9R30'),
            t('540/65R30', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 20, 42),
          tires: [
            t('580/70R42', 'Radial'),
            t('520/85R42', 'Radial', '20.8R42'),
            t('650/65R42', 'Radial')
          ]
        }
      }
    },
    {
      id: 'nh-t7270',
      make: 'New Holland',
      model: 'T7.270',
      series: 'T7',
      yearStart: 2015,
      yearEnd: 2024,
      notes: 'Auto Command CVT. 6-cylinder. High-HP T7.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Auto Command CVT', ratio: 1.375 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 10, 221, 0, 16, 34),
          tires: [
            t('540/65R34', 'Radial'),
            t('480/70R34', 'Radial'),
            t('600/65R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 10, 221, 0, 24, 46),
          tires: [
            t('650/65R46', 'Radial'),
            t('710/60R46', 'Radial'),
            t('580/70R46', 'Radial')
          ]
        }
      }
    },
    {
      id: 'nh-t7315',
      make: 'New Holland',
      model: 'T7.315',
      series: 'T7',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'Auto Command CVT. Top of the T7 range, HD front axle.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Auto Command CVT', ratio: 1.375 }
      ],
      axles: {
        front: {
          wheelSpec: ws(335, 10, 281, 0, 18, 34),
          tires: [
            t('600/65R34', 'Radial'),
            t('540/65R34', 'Radial'),
            t('620/70R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(335, 10, 281, 0, 24, 46),
          tires: [
            t('710/60R46', 'Radial'),
            t('650/65R46', 'Radial'),
            t('710/70R42', 'Radial')
          ]
        }
      }
    },
    {
      id: 'nh-t5120',
      make: 'New Holland',
      model: 'T5.120',
      series: 'T5',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'Electro Command. 4-cylinder. Compact utility tractor.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Electro Command', ratio: 1.462 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 10, 24),
          tires: [
            t('380/85R24', 'Radial', '14.9R24'),
            t('340/85R24', 'Radial', '13.6R24'),
            t('380/70R24', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 15, 34),
          tires: [
            t('460/85R34', 'Radial', '18.4R34'),
            t('420/85R34', 'Radial', '16.9R34'),
            t('480/70R34', 'Radial')
          ]
        }
      }
    },

    // ── Massey Ferguson (4) ─────────────────────────────────
    {
      id: 'mf-5713s',
      make: 'Massey Ferguson',
      model: '5713S',
      series: '5700S',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'Dyna-4 or Dyna-6 transmission. 4-cylinder AGCO Power.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Dyna-4 / Dyna-6', ratio: 1.462 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 10, 24),
          tires: [
            t('380/85R24', 'Radial', '14.9R24'),
            t('340/85R24', 'Radial', '13.6R24'),
            t('380/70R24', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 15, 34),
          tires: [
            t('460/85R34', 'Radial', '18.4R34'),
            t('420/85R34', 'Radial', '16.9R34'),
            t('480/70R34', 'Radial')
          ]
        }
      }
    },
    {
      id: 'mf-6718s',
      make: 'Massey Ferguson',
      model: '6718S',
      series: '6700S',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'Dyna-6 or Dyna-VT. 6-cylinder AGCO Power. Very popular UK spec.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Dyna-6', ratio: 1.379 },
        { label: 'Dyna-VT', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'mf-7726s',
      make: 'Massey Ferguson',
      model: '7726S',
      series: '7700S',
      yearStart: 2018,
      yearEnd: 2024,
      notes: 'Dyna-VT CVT. 6-cylinder AGCO Power. High-spec cab.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Dyna-VT', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 10, 221, 0, 16, 34),
          tires: [
            t('540/65R34', 'Radial'),
            t('480/70R34', 'Radial'),
            t('600/65R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 10, 221, 0, 24, 46),
          tires: [
            t('650/65R46', 'Radial'),
            t('710/60R46', 'Radial'),
            t('580/70R46', 'Radial')
          ]
        }
      }
    },
    {
      id: 'mf-8s265',
      make: 'Massey Ferguson',
      model: '8S.265',
      series: '8S',
      yearStart: 2020,
      yearEnd: 2025,
      notes: 'Dyna-VT CVT. 6-cylinder AGCO Power. New-gen premium cab.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Dyna-VT', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(335, 10, 281, 0, 18, 34),
          tires: [
            t('600/65R34', 'Radial'),
            t('540/65R34', 'Radial'),
            t('620/70R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(335, 10, 281, 0, 24, 46),
          tires: [
            t('710/60R46', 'Radial'),
            t('650/65R46', 'Radial'),
            t('710/70R42', 'Radial')
          ]
        }
      }
    },

    // ── Case IH (3) ─────────────────────────────────────────
    {
      id: 'ci-puma150',
      make: 'Case IH',
      model: 'Puma 150',
      series: 'Puma',
      yearStart: 2015,
      yearEnd: 2024,
      notes: 'CVX or Powershift. 6-cylinder FPT engine.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'CVX', ratio: 1.369 },
        { label: 'Powershift', ratio: 1.369 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'ci-puma220',
      make: 'Case IH',
      model: 'Puma 220',
      series: 'Puma',
      yearStart: 2015,
      yearEnd: 2024,
      notes: 'CVX CVT. 6-cylinder FPT. High HP Puma.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'CVX', ratio: 1.369 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 10, 221, 0, 16, 34),
          tires: [
            t('540/65R34', 'Radial'),
            t('480/70R34', 'Radial'),
            t('600/65R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 10, 221, 0, 24, 46),
          tires: [
            t('650/65R46', 'Radial'),
            t('710/60R46', 'Radial'),
            t('580/70R46', 'Radial')
          ]
        }
      }
    },
    {
      id: 'ci-optum300',
      make: 'Case IH',
      model: 'Optum 300 CVX',
      series: 'Optum',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'CVX CVT. 6-cylinder FPT. Premium large-frame tractor.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'CVX', ratio: 1.369 }
      ],
      axles: {
        front: {
          wheelSpec: ws(335, 10, 281, 0, 18, 38),
          tires: [
            t('600/65R38', 'Radial'),
            t('540/65R38', 'Radial'),
            t('620/70R38', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(335, 10, 281, 0, 28, 46),
          tires: [
            t('710/70R46', 'Radial'),
            t('650/65R46', 'Radial'),
            t('800/65R46', 'Radial')
          ]
        }
      }
    },

    // ── Fendt (3) ───────────────────────────────────────────
    {
      id: 'fe-516',
      make: 'Fendt',
      model: '516 Vario',
      series: '500 Vario',
      yearStart: 2018,
      yearEnd: 2025,
      notes: 'Vario CVT. 4-cylinder AGCO Power. Compact premium.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Vario CVT', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'fe-724',
      make: 'Fendt',
      model: '724 Vario',
      series: '700 Vario',
      yearStart: 2018,
      yearEnd: 2025,
      notes: 'Vario CVT. 6-cylinder AGCO Power. Popular UK mid-range Fendt.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Vario CVT', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 10, 221, 0, 16, 34),
          tires: [
            t('540/65R34', 'Radial'),
            t('480/70R34', 'Radial'),
            t('600/65R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 10, 221, 0, 24, 46),
          tires: [
            t('650/65R46', 'Radial'),
            t('710/60R46', 'Radial'),
            t('580/70R46', 'Radial')
          ]
        }
      }
    },
    {
      id: 'fe-828',
      make: 'Fendt',
      model: '828 Vario',
      series: '800 Vario',
      yearStart: 2018,
      yearEnd: 2025,
      notes: 'Vario CVT. 6-cylinder AGCO Power. Large-frame premium.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Vario CVT', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(335, 10, 281, 0, 18, 38),
          tires: [
            t('600/65R38', 'Radial'),
            t('540/65R38', 'Radial'),
            t('620/70R38', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(335, 10, 281, 0, 28, 46),
          tires: [
            t('710/70R46', 'Radial'),
            t('650/65R46', 'Radial'),
            t('800/65R46', 'Radial')
          ]
        }
      }
    },

    // ── Kubota (2) ──────────────────────────────────────────
    {
      id: 'ku-m7172',
      make: 'Kubota',
      model: 'M7-172',
      series: 'M7',
      yearStart: 2016,
      yearEnd: 2024,
      notes: 'KVT CVT or powershift. 6-cylinder Kubota V6108. Premium spec.',
      isUserAdded: false,
      interAxleRatios: [],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'ku-m5112',
      make: 'Kubota',
      model: 'M5-112',
      series: 'M5',
      yearStart: 2017,
      yearEnd: 2024,
      notes: '36x36 transmission. 4-cylinder Kubota V3800. Utility class.',
      isUserAdded: false,
      interAxleRatios: [],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 10, 24),
          tires: [
            t('380/85R24', 'Radial', '14.9R24'),
            t('340/85R24', 'Radial', '13.6R24'),
            t('380/70R24', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 15, 34),
          tires: [
            t('460/85R34', 'Radial', '18.4R34'),
            t('420/85R34', 'Radial', '16.9R34'),
            t('480/70R34', 'Radial')
          ]
        }
      }
    },

    // ── Valtra (2) ──────────────────────────────────────────
    {
      id: 'va-n175',
      make: 'Valtra',
      model: 'N175',
      series: 'N',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'Direct or Versu. 4-cylinder AGCO Power. Popular mid-range.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Direct / Versu', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'va-t235',
      make: 'Valtra',
      model: 'T235',
      series: 'T',
      yearStart: 2018,
      yearEnd: 2024,
      notes: 'Direct CVT. 6-cylinder AGCO Power. Large-frame Valtra.',
      isUserAdded: false,
      interAxleRatios: [
        { label: 'Direct CVT', ratio: 1.379 }
      ],
      axles: {
        front: {
          wheelSpec: ws(275, 10, 221, 0, 16, 34),
          tires: [
            t('540/65R34', 'Radial'),
            t('480/70R34', 'Radial'),
            t('600/65R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 10, 221, 0, 24, 46),
          tires: [
            t('650/65R46', 'Radial'),
            t('710/60R46', 'Radial'),
            t('580/70R46', 'Radial')
          ]
        }
      }
    },

    // ── Claas (2) ───────────────────────────────────────────
    {
      id: 'cl-arion550',
      make: 'Claas',
      model: 'Arion 550',
      series: 'Arion 500',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'CMATIC CVT or HEXASHIFT. 4-cylinder FPT. Mid-range.',
      isUserAdded: false,
      interAxleRatios: [],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 12, 28),
          tires: [
            t('420/85R28', 'Radial', '16.9R28'),
            t('480/70R28', 'Radial'),
            t('380/85R28', 'Radial', '14.9R28')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 18, 38),
          tires: [
            t('520/85R38', 'Radial', '20.8R38'),
            t('580/70R38', 'Radial'),
            t('480/80R38', 'Radial')
          ]
        }
      }
    },
    {
      id: 'cl-axion870',
      make: 'Claas',
      model: 'Axion 870',
      series: 'Axion 800',
      yearStart: 2018,
      yearEnd: 2024,
      notes: 'CMATIC CVT. 6-cylinder FPT 6.7L. Large-frame Claas.',
      isUserAdded: false,
      interAxleRatios: [],
      axles: {
        front: {
          wheelSpec: ws(335, 10, 281, 0, 18, 38),
          tires: [
            t('600/65R38', 'Radial'),
            t('540/65R38', 'Radial'),
            t('620/70R38', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(335, 10, 281, 0, 28, 46),
          tires: [
            t('710/70R46', 'Radial'),
            t('650/65R46', 'Radial'),
            t('800/65R46', 'Radial')
          ]
        }
      }
    },

    // ── JCB (1) ─────────────────────────────────────────────
    {
      id: 'jcb-fastrac4220',
      make: 'JCB',
      model: 'Fastrac 4220',
      series: 'Fastrac 4000',
      yearStart: 2018,
      yearEnd: 2025,
      notes: 'CVT. 6-cylinder AGCO Power 7.4L. Full suspension, 60km/h.',
      isUserAdded: false,
      interAxleRatios: [],
      axles: {
        front: {
          wheelSpec: ws(275, 10, 221, 0, 16, 34),
          tires: [
            t('540/65R34', 'Radial'),
            t('480/70R34', 'Radial'),
            t('600/65R34', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 10, 221, 0, 20, 38),
          tires: [
            t('650/65R38', 'Radial'),
            t('600/65R38', 'Radial'),
            t('710/60R38', 'Radial')
          ]
        }
      }
    },

    // ── Deutz-Fahr (1) ──────────────────────────────────────
    {
      id: 'df-6175ttv',
      make: 'Deutz-Fahr',
      model: '6175 TTV',
      series: '6 TTV',
      yearStart: 2017,
      yearEnd: 2024,
      notes: 'TTV CVT. 6-cylinder Deutz. Well specified mid-range.',
      isUserAdded: false,
      interAxleRatios: [],
      axles: {
        front: {
          wheelSpec: ws(275, 8, 221, 0, 14, 30),
          tires: [
            t('480/70R30', 'Radial'),
            t('420/85R30', 'Radial', '16.9R30'),
            t('480/65R28', 'Radial')
          ]
        },
        rear: {
          wheelSpec: ws(275, 8, 221, 0, 20, 42),
          tires: [
            t('580/70R42', 'Radial'),
            t('520/85R42', 'Radial', '20.8R42'),
            t('650/65R42', 'Radial')
          ]
        }
      }
    }
  ];
})();
