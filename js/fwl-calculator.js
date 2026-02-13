/**
 * FWL Calculator — Pure calculation engine (no UI)
 *
 * Formula: FWL% = ((RC_front x IAR) / RC_rear - 1) x 100
 *
 * Ratings:
 *   ideal      → 1–4%
 *   acceptable → 0–1% or 4–6%
 *   danger     → <0% or >6%
 */
(function () {
  'use strict';

  window.TractorApp = window.TractorApp || {};

  var RC_OVERRIDE_KEY = 'tractorTires_rcOverrides';
  var RC_BRAND_OVERRIDE_KEY = 'tractorTires_rcBrandOverrides';

  // ── RC Lookup ───────────────────────────────────────────

  function normalise(size) {
    return (size || '').toString().replace(/\s+/g, '').toUpperCase();
  }

  function getRcOverrides() {
    try {
      var raw = localStorage.getItem(RC_OVERRIDE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function getRcBrandOverrides() {
    try {
      var raw = localStorage.getItem(RC_BRAND_OVERRIDE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Look up rolling circumference for a tyre size.
   * Optional brand parameter enables brand-specific lookup.
   *
   * Lookup cascade:
   *   1. Brand-specific user override  (brand:size)
   *   2. Generic user override         (size)
   *   3. Brand-specific seed data      (RC_BRAND_DATA[brand][size].rc)
   *   4. Generic seed data             (RC_SEED_DATA[size])
   *   5. null
   */
  function lookupRC(tyreSize, brand) {
    var key = normalise(tyreSize);
    if (!key) return null;

    if (brand) {
      // 1. Brand-specific user override
      var brandOverrides = getRcBrandOverrides();
      var brandKey = brand + ':' + key;
      if (brandOverrides[brandKey] != null) return brandOverrides[brandKey];
    }

    // 2. Generic user override
    var overrides = getRcOverrides();
    if (overrides[key] != null) return overrides[key];

    if (brand) {
      // 3. Brand-specific seed data
      var brandData = window.TractorApp.RC_BRAND_DATA || {};
      var brandEntries = brandData[brand];
      if (brandEntries && brandEntries[key] != null) {
        return brandEntries[key].rc;
      }
    }

    // 4. Generic seed data
    var seed = window.TractorApp.RC_SEED_DATA || {};
    if (seed[key] != null) return seed[key];

    return null;
  }

  /**
   * Save a user-entered RC override to localStorage.
   * Optional brand parameter saves as brand-specific override.
   */
  function saveRcOverride(tyreSize, rcMm, brand) {
    var key = normalise(tyreSize);
    if (!key) return;

    if (brand) {
      var brandOverrides = getRcBrandOverrides();
      brandOverrides[brand + ':' + key] = rcMm;
      try {
        localStorage.setItem(RC_BRAND_OVERRIDE_KEY, JSON.stringify(brandOverrides));
      } catch (e) {
        console.error('Failed to save brand RC override:', e);
      }
    } else {
      var overrides = getRcOverrides();
      overrides[key] = rcMm;
      try {
        localStorage.setItem(RC_OVERRIDE_KEY, JSON.stringify(overrides));
      } catch (e) {
        console.error('Failed to save RC override:', e);
      }
    }
  }

  /**
   * Get available brand models for a given tyre size.
   * Returns array of { brand, model, rc } objects.
   */
  function getBrandModelsForSize(tyreSize) {
    var key = normalise(tyreSize);
    if (!key) return [];

    var brands = window.TractorApp.TYRE_BRANDS || [];
    var brandData = window.TractorApp.RC_BRAND_DATA || {};
    var results = [];

    brands.forEach(function (brand) {
      var entries = brandData[brand];
      if (entries && entries[key]) {
        results.push({
          brand: brand,
          model: entries[key].model,
          rc: entries[key].rc
        });
      }
    });

    return results;
  }

  // ── FWL Calculation ─────────────────────────────────────

  /**
   * Calculate FWL%.
   * @param {number} rcFront  — front tyre rolling circumference (mm)
   * @param {number} rcRear   — rear tyre rolling circumference (mm)
   * @param {number} iar      — inter-axle ratio
   * @returns {{ fwl: number, rating: string, message: string }}
   */
  function calculateFWL(rcFront, rcRear, iar) {
    if (!rcFront || !rcRear || !iar || rcRear === 0) {
      return { fwl: null, rating: 'error', message: 'Missing or invalid inputs.' };
    }

    var fwl = ((rcFront * iar) / rcRear - 1) * 100;
    fwl = Math.round(fwl * 100) / 100; // 2 decimal places

    var rating, message;

    if (fwl >= 1 && fwl <= 4) {
      rating = 'ideal';
      message = 'Ideal FWL range (1–4%). Good tyre combination.';
    } else if ((fwl >= 0 && fwl < 1) || (fwl > 4 && fwl <= 6)) {
      rating = 'acceptable';
      if (fwl < 1) {
        message = 'Low FWL — front axle may be under-driven. Acceptable but not optimal.';
      } else {
        message = 'High FWL — front axle working harder than ideal. Acceptable but monitor tyre wear.';
      }
    } else {
      rating = 'danger';
      if (fwl < 0) {
        message = 'Negative FWL — front axle is being dragged. Risk of drivetrain damage and excessive tyre wear.';
      } else {
        message = 'Excessively high FWL (>' + '6%). Risk of front tyre scrubbing and drivetrain strain.';
      }
    }

    return { fwl: fwl, rating: rating, message: message };
  }

  /**
   * Compute FWL for every front/rear tyre combination on a tractor entry.
   * @param {object} entry — tractor data entry
   * @param {number} iar   — inter-axle ratio
   * @param {string} [frontBrand] — optional brand for front tyres
   * @param {string} [rearBrand]  — optional brand for rear tyres
   * @returns {Array<{frontTyre: string, rearTyre: string, rcFront: number|null, rcRear: number|null, fwl: number|null, rating: string, message: string, frontBrand: string, rearBrand: string}>}
   */
  function computeAllCombinations(entry, iar, frontBrand, rearBrand) {
    if (!entry || !entry.axles) return [];

    var frontTyres = (entry.axles.front && entry.axles.front.tires) || [];
    var rearTyres = (entry.axles.rear && entry.axles.rear.tires) || [];
    var results = [];

    frontTyres.forEach(function (ft) {
      var rcFront = lookupRC(ft.size, frontBrand || undefined);
      // Try alt size if primary not found
      if (rcFront == null && ft.sizeAlt) rcFront = lookupRC(ft.sizeAlt, frontBrand || undefined);

      rearTyres.forEach(function (rt) {
        var rcRear = lookupRC(rt.size, rearBrand || undefined);
        if (rcRear == null && rt.sizeAlt) rcRear = lookupRC(rt.sizeAlt, rearBrand || undefined);

        var result;
        if (rcFront != null && rcRear != null) {
          result = calculateFWL(rcFront, rcRear, iar);
        } else {
          result = { fwl: null, rating: 'unknown', message: 'Missing RC data for one or both tyres.' };
        }

        results.push({
          frontTyre: ft.size + (ft.sizeAlt ? ' (' + ft.sizeAlt + ')' : ''),
          rearTyre: rt.size + (rt.sizeAlt ? ' (' + rt.sizeAlt + ')' : ''),
          rcFront: rcFront,
          rcRear: rcRear,
          fwl: result.fwl,
          rating: result.rating,
          message: result.message,
          frontBrand: frontBrand || '',
          rearBrand: rearBrand || ''
        });
      });
    });

    // Sort: ideal first, then acceptable, then danger, then unknown.
    // Within each group, sort by FWL closest to 2.5% (center of ideal range).
    var order = { ideal: 0, acceptable: 1, danger: 2, unknown: 3, error: 4 };
    results.sort(function (a, b) {
      if (order[a.rating] !== order[b.rating]) {
        return order[a.rating] - order[b.rating];
      }
      // Both same rating — sort by distance from ideal center
      var distA = a.fwl != null ? Math.abs(a.fwl - 2.5) : 999;
      var distB = b.fwl != null ? Math.abs(b.fwl - 2.5) : 999;
      return distA - distB;
    });

    return results;
  }

  // ── Public API ──────────────────────────────────────────

  window.TractorApp.FWL = {
    calculateFWL: calculateFWL,
    lookupRC: lookupRC,
    saveRcOverride: saveRcOverride,
    computeAllCombinations: computeAllCombinations,
    getBrandModelsForSize: getBrandModelsForSize
  };
})();
