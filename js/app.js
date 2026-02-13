/**
 * App Controller — Tab navigation, event wiring, app lifecycle
 */
(function () {
  'use strict';

  var DataModel = window.TractorApp.DataModel;
  var Search = window.TractorApp.Search;
  var UI = window.TractorApp.UI;

  // ── Tab Navigation ────────────────────────────────────

  function initTabs() {
    var btns = document.querySelectorAll('.tab-btn');
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
      });
    });
  }

  function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
      b.setAttribute('aria-selected', b.getAttribute('data-tab') === tabId ? 'true' : 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(function (p) {
      p.classList.toggle('active', p.id === 'tab-' + tabId);
    });

    if (tabId === 'manage-data') {
      renderManageTable();
    }
    if (tabId === 'fwl-calculator') {
      populateFwlMakes();
    }
  }

  // ── Tab 1: Find by Tractor ────────────────────────────

  function initFindByTractor() {
    var selectMake = document.getElementById('select-make');
    var selectModel = document.getElementById('select-model');
    var btnClear = document.getElementById('btn-clear-tractor');

    populateMakes();

    selectMake.addEventListener('change', function () {
      var make = selectMake.value;
      selectModel.innerHTML = '<option value="">All Models</option>';
      if (make) {
        var models = DataModel.getModels(make);
        models.forEach(function (m) {
          var opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          selectModel.appendChild(opt);
        });
        selectModel.disabled = false;
      } else {
        selectModel.disabled = true;
      }
      doTractorSearch();
    });

    selectModel.addEventListener('change', doTractorSearch);

    btnClear.addEventListener('click', function () {
      selectMake.value = '';
      selectModel.innerHTML = '<option value="">All Models</option>';
      selectModel.disabled = true;
      document.getElementById('tractor-results').innerHTML =
        '<div class="empty-state"><p>Select a make above to browse tractor fitments.</p></div>';
    });
  }

  function populateMakes() {
    var selectMake = document.getElementById('select-make');
    var current = selectMake.value;
    selectMake.innerHTML = '<option value="">All Makes</option>';
    DataModel.getMakes().forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      selectMake.appendChild(opt);
    });
    if (current) selectMake.value = current;
  }

  function doTractorSearch() {
    var make = document.getElementById('select-make').value;
    var model = document.getElementById('select-model').value;
    var container = document.getElementById('tractor-results');

    if (!make) {
      container.innerHTML = '<div class="empty-state"><p>Select a make above to browse tractor fitments.</p></div>';
      return;
    }

    var results = Search.byTractor(make, model);
    if (results.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No tractors found matching your selection.</p></div>';
      return;
    }

    container.innerHTML = results.map(function (entry) {
      return UI.renderTractorCard(entry);
    }).join('');
  }

  // ── Tab 2: Find by Size/Spec ──────────────────────────

  function initFindBySize() {
    var toggleBtns = document.querySelectorAll('[data-search-mode]');
    var tyreForm = document.getElementById('search-tyre');
    var wheelForm = document.getElementById('search-wheel');

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-search-mode');
        toggleBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        tyreForm.style.display = mode === 'tyre' ? 'flex' : 'none';
        wheelForm.style.display = mode === 'wheel' ? 'flex' : 'none';
        document.getElementById('size-results').innerHTML =
          '<div class="empty-state"><p>Enter a tyre size or wheel spec to find matching tractors.</p></div>';
      });
    });

    // Tyre size search
    var inputTyre = document.getElementById('input-tyre-size');
    var btnTyre = document.getElementById('btn-search-tyre');

    btnTyre.addEventListener('click', doTyreSearch);
    inputTyre.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doTyreSearch();
    });

    // Wheel spec search
    var btnWheel = document.getElementById('btn-search-wheel');
    btnWheel.addEventListener('click', doWheelSearch);

    document.querySelectorAll('#search-wheel input').forEach(function (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doWheelSearch();
      });
    });
  }

  function doTyreSearch() {
    var query = document.getElementById('input-tyre-size').value.trim();
    var container = document.getElementById('size-results');

    if (!query) {
      container.innerHTML = '<div class="empty-state"><p>Enter a tyre size to search.</p></div>';
      return;
    }

    var results = Search.byTyreSize(query);
    if (results.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No tractors found matching "' + UI.esc(query) + '".</p></div>';
      return;
    }

    container.innerHTML = '<p style="margin-bottom:0.75rem;font-size:0.85rem;color:#6b7280;">' +
      results.length + ' tractor(s) found for "' + UI.esc(query) + '"</p>' +
      results.map(function (r) {
        return UI.renderTractorCard(r.entry, {
          highlightAxles: r.matchAxles,
          highlightSizes: r.matchedSizes
        });
      }).join('');
  }

  function doWheelSearch() {
    var pcd = document.getElementById('input-pcd').value;
    var studs = document.getElementById('input-studs').value;
    var centreBore = document.getElementById('input-centre-bore').value;
    var container = document.getElementById('size-results');

    if (!pcd && !studs && !centreBore) {
      container.innerHTML = '<div class="empty-state"><p>Enter at least one wheel spec value to search.</p></div>';
      return;
    }

    var results = Search.byWheelSpec({
      pcd: pcd || null,
      studs: studs || null,
      centreBore: centreBore || null
    });

    if (results.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>No tractors found matching those wheel specs.</p></div>';
      return;
    }

    var desc = [];
    if (pcd) desc.push('PCD ' + pcd);
    if (studs) desc.push(studs + ' studs');
    if (centreBore) desc.push('bore ' + centreBore);

    container.innerHTML = '<p style="margin-bottom:0.75rem;font-size:0.85rem;color:#6b7280;">' +
      results.length + ' tractor(s) found for ' + UI.esc(desc.join(', ')) + '</p>' +
      results.map(function (r) {
        return UI.renderTractorCard(r.entry, {
          highlightAxles: r.matchAxles
        });
      }).join('');
  }

  // ── Tab 3: Manage Data ────────────────────────────────

  function initManageData() {
    document.getElementById('btn-add-tractor').addEventListener('click', showAddForm);
    document.getElementById('btn-export').addEventListener('click', doExport);
    document.getElementById('btn-import').addEventListener('click', function () {
      document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', doImport);
    document.getElementById('btn-reset').addEventListener('click', confirmReset);

    // Delegate edit/delete clicks on the table
    document.getElementById('manage-tbody').addEventListener('click', function (e) {
      var btn = e.target.closest('.btn-edit, .btn-delete');
      if (!btn) return;
      var id = btn.getAttribute('data-id');
      if (btn.classList.contains('btn-edit')) {
        showEditForm(id);
      } else {
        confirmDelete(id);
      }
    });
  }

  function renderManageTable() {
    var tbody = document.getElementById('manage-tbody');
    var entries = DataModel.getAll();
    tbody.innerHTML = '';
    entries.forEach(function (entry) {
      tbody.appendChild(UI.renderTableRow(entry));
    });
    document.getElementById('manage-count').textContent = entries.length + ' entries total';
  }

  function showAddForm() {
    var formHtml = UI.buildTractorForm();
    UI.showModal('Add New Tractor', formHtml, [
      { label: 'Cancel', cls: 'btn-secondary', onClick: UI.closeModal },
      { label: 'Save', cls: 'btn-primary', onClick: function () {
        var data = UI.collectFormData();
        if (!data) return;
        DataModel.add(data);
        UI.closeModal();
        renderManageTable();
        populateMakes();
      }}
    ]);
    attachTyreFormEvents();
  }

  function showEditForm(id) {
    var entry = DataModel.getById(id);
    if (!entry) return;

    var formHtml = UI.buildTractorForm(entry);
    UI.showModal('Edit Tractor', formHtml, [
      { label: 'Cancel', cls: 'btn-secondary', onClick: UI.closeModal },
      { label: 'Save Changes', cls: 'btn-primary', onClick: function () {
        var data = UI.collectFormData();
        if (!data) return;
        DataModel.update(id, data);
        UI.closeModal();
        renderManageTable();
        populateMakes();
      }}
    ]);
    attachTyreFormEvents();
  }

  function attachTyreFormEvents() {
    // "Add tyre" buttons
    document.querySelectorAll('.btn-add-tyre[data-axle-add]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var axle = btn.getAttribute('data-axle-add');
        var container = btn.parentNode;
        var rows = container.querySelectorAll('.tyre-entry-row');
        var index = rows.length;
        var temp = document.createElement('div');
        temp.innerHTML = UI.renderTyreEntryRow(axle, index);
        var newRow = temp.firstChild;
        container.insertBefore(newRow, btn);
        attachRemoveTyreBtn(newRow);
        newRow.querySelector('[data-tyre-field="size"]').focus();
      });
    });

    // Existing remove buttons
    document.querySelectorAll('.btn-remove-tyre').forEach(function (btn) {
      attachRemoveTyreBtn(btn.closest('.tyre-entry-row'));
    });

    // "Add IAR" button
    var btnAddIar = document.getElementById('btn-add-iar');
    if (btnAddIar) {
      btnAddIar.addEventListener('click', function () {
        var container = btnAddIar.parentNode;
        var rows = container.querySelectorAll('.iar-entry-row');
        var index = rows.length;
        var temp = document.createElement('div');
        temp.innerHTML = UI.renderIarEntryRow(index);
        var newRow = temp.firstChild;
        container.insertBefore(newRow, btnAddIar);
        attachRemoveIarBtn(newRow);
        newRow.querySelector('[data-iar-field="label"]').focus();
      });
    }

    // Existing IAR remove buttons
    document.querySelectorAll('.btn-remove-iar').forEach(function (btn) {
      attachRemoveIarBtn(btn.closest('.iar-entry-row'));
    });
  }

  function attachRemoveIarBtn(row) {
    if (!row) return;
    var btn = row.querySelector('.btn-remove-iar');
    if (btn) {
      btn.addEventListener('click', function () {
        row.remove();
      });
    }
  }

  function attachRemoveTyreBtn(row) {
    if (!row) return;
    var btn = row.querySelector('.btn-remove-tyre');
    if (btn) {
      btn.addEventListener('click', function () {
        row.remove();
      });
    }
  }

  function confirmDelete(id) {
    var entry = DataModel.getById(id);
    if (!entry) return;
    UI.showModal('Delete Tractor', '<p class="confirm-text">Are you sure you want to delete <strong>' +
      UI.esc(entry.make) + ' ' + UI.esc(entry.model) + '</strong>? This cannot be undone.</p>', [
      { label: 'Cancel', cls: 'btn-secondary', onClick: UI.closeModal },
      { label: 'Delete', cls: 'btn-danger', onClick: function () {
        DataModel.remove(id);
        UI.closeModal();
        renderManageTable();
        populateMakes();
      }}
    ]);
  }

  function doExport() {
    var json = DataModel.exportJSON();
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tractortires-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function doImport(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      var success = DataModel.importJSON(ev.target.result);
      if (success) {
        renderManageTable();
        populateMakes();
        UI.showModal('Import Complete', '<p class="confirm-text">Data imported successfully. ' +
          DataModel.count() + ' entries loaded.</p>', [
          { label: 'OK', cls: 'btn-primary', onClick: UI.closeModal }
        ]);
      } else {
        UI.showModal('Import Failed', '<p class="confirm-text">The selected file could not be parsed. ' +
          'Please ensure it is a valid JSON file exported from TractorTires.</p>', [
          { label: 'OK', cls: 'btn-secondary', onClick: UI.closeModal }
        ]);
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be re-imported
    e.target.value = '';
  }

  function confirmReset() {
    UI.showModal('Reset to Seed Data',
      '<p class="confirm-text">This will remove all your edits and custom entries, restoring the original 31 tractors. Are you sure?</p>', [
      { label: 'Cancel', cls: 'btn-secondary', onClick: UI.closeModal },
      { label: 'Reset', cls: 'btn-danger', onClick: function () {
        DataModel.resetToSeed();
        UI.closeModal();
        renderManageTable();
        populateMakes();
      }}
    ]);
  }

  // ── Tab 4: FWL Calculator ─────────────────────────────

  var FWL = window.TractorApp.FWL;
  var fwlSelectedEntry = null;

  function initFwlCalculator() {
    var modeBtns = document.querySelectorAll('[data-fwl-mode]');
    var tractorPanel = document.getElementById('fwl-tractor-mode');
    var manualPanel = document.getElementById('fwl-manual-mode');

    modeBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-fwl-mode');
        modeBtns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        tractorPanel.style.display = mode === 'tractor' ? '' : 'none';
        manualPanel.style.display = mode === 'manual' ? '' : 'none';
        document.getElementById('fwl-results').innerHTML = '';
      });
    });

    // Tractor mode selects
    var fwlMake = document.getElementById('fwl-make');
    var fwlModel = document.getElementById('fwl-model');
    var fwlIar = document.getElementById('fwl-iar');

    fwlMake.addEventListener('change', function () {
      fwlSelectedEntry = null;
      fwlModel.innerHTML = '<option value="">Select Model</option>';
      fwlIar.innerHTML = '<option value="">Select IAR</option>';
      fwlIar.disabled = true;
      hideFwlTyreSelects();
      document.getElementById('fwl-iar-manual-wrap').style.display = 'none';
      document.getElementById('fwl-results').innerHTML = '';

      if (fwlMake.value) {
        var models = DataModel.getModels(fwlMake.value);
        models.forEach(function (m) {
          var opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          fwlModel.appendChild(opt);
        });
        fwlModel.disabled = false;
      } else {
        fwlModel.disabled = true;
      }
    });

    fwlModel.addEventListener('change', function () {
      fwlSelectedEntry = null;
      fwlIar.innerHTML = '<option value="">Select IAR</option>';
      document.getElementById('fwl-iar-manual-wrap').style.display = 'none';
      hideFwlTyreSelects();
      document.getElementById('fwl-results').innerHTML = '';

      if (!fwlModel.value) {
        fwlIar.disabled = true;
        return;
      }

      // Find the entry
      var entries = DataModel.filterByTractor(fwlMake.value, fwlModel.value);
      if (!entries.length) return;
      fwlSelectedEntry = entries[0];

      var iars = fwlSelectedEntry.interAxleRatios || [];
      if (iars.length > 0) {
        iars.forEach(function (iar) {
          var opt = document.createElement('option');
          opt.value = iar.ratio;
          opt.textContent = iar.label + ' (' + iar.ratio + ')';
          fwlIar.appendChild(opt);
        });
        fwlIar.disabled = false;
        document.getElementById('fwl-iar-manual-wrap').style.display = 'none';
      } else {
        fwlIar.disabled = true;
        document.getElementById('fwl-iar-manual-wrap').style.display = 'flex';
      }

      populateFwlTyreSelects(fwlSelectedEntry);
    });

    fwlIar.addEventListener('change', function () {
      document.getElementById('fwl-results').innerHTML = '';
    });

    // When tyre size changes, repopulate brand dropdown for that axle
    document.getElementById('fwl-front-tyre').addEventListener('change', function () {
      if (!fwlSelectedEntry) return;
      var idx = parseInt(this.value, 10);
      var frontTyres = (fwlSelectedEntry.axles && fwlSelectedEntry.axles.front && fwlSelectedEntry.axles.front.tires) || [];
      if (!isNaN(idx) && frontTyres[idx]) {
        populateBrandSelect('fwl-front-brand', frontTyres[idx].size);
      }
      document.getElementById('fwl-results').innerHTML = '';
    });

    document.getElementById('fwl-rear-tyre').addEventListener('change', function () {
      if (!fwlSelectedEntry) return;
      var idx = parseInt(this.value, 10);
      var rearTyres = (fwlSelectedEntry.axles && fwlSelectedEntry.axles.rear && fwlSelectedEntry.axles.rear.tires) || [];
      if (!isNaN(idx) && rearTyres[idx]) {
        populateBrandSelect('fwl-rear-brand', rearTyres[idx].size);
      }
      document.getElementById('fwl-results').innerHTML = '';
    });

    // When brand changes, update RC shown in tyre select labels
    document.getElementById('fwl-front-brand').addEventListener('change', function () {
      if (!fwlSelectedEntry) return;
      var frontTyres = (fwlSelectedEntry.axles && fwlSelectedEntry.axles.front && fwlSelectedEntry.axles.front.tires) || [];
      updateTyreSelectLabel(document.getElementById('fwl-front-tyre'), frontTyres, 'fwl-front-brand');
      document.getElementById('fwl-results').innerHTML = '';
    });

    document.getElementById('fwl-rear-brand').addEventListener('change', function () {
      if (!fwlSelectedEntry) return;
      var rearTyres = (fwlSelectedEntry.axles && fwlSelectedEntry.axles.rear && fwlSelectedEntry.axles.rear.tires) || [];
      updateTyreSelectLabel(document.getElementById('fwl-rear-tyre'), rearTyres, 'fwl-rear-brand');
      document.getElementById('fwl-results').innerHTML = '';
    });

    // Calculate button
    document.getElementById('btn-fwl-calculate').addEventListener('click', doFwlCalculate);
    document.getElementById('btn-fwl-all-combos').addEventListener('click', doFwlAllCombos);
    document.getElementById('btn-fwl-manual-calc').addEventListener('click', doFwlManualCalc);
  }

  function populateFwlMakes() {
    var fwlMake = document.getElementById('fwl-make');
    var current = fwlMake.value;
    fwlMake.innerHTML = '<option value="">Select Make</option>';
    DataModel.getMakes().forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      fwlMake.appendChild(opt);
    });
    if (current) fwlMake.value = current;
  }

  function populateBrandSelect(selectId, tyreSize) {
    var select = document.getElementById(selectId);
    var currentVal = select.value;
    select.innerHTML = '<option value="">Generic</option>';

    if (!tyreSize) return;

    var models = FWL.getBrandModelsForSize(tyreSize);
    models.forEach(function (m) {
      var opt = document.createElement('option');
      opt.value = m.brand;
      opt.textContent = m.brand + ' — ' + m.model + ' (' + m.rc + ' mm)';
      select.appendChild(opt);
    });

    // Also add brands that don't have data for this size (user may override)
    var brands = window.TractorApp.TYRE_BRANDS || [];
    var covered = {};
    models.forEach(function (m) { covered[m.brand] = true; });
    brands.forEach(function (brand) {
      if (!covered[brand]) {
        var opt = document.createElement('option');
        opt.value = brand;
        opt.textContent = brand + ' (no RC data)';
        select.appendChild(opt);
      }
    });

    // Restore selection if still valid
    if (currentVal) select.value = currentVal;
  }

  function updateTyreSelectLabel(selectEl, tyres, brandSelectId) {
    var brand = document.getElementById(brandSelectId).value || undefined;
    var currentVal = selectEl.value;
    selectEl.innerHTML = '<option value="">Select ' + (brandSelectId.indexOf('front') !== -1 ? 'front' : 'rear') + ' tyre</option>';

    tyres.forEach(function (tyre, i) {
      var rc = FWL.lookupRC(tyre.size, brand);
      if (!rc && tyre.sizeAlt) rc = FWL.lookupRC(tyre.sizeAlt, brand);
      var label = tyre.size;
      if (tyre.sizeAlt) label += ' (' + tyre.sizeAlt + ')';
      if (rc) label += ' — ' + rc + ' mm';
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = label;
      selectEl.appendChild(opt);
    });

    if (currentVal !== '') selectEl.value = currentVal;
  }

  function populateFwlTyreSelects(entry) {
    var frontSelect = document.getElementById('fwl-front-tyre');
    var rearSelect = document.getElementById('fwl-rear-tyre');

    frontSelect.innerHTML = '<option value="">Select front tyre</option>';
    rearSelect.innerHTML = '<option value="">Select rear tyre</option>';

    var frontTyres = (entry.axles && entry.axles.front && entry.axles.front.tires) || [];
    var rearTyres = (entry.axles && entry.axles.rear && entry.axles.rear.tires) || [];

    var frontBrand = document.getElementById('fwl-front-brand').value || undefined;
    var rearBrand = document.getElementById('fwl-rear-brand').value || undefined;

    frontTyres.forEach(function (tyre, i) {
      var rc = FWL.lookupRC(tyre.size, frontBrand);
      if (!rc && tyre.sizeAlt) rc = FWL.lookupRC(tyre.sizeAlt, frontBrand);
      var label = tyre.size;
      if (tyre.sizeAlt) label += ' (' + tyre.sizeAlt + ')';
      if (rc) label += ' — ' + rc + ' mm';
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = label;
      frontSelect.appendChild(opt);
    });

    rearTyres.forEach(function (tyre, i) {
      var rc = FWL.lookupRC(tyre.size, rearBrand);
      if (!rc && tyre.sizeAlt) rc = FWL.lookupRC(tyre.sizeAlt, rearBrand);
      var label = tyre.size;
      if (tyre.sizeAlt) label += ' (' + tyre.sizeAlt + ')';
      if (rc) label += ' — ' + rc + ' mm';
      var opt = document.createElement('option');
      opt.value = i;
      opt.textContent = label;
      rearSelect.appendChild(opt);
    });

    // Populate brand dropdowns based on first available tyre size
    if (frontTyres.length > 0) {
      populateBrandSelect('fwl-front-brand', frontTyres[0].size);
    }
    if (rearTyres.length > 0) {
      populateBrandSelect('fwl-rear-brand', rearTyres[0].size);
    }

    document.getElementById('fwl-tyre-selects').style.display = 'flex';
    document.getElementById('fwl-tractor-actions').style.display = 'flex';
  }

  function hideFwlTyreSelects() {
    document.getElementById('fwl-tyre-selects').style.display = 'none';
    document.getElementById('fwl-tractor-actions').style.display = 'none';
    document.getElementById('fwl-front-brand').innerHTML = '<option value="">Generic</option>';
    document.getElementById('fwl-rear-brand').innerHTML = '<option value="">Generic</option>';
  }

  function getFwlIar() {
    var iarSelect = document.getElementById('fwl-iar');
    if (!iarSelect.disabled && iarSelect.value) {
      return parseFloat(iarSelect.value);
    }
    var iarManual = document.getElementById('fwl-iar-manual');
    if (iarManual.value) {
      return parseFloat(iarManual.value);
    }
    return null;
  }

  function doFwlCalculate() {
    var container = document.getElementById('fwl-results');

    if (!fwlSelectedEntry) {
      container.innerHTML = '<div class="empty-state"><p>Please select a tractor first.</p></div>';
      return;
    }

    var iar = getFwlIar();
    if (!iar) {
      container.innerHTML = '<div class="empty-state"><p>Please select or enter an inter-axle ratio.</p></div>';
      return;
    }

    var frontIdx = document.getElementById('fwl-front-tyre').value;
    var rearIdx = document.getElementById('fwl-rear-tyre').value;

    if (frontIdx === '' || rearIdx === '') {
      container.innerHTML = '<div class="empty-state"><p>Please select both front and rear tyres.</p></div>';
      return;
    }

    var frontBrand = document.getElementById('fwl-front-brand').value || undefined;
    var rearBrand = document.getElementById('fwl-rear-brand').value || undefined;

    var frontTyres = fwlSelectedEntry.axles.front.tires;
    var rearTyres = fwlSelectedEntry.axles.rear.tires;
    var ft = frontTyres[parseInt(frontIdx, 10)];
    var rt = rearTyres[parseInt(rearIdx, 10)];

    var rcFront = FWL.lookupRC(ft.size, frontBrand);
    if (!rcFront && ft.sizeAlt) rcFront = FWL.lookupRC(ft.sizeAlt, frontBrand);
    var rcRear = FWL.lookupRC(rt.size, rearBrand);
    if (!rcRear && rt.sizeAlt) rcRear = FWL.lookupRC(rt.sizeAlt, rearBrand);

    // Handle missing RC
    if (!rcFront || !rcRear) {
      var missingTyre = !rcFront ? ft : rt;
      var missingLabel = !rcFront ? 'front' : 'rear';
      var missingBrand = !rcFront ? frontBrand : rearBrand;
      showRcInputModal(missingTyre, missingLabel, function () {
        // Retry after user enters RC
        doFwlCalculate();
        // Refresh tyre dropdowns to show new RC
        if (fwlSelectedEntry) populateFwlTyreSelects(fwlSelectedEntry);
      }, missingBrand);
      return;
    }

    var result = FWL.calculateFWL(rcFront, rcRear, iar);
    result.frontTyre = ft.size + (ft.sizeAlt ? ' (' + ft.sizeAlt + ')' : '');
    result.rearTyre = rt.size + (rt.sizeAlt ? ' (' + rt.sizeAlt + ')' : '');
    result.rcFront = rcFront;
    result.rcRear = rcRear;
    result.frontBrand = frontBrand || '';
    result.rearBrand = rearBrand || '';

    container.innerHTML = '<h3 class="fwl-results-title">FWL Result — IAR ' + iar + '</h3>' +
      UI.renderFwlResult(result);
  }

  function doFwlAllCombos() {
    var container = document.getElementById('fwl-results');

    if (!fwlSelectedEntry) {
      container.innerHTML = '<div class="empty-state"><p>Please select a tractor first.</p></div>';
      return;
    }

    var iar = getFwlIar();
    if (!iar) {
      container.innerHTML = '<div class="empty-state"><p>Please select or enter an inter-axle ratio.</p></div>';
      return;
    }

    var frontBrand = document.getElementById('fwl-front-brand').value || undefined;
    var rearBrand = document.getElementById('fwl-rear-brand').value || undefined;

    var combos = FWL.computeAllCombinations(fwlSelectedEntry, iar, frontBrand, rearBrand);
    container.innerHTML = '<h3 class="fwl-results-title">All Tyre Combinations — IAR ' + iar + '</h3>' +
      UI.renderFwlCombinationTable(combos);
  }

  function doFwlManualCalc() {
    var container = document.getElementById('fwl-results');
    var iar = parseFloat(document.getElementById('fwl-manual-iar').value);
    var rcFront = parseFloat(document.getElementById('fwl-manual-front-rc').value);
    var rcRear = parseFloat(document.getElementById('fwl-manual-rear-rc').value);

    if (!iar || !rcFront || !rcRear) {
      container.innerHTML = '<div class="empty-state"><p>Please enter all three values (IAR, Front RC, Rear RC).</p></div>';
      return;
    }

    var result = FWL.calculateFWL(rcFront, rcRear, iar);
    result.rcFront = rcFront;
    result.rcRear = rcRear;
    result.frontTyre = 'Manual (' + rcFront + ' mm)';
    result.rearTyre = 'Manual (' + rcRear + ' mm)';

    container.innerHTML = '<h3 class="fwl-results-title">FWL Result — IAR ' + iar + '</h3>' +
      UI.renderFwlResult(result);
  }

  function showRcInputModal(tyre, axleLabel, onComplete, currentBrand) {
    var tyreDesc = tyre.size + (tyre.sizeAlt ? ' (' + tyre.sizeAlt + ')' : '');
    var brandNote = currentBrand ? ' for <strong>' + UI.esc(currentBrand) + '</strong>' : '';
    var html = '<p class="confirm-text">The rolling circumference for <strong>' +
      UI.esc(tyreDesc) + '</strong> (' + axleLabel + ')' + brandNote + ' is not in the database.</p>' +
      '<p class="confirm-text" style="margin-top:0.5rem;">Enter the RC value (in mm) from the tyre datasheet:</p>' +
      '<div class="form-group" style="margin-top:0.75rem;">' +
        '<label for="rc-manual-input">Rolling Circumference (mm)</label>' +
        '<input type="number" id="rc-manual-input" step="1" min="1000" max="9000" placeholder="e.g. 4100">' +
      '</div>' +
      '<div class="form-group" style="margin-top:0.5rem;">' +
        '<label for="rc-brand-select">Save for Brand (optional)</label>' +
        '<select id="rc-brand-select"><option value="">Generic (all brands)</option>';

    var brands = window.TractorApp.TYRE_BRANDS || [];
    brands.forEach(function (b) {
      var sel = (currentBrand === b) ? ' selected' : '';
      html += '<option value="' + UI.esc(b) + '"' + sel + '>' + UI.esc(b) + '</option>';
    });

    html += '</select></div>';

    UI.showModal('Missing Rolling Circumference', html, [
      { label: 'Cancel', cls: 'btn-secondary', onClick: UI.closeModal },
      { label: 'Save & Calculate', cls: 'btn-primary', onClick: function () {
        var input = document.getElementById('rc-manual-input');
        var val = parseFloat(input.value);
        if (!val || val < 1000 || val > 9000) {
          input.classList.add('invalid');
          return;
        }
        var selectedBrand = document.getElementById('rc-brand-select').value || undefined;
        FWL.saveRcOverride(tyre.size, val, selectedBrand);
        if (tyre.sizeAlt) FWL.saveRcOverride(tyre.sizeAlt, val, selectedBrand);
        UI.closeModal();
        if (onComplete) onComplete();
      }}
    ]);
  }

  // ── Modal Close ───────────────────────────────────────

  function initModal() {
    document.getElementById('modal-close').addEventListener('click', UI.closeModal);
    document.getElementById('modal-overlay').addEventListener('click', function (e) {
      if (e.target === this) UI.closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') UI.closeModal();
    });
  }

  // ── Bootstrap ─────────────────────────────────────────

  function init() {
    DataModel.init();
    initTabs();
    initFindByTractor();
    initFindBySize();
    initManageData();
    initFwlCalculator();
    initModal();
    renderManageTable();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
