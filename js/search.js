/**
 * Search — both lookup modes (tractor→parts, size→tractors)
 */
(function () {
  'use strict';

  window.TractorApp = window.TractorApp || {};

  var DataModel = window.TractorApp.DataModel;

  function normaliseTyreSize(s) {
    return (s || '').toString().replace(/\s+/g, '').toUpperCase();
  }

  var Search = {
    /**
     * Find tractors by make and/or model.
     * Returns array of tractor entry objects.
     */
    byTractor: function (make, model) {
      return DataModel.filterByTractor(make, model);
    },

    /**
     * Find tractors matching a tyre size substring.
     * Returns array of { entry, axle, matchedSize, matchedAlt }
     */
    byTyreSize: function (query) {
      if (!query || !query.trim()) return [];

      var normQuery = normaliseTyreSize(query);
      var index = DataModel.getTyreSizeIndex();
      var resultMap = {}; // "entryId-axle" → result object

      Object.keys(index).forEach(function (key) {
        if (key.indexOf(normQuery) !== -1) {
          index[key].forEach(function (ref) {
            var uniqueKey = ref.entryId + '-' + ref.axle;
            if (!resultMap[uniqueKey]) {
              var entry = DataModel.getById(ref.entryId);
              if (entry) {
                resultMap[uniqueKey] = {
                  entry: entry,
                  axle: ref.axle,
                  matchedSizes: []
                };
              }
            }
            if (resultMap[uniqueKey]) {
              // Find the actual matching tyre size string
              var axleData = resultMap[uniqueKey].entry.axles[ref.axle];
              if (axleData && axleData.tires) {
                axleData.tires.forEach(function (tyre) {
                  var normSize = normaliseTyreSize(tyre.size);
                  var normAlt = tyre.sizeAlt ? normaliseTyreSize(tyre.sizeAlt) : '';
                  if (normSize.indexOf(normQuery) !== -1 || normAlt.indexOf(normQuery) !== -1) {
                    if (resultMap[uniqueKey].matchedSizes.indexOf(tyre.size) === -1) {
                      resultMap[uniqueKey].matchedSizes.push(tyre.size);
                    }
                  }
                });
              }
            }
          });
        }
      });

      // Deduplicate: merge entries that appear on both axles
      var entryMap = {};
      Object.keys(resultMap).forEach(function (key) {
        var r = resultMap[key];
        if (!entryMap[r.entry.id]) {
          entryMap[r.entry.id] = {
            entry: r.entry,
            matchAxles: [],
            matchedSizes: []
          };
        }
        if (entryMap[r.entry.id].matchAxles.indexOf(r.axle) === -1) {
          entryMap[r.entry.id].matchAxles.push(r.axle);
        }
        r.matchedSizes.forEach(function (s) {
          if (entryMap[r.entry.id].matchedSizes.indexOf(s) === -1) {
            entryMap[r.entry.id].matchedSizes.push(s);
          }
        });
      });

      return Object.keys(entryMap).map(function (id) {
        return entryMap[id];
      }).sort(function (a, b) {
        return (a.entry.make + a.entry.model).localeCompare(b.entry.make + b.entry.model);
      });
    },

    /**
     * Find tractors matching wheel spec criteria.
     * Any combination of pcd, studs, centreBore.
     * Returns array of { entry, matchAxles }
     */
    byWheelSpec: function (criteria) {
      var pcd = criteria.pcd ? Number(criteria.pcd) : null;
      var studs = criteria.studs ? Number(criteria.studs) : null;
      var centreBore = criteria.centreBore ? Number(criteria.centreBore) : null;

      if (pcd === null && studs === null && centreBore === null) return [];

      var all = DataModel.getAll();
      var results = [];

      all.forEach(function (entry) {
        var matchAxles = [];

        ['front', 'rear'].forEach(function (axle) {
          var spec = entry.axles && entry.axles[axle] && entry.axles[axle].wheelSpec;
          if (!spec) return;

          var matches = true;
          if (pcd !== null && spec.pcd !== pcd) matches = false;
          if (studs !== null && spec.studs !== studs) matches = false;
          if (centreBore !== null && spec.centreBore !== centreBore) matches = false;

          if (matches) {
            matchAxles.push(axle);
          }
        });

        if (matchAxles.length > 0) {
          results.push({
            entry: entry,
            matchAxles: matchAxles,
            matchedSizes: []
          });
        }
      });

      return results.sort(function (a, b) {
        return (a.entry.make + a.entry.model).localeCompare(b.entry.make + b.entry.model);
      });
    }
  };

  window.TractorApp.Search = Search;
})();
