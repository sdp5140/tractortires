/**
 * Data Model — localStorage CRUD and in-memory indexes
 */
(function () {
  'use strict';

  window.TractorApp = window.TractorApp || {};

  var STORAGE_KEY = 'tractorTires_data';
  var db = {
    entries: [],
    tyreSizeIndex: {},   // normalised size string → [{entryId, axle}]
    wheelSpecIndex: {}   // "pcd-studs-centreBore" → [{entryId, axle}]
  };

  // ── Helpers ───────────────────────────────────────────────

  function generateId() {
    return 'usr-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
  }

  function normaliseTyreSize(s) {
    return (s || '').toString().replace(/\s+/g, '').toUpperCase();
  }

  function wheelSpecKey(spec) {
    return [spec.pcd || 0, spec.studs || 0, spec.centreBore || 0].join('-');
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ── Index Building ────────────────────────────────────────

  function rebuildIndexes() {
    db.tyreSizeIndex = {};
    db.wheelSpecIndex = {};

    db.entries.forEach(function (entry) {
      ['front', 'rear'].forEach(function (axle) {
        var axleData = entry.axles && entry.axles[axle];
        if (!axleData) return;

        // Index tyre sizes
        if (axleData.tires) {
          axleData.tires.forEach(function (tyre) {
            addToIndex(db.tyreSizeIndex, normaliseTyreSize(tyre.size), entry.id, axle);
            if (tyre.sizeAlt) {
              addToIndex(db.tyreSizeIndex, normaliseTyreSize(tyre.sizeAlt), entry.id, axle);
            }
          });
        }

        // Index wheel specs
        if (axleData.wheelSpec) {
          var key = wheelSpecKey(axleData.wheelSpec);
          addToIndex(db.wheelSpecIndex, key, entry.id, axle);
        }
      });
    });
  }

  function addToIndex(index, key, entryId, axle) {
    if (!index[key]) index[key] = [];
    // Avoid duplicates
    var exists = index[key].some(function (item) {
      return item.entryId === entryId && item.axle === axle;
    });
    if (!exists) {
      index[key].push({ entryId: entryId, axle: axle });
    }
  }

  // ── Persistence ───────────────────────────────────────────

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db.entries));
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  }

  function loadFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        db.entries = JSON.parse(raw);
        return true;
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
    return false;
  }

  // ── Public API ────────────────────────────────────────────

  var DataModel = {
    /**
     * Initialise the data model.
     * Loads from localStorage or seeds from SEED_DATA.
     */
    init: function () {
      var loaded = loadFromStorage();
      if (!loaded || !db.entries.length) {
        db.entries = deepClone(window.TractorApp.SEED_DATA || []);
        saveToStorage();
      }
      rebuildIndexes();
    },

    /**
     * Get all entries (returns copies).
     */
    getAll: function () {
      return deepClone(db.entries);
    },

    /**
     * Get a single entry by ID (returns copy or null).
     */
    getById: function (id) {
      var entry = db.entries.find(function (e) { return e.id === id; });
      return entry ? deepClone(entry) : null;
    },

    /**
     * Add a new entry. Returns the new entry (with generated ID).
     */
    add: function (entry) {
      var newEntry = deepClone(entry);
      newEntry.id = generateId();
      newEntry.isUserAdded = true;
      db.entries.push(newEntry);
      saveToStorage();
      rebuildIndexes();
      return deepClone(newEntry);
    },

    /**
     * Update an existing entry by ID. Returns updated entry or null.
     */
    update: function (id, updates) {
      var idx = db.entries.findIndex(function (e) { return e.id === id; });
      if (idx === -1) return null;
      var merged = deepClone(db.entries[idx]);
      // Merge top-level fields
      Object.keys(updates).forEach(function (key) {
        if (key === 'id') return; // Don't allow ID change
        merged[key] = deepClone(updates[key]);
      });
      db.entries[idx] = merged;
      saveToStorage();
      rebuildIndexes();
      return deepClone(merged);
    },

    /**
     * Delete an entry by ID. Returns true if deleted.
     */
    remove: function (id) {
      var idx = db.entries.findIndex(function (e) { return e.id === id; });
      if (idx === -1) return false;
      db.entries.splice(idx, 1);
      saveToStorage();
      rebuildIndexes();
      return true;
    },

    /**
     * Reset to seed data, removing all user entries and edits.
     */
    resetToSeed: function () {
      db.entries = deepClone(window.TractorApp.SEED_DATA || []);
      saveToStorage();
      rebuildIndexes();
    },

    /**
     * Export all data as a JSON string.
     */
    exportJSON: function () {
      return JSON.stringify(db.entries, null, 2);
    },

    /**
     * Import data from a JSON string. Replaces all existing data.
     * Returns true on success, false on error.
     */
    importJSON: function (jsonString) {
      try {
        var parsed = JSON.parse(jsonString);
        if (!Array.isArray(parsed)) return false;
        db.entries = parsed;
        saveToStorage();
        rebuildIndexes();
        return true;
      } catch (e) {
        console.error('Import failed:', e);
        return false;
      }
    },

    /**
     * Get distinct makes (sorted).
     */
    getMakes: function () {
      var makes = {};
      db.entries.forEach(function (e) { makes[e.make] = true; });
      return Object.keys(makes).sort();
    },

    /**
     * Get models for a given make (sorted).
     */
    getModels: function (make) {
      var models = {};
      db.entries.forEach(function (e) {
        if (e.make === make) models[e.model] = true;
      });
      return Object.keys(models).sort();
    },

    /**
     * Get entries matching a make and optionally model.
     */
    filterByTractor: function (make, model) {
      return deepClone(db.entries.filter(function (e) {
        if (make && e.make !== make) return false;
        if (model && e.model !== model) return false;
        return true;
      }));
    },

    /**
     * Get the tyre size index (for search module).
     */
    getTyreSizeIndex: function () {
      return db.tyreSizeIndex;
    },

    /**
     * Get the wheel spec index (for search module).
     */
    getWheelSpecIndex: function () {
      return db.wheelSpecIndex;
    },

    /**
     * Get the entry count.
     */
    count: function () {
      return db.entries.length;
    }
  };

  window.TractorApp.DataModel = DataModel;
})();
