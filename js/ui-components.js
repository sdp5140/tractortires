/**
 * UI Components — Card rendering, forms, modals, tables
 */
(function () {
  'use strict';

  window.TractorApp = window.TractorApp || {};

  // ── Helpers ───────────────────────────────────────────

  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'className') node.className = attrs[k];
        else if (k === 'innerHTML') node.innerHTML = attrs[k];
        else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (typeof children === 'string') {
      node.textContent = children;
    } else if (Array.isArray(children)) {
      children.forEach(function (c) { if (c) node.appendChild(c); });
    }
    return node;
  }

  // ── Spec Rendering ────────────────────────────────────

  function renderSpecRow(label, value, unit) {
    var val = value != null ? value : '—';
    if (unit && value != null) val = val + ' ' + unit;
    return '<div class="spec-row"><span class="spec-label">' + esc(label) +
           '</span><span class="spec-value">' + esc(String(val)) + '</span></div>';
  }

  function renderWheelSpec(spec) {
    if (!spec) return '<div class="spec-row"><span class="spec-label">No wheel spec</span></div>';
    return renderSpecRow('PCD', spec.pcd, 'mm') +
           renderSpecRow('Studs', spec.studs) +
           renderSpecRow('Centre Bore', spec.centreBore, 'mm') +
           renderSpecRow('Offset', spec.offset, 'mm') +
           renderSpecRow('Rim Width', spec.rimWidth, '"') +
           renderSpecRow('Rim Diameter', spec.rimDiameter, '"');
  }

  function renderTyreList(tires, highlightSizes) {
    if (!tires || !tires.length) return '';
    var highlights = (highlightSizes || []).map(function (s) {
      return s.replace(/\s+/g, '').toUpperCase();
    });

    var html = '<div class="tyre-list"><div class="tyre-list-title">Compatible Tyres</div>';
    tires.forEach(function (tyre) {
      var isHighlight = highlights.length > 0 && highlights.indexOf(
        tyre.size.replace(/\s+/g, '').toUpperCase()
      ) !== -1;
      var cls = 'tyre-tag' + (isHighlight ? ' tyre-highlight' : '');
      html += '<span class="' + cls + '">' + esc(tyre.size);
      if (tyre.sizeAlt) {
        html += ' <span class="tyre-alt">(' + esc(tyre.sizeAlt) + ')</span>';
      }
      html += '</span>';
    });
    html += '</div>';
    return html;
  }

  // ── Tractor Card ──────────────────────────────────────

  function renderTractorCard(entry, options) {
    options = options || {};
    var highlightAxles = options.highlightAxles || [];
    var highlightSizes = options.highlightSizes || [];

    var years = entry.yearStart + (entry.yearEnd ? '–' + entry.yearEnd : '+');
    var badge = entry.isUserAdded
      ? '<span class="card-badge badge-user">User Added</span>'
      : '<span class="card-badge">' + esc(entry.series || '') + '</span>';

    var frontHL = highlightAxles.indexOf('front') !== -1;
    var rearHL = highlightAxles.indexOf('rear') !== -1;

    var frontAxle = entry.axles && entry.axles.front;
    var rearAxle = entry.axles && entry.axles.rear;

    var html = '<div class="tractor-card">' +
      '<div class="card-header">' +
        '<div>' +
          '<div class="card-title">' + esc(entry.make) + ' ' + esc(entry.model) + '</div>' +
          '<div class="card-subtitle">' + esc(years) + '</div>' +
        '</div>' +
        badge +
      '</div>' +
      '<div class="card-body">';

    if (entry.notes) {
      html += '<div class="card-notes">' + esc(entry.notes) + '</div>';
    }

    html += '<div class="axle-grid">';

    // Front axle
    html += '<div class="axle-section">' +
      '<div class="axle-label' + (frontHL ? ' highlight' : '') + '">' +
        (frontHL ? '&#9654; ' : '') + 'Front Axle</div>';
    if (frontAxle) {
      html += renderWheelSpec(frontAxle.wheelSpec);
      html += renderTyreList(frontAxle.tires, frontHL ? highlightSizes : []);
    } else {
      html += '<div class="spec-row"><span class="spec-label">No data</span></div>';
    }
    html += '</div>';

    // Rear axle
    html += '<div class="axle-section">' +
      '<div class="axle-label' + (rearHL ? ' highlight' : '') + '">' +
        (rearHL ? '&#9654; ' : '') + 'Rear Axle</div>';
    if (rearAxle) {
      html += renderWheelSpec(rearAxle.wheelSpec);
      html += renderTyreList(rearAxle.tires, rearHL ? highlightSizes : []);
    } else {
      html += '<div class="spec-row"><span class="spec-label">No data</span></div>';
    }
    html += '</div>';

    html += '</div></div></div>';
    return html;
  }

  // ── Manage Table Row ──────────────────────────────────

  function renderTableRow(entry) {
    var years = entry.yearStart + (entry.yearEnd ? '–' + entry.yearEnd : '+');
    var sourceCls = entry.isUserAdded ? 'source-user' : 'source-seed';
    var sourceText = entry.isUserAdded ? 'User' : 'Seed';

    var tr = document.createElement('tr');
    tr.setAttribute('data-id', entry.id);
    tr.innerHTML =
      '<td>' + esc(entry.make) + '</td>' +
      '<td><strong>' + esc(entry.model) + '</strong></td>' +
      '<td>' + esc(entry.series || '') + '</td>' +
      '<td>' + esc(years) + '</td>' +
      '<td><span class="source-badge ' + sourceCls + '">' + esc(sourceText) + '</span></td>' +
      '<td class="col-actions">' +
        '<button class="btn btn-secondary btn-sm btn-edit" data-id="' + esc(entry.id) + '">Edit</button> ' +
        '<button class="btn btn-danger btn-sm btn-delete" data-id="' + esc(entry.id) + '">Delete</button>' +
      '</td>';
    return tr;
  }

  // ── Tractor Form (Add / Edit) ─────────────────────────

  function buildTractorForm(entry) {
    entry = entry || {};
    var axles = entry.axles || { front: { wheelSpec: {}, tires: [] }, rear: { wheelSpec: {}, tires: [] } };

    function val(v) { return v != null ? v : ''; }
    function specVal(axle, field) {
      var spec = axles[axle] && axles[axle].wheelSpec;
      return spec ? val(spec[field]) : '';
    }

    var html = '<form id="tractor-form" class="form-grid">' +
      '<div class="form-group"><label for="f-make">Make *</label>' +
        '<input type="text" id="f-make" required value="' + esc(val(entry.make)) + '"></div>' +
      '<div class="form-group"><label for="f-model">Model *</label>' +
        '<input type="text" id="f-model" required value="' + esc(val(entry.model)) + '"></div>' +
      '<div class="form-group"><label for="f-series">Series</label>' +
        '<input type="text" id="f-series" value="' + esc(val(entry.series)) + '"></div>' +
      '<div class="form-group"><label for="f-yearStart">Year From *</label>' +
        '<input type="number" id="f-yearStart" required min="1950" max="2030" value="' + esc(val(entry.yearStart)) + '"></div>' +
      '<div class="form-group"><label for="f-yearEnd">Year To</label>' +
        '<input type="number" id="f-yearEnd" min="1950" max="2030" value="' + esc(val(entry.yearEnd)) + '"></div>' +
      '<div class="form-group full-width"><label for="f-notes">Notes</label>' +
        '<textarea id="f-notes">' + esc(val(entry.notes)) + '</textarea></div>';

    // Inter-Axle Ratios section
    var iars = entry.interAxleRatios || [];
    html += '<div class="form-section-title">Inter-Axle Ratios</div>' +
      '<div class="iar-entries" id="iar-entries">';
    iars.forEach(function (iar, i) {
      html += renderIarEntryRow(i, iar);
    });
    html += '<button type="button" class="btn-add-tyre" id="btn-add-iar">+ Add Ratio</button>';
    html += '</div>';

    // Axle sections
    ['front', 'rear'].forEach(function (axle) {
      var label = axle.charAt(0).toUpperCase() + axle.slice(1);
      html += '<div class="form-section-title">' + label + ' Axle — Wheel Spec</div>' +
        '<div class="form-group"><label>PCD (mm)</label>' +
          '<input type="number" data-axle="' + axle + '" data-field="pcd" value="' + specVal(axle, 'pcd') + '"></div>' +
        '<div class="form-group"><label>Studs</label>' +
          '<input type="number" data-axle="' + axle + '" data-field="studs" value="' + specVal(axle, 'studs') + '"></div>' +
        '<div class="form-group"><label>Centre Bore (mm)</label>' +
          '<input type="number" data-axle="' + axle + '" data-field="centreBore" value="' + specVal(axle, 'centreBore') + '"></div>' +
        '<div class="form-group"><label>Offset (mm)</label>' +
          '<input type="number" data-axle="' + axle + '" data-field="offset" value="' + specVal(axle, 'offset') + '"></div>' +
        '<div class="form-group"><label>Rim Width (")</label>' +
          '<input type="number" data-axle="' + axle + '" data-field="rimWidth" value="' + specVal(axle, 'rimWidth') + '"></div>' +
        '<div class="form-group"><label>Rim Diameter (")</label>' +
          '<input type="number" data-axle="' + axle + '" data-field="rimDiameter" value="' + specVal(axle, 'rimDiameter') + '"></div>';

      // Tyres
      var tires = (axles[axle] && axles[axle].tires) || [];
      html += '<div class="form-section-title">' + label + ' Axle — Tyres</div>' +
        '<div class="tyre-entries" data-axle-tyres="' + axle + '">';

      tires.forEach(function (tyre, i) {
        html += renderTyreEntryRow(axle, i, tyre);
      });

      html += '<button type="button" class="btn-add-tyre" data-axle-add="' + axle + '">+ Add Tyre</button>';
      html += '</div>';
    });

    html += '</form>';
    return html;
  }

  function renderTyreEntryRow(axle, index, tyre) {
    tyre = tyre || {};
    return '<div class="tyre-entry-row" data-tyre-row="' + axle + '-' + index + '">' +
      '<input type="text" placeholder="Size (e.g. 480/80R42)" data-tyre-field="size" value="' + esc(tyre.size || '') + '" style="flex:1;min-width:140px;">' +
      '<input type="text" placeholder="Alt (e.g. 18.4R42)" data-tyre-field="sizeAlt" value="' + esc(tyre.sizeAlt || '') + '" style="flex:1;min-width:120px;">' +
      '<input type="text" placeholder="Type" data-tyre-field="type" value="' + esc(tyre.type || 'Radial') + '" style="width:80px;">' +
      '<button type="button" class="btn btn-danger btn-sm btn-remove-tyre">&#10005;</button>' +
      '</div>';
  }

  function renderIarEntryRow(index, iar) {
    iar = iar || {};
    return '<div class="tyre-entry-row iar-entry-row" data-iar-row="' + index + '">' +
      '<input type="text" placeholder="Label (e.g. AutoPowr)" data-iar-field="label" value="' + esc(iar.label || '') + '" style="flex:1;min-width:140px;">' +
      '<input type="number" placeholder="Ratio (e.g. 1.385)" data-iar-field="ratio" value="' + (iar.ratio || '') + '" step="0.001" min="1" max="2" style="width:130px;">' +
      '<button type="button" class="btn btn-danger btn-sm btn-remove-iar">&#10005;</button>' +
      '</div>';
  }

  function collectFormData() {
    var form = document.getElementById('tractor-form');
    if (!form) return null;

    var make = form.querySelector('#f-make').value.trim();
    var model = form.querySelector('#f-model').value.trim();
    var yearStart = form.querySelector('#f-yearStart').value;

    // Validate required fields
    var valid = true;
    [form.querySelector('#f-make'), form.querySelector('#f-model'), form.querySelector('#f-yearStart')].forEach(function (input) {
      if (!input.value.trim()) {
        input.classList.add('invalid');
        valid = false;
      } else {
        input.classList.remove('invalid');
      }
    });
    if (!valid) return null;

    var entry = {
      make: make,
      model: model,
      series: form.querySelector('#f-series').value.trim(),
      yearStart: parseInt(yearStart, 10),
      yearEnd: form.querySelector('#f-yearEnd').value ? parseInt(form.querySelector('#f-yearEnd').value, 10) : null,
      notes: form.querySelector('#f-notes').value.trim(),
      interAxleRatios: [],
      axles: { front: { wheelSpec: {}, tires: [] }, rear: { wheelSpec: {}, tires: [] } }
    };

    // Collect inter-axle ratios
    var iarContainer = form.querySelector('#iar-entries');
    if (iarContainer) {
      var iarRows = iarContainer.querySelectorAll('.iar-entry-row');
      iarRows.forEach(function (row) {
        var label = row.querySelector('[data-iar-field="label"]').value.trim();
        var ratio = row.querySelector('[data-iar-field="ratio"]').value.trim();
        if (ratio) {
          entry.interAxleRatios.push({
            label: label || 'Default',
            ratio: parseFloat(ratio)
          });
        }
      });
    }

    // Collect wheel specs
    ['front', 'rear'].forEach(function (axle) {
      var specInputs = form.querySelectorAll('input[data-axle="' + axle + '"]');
      specInputs.forEach(function (input) {
        var field = input.getAttribute('data-field');
        var val = input.value.trim();
        if (val !== '') {
          entry.axles[axle].wheelSpec[field] = parseFloat(val);
        }
      });

      // Collect tyres
      var tyreContainer = form.querySelector('[data-axle-tyres="' + axle + '"]');
      if (tyreContainer) {
        var rows = tyreContainer.querySelectorAll('.tyre-entry-row');
        rows.forEach(function (row) {
          var size = row.querySelector('[data-tyre-field="size"]').value.trim();
          if (size) {
            var tyre = { size: size, type: 'Radial' };
            var alt = row.querySelector('[data-tyre-field="sizeAlt"]').value.trim();
            if (alt) tyre.sizeAlt = alt;
            var type = row.querySelector('[data-tyre-field="type"]').value.trim();
            if (type) tyre.type = type;
            entry.axles[axle].tires.push(tyre);
          }
        });
      }
    });

    return entry;
  }

  // ── FWL Result Rendering ─────────────────────────────

  function renderFwlResult(result) {
    var iconMap = { ideal: '&#10003;', acceptable: '&#9888;', danger: '&#10007;', unknown: '?', error: '!' };
    var classMap = { ideal: 'fwl-ideal', acceptable: 'fwl-acceptable', danger: 'fwl-danger', unknown: 'fwl-unknown', error: 'fwl-unknown' };
    var cls = classMap[result.rating] || 'fwl-unknown';
    var icon = iconMap[result.rating] || '?';
    var fwlText = result.fwl != null ? result.fwl.toFixed(2) + '%' : 'N/A';

    var html = '<div class="fwl-result-card ' + cls + '">' +
      '<div class="fwl-result-main">' +
        '<span class="fwl-icon">' + icon + '</span>' +
        '<span class="fwl-percentage">' + esc(fwlText) + '</span>' +
      '</div>' +
      '<div class="fwl-verdict">' + esc(result.message) + '</div>';

    if (result.frontTyre) {
      var frontBrandLabel = result.frontBrand ? ' [' + esc(result.frontBrand) + ']' : '';
      var rearBrandLabel = result.rearBrand ? ' [' + esc(result.rearBrand) + ']' : '';
      html += '<div class="fwl-tyre-details">' +
        '<span>Front: ' + esc(result.frontTyre) + frontBrandLabel + (result.rcFront ? ' (' + result.rcFront + ' mm)' : '') + '</span>' +
        '<span>Rear: ' + esc(result.rearTyre) + rearBrandLabel + (result.rcRear ? ' (' + result.rcRear + ' mm)' : '') + '</span>' +
      '</div>';
    }

    html += '</div>';
    return html;
  }

  function renderFwlCombinationTable(combinations) {
    if (!combinations || !combinations.length) {
      return '<div class="empty-state"><p>No tyre combinations available.</p></div>';
    }

    // Check if any combination has brand data
    var hasBrand = combinations.some(function (c) {
      return c.frontBrand || c.rearBrand;
    });

    var html = '<div class="fwl-combo-table-wrap"><table class="data-table fwl-combo-table">' +
      '<thead><tr>' +
        '<th>Front Tyre</th>' +
        '<th>Rear Tyre</th>' +
        (hasBrand ? '<th>Brand</th>' : '') +
        '<th>FWL %</th>' +
        '<th>Verdict</th>' +
      '</tr></thead><tbody>';

    combinations.forEach(function (c) {
      var rowCls = 'fwl-row-' + c.rating;
      var fwlText = c.fwl != null ? c.fwl.toFixed(2) + '%' : 'N/A';
      var ratingLabel = c.rating.charAt(0).toUpperCase() + c.rating.slice(1);

      var brandCell = '';
      if (hasBrand) {
        var brandParts = [];
        if (c.frontBrand) brandParts.push('F: ' + esc(c.frontBrand));
        if (c.rearBrand) brandParts.push('R: ' + esc(c.rearBrand));
        brandCell = '<td>' + (brandParts.length ? brandParts.join('<br>') : 'Generic') + '</td>';
      }

      html += '<tr class="' + rowCls + '">' +
        '<td>' + esc(c.frontTyre) + (c.rcFront ? '<br><small>' + c.rcFront + ' mm</small>' : '') + '</td>' +
        '<td>' + esc(c.rearTyre) + (c.rcRear ? '<br><small>' + c.rcRear + ' mm</small>' : '') + '</td>' +
        brandCell +
        '<td class="fwl-cell-value"><strong>' + esc(fwlText) + '</strong></td>' +
        '<td><span class="fwl-badge fwl-badge-' + c.rating + '">' + esc(ratingLabel) + '</span></td>' +
      '</tr>';
    });

    html += '</tbody></table></div>';
    return html;
  }

  // ── Modal ─────────────────────────────────────────────

  function showModal(title, bodyHtml, buttons) {
    var overlay = document.getElementById('modal-overlay');
    var titleEl = document.getElementById('modal-title');
    var bodyEl = document.getElementById('modal-body');
    var footerEl = document.getElementById('modal-footer');

    titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    footerEl.innerHTML = '';

    (buttons || []).forEach(function (btn) {
      var b = document.createElement('button');
      b.className = 'btn ' + (btn.cls || 'btn-secondary');
      b.textContent = btn.label;
      b.addEventListener('click', btn.onClick);
      footerEl.appendChild(b);
    });

    overlay.style.display = 'flex';

    // Focus first input if present
    setTimeout(function () {
      var firstInput = bodyEl.querySelector('input, textarea, select');
      if (firstInput) firstInput.focus();
    }, 50);
  }

  function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
  }

  // ── Public API ────────────────────────────────────────

  window.TractorApp.UI = {
    renderTractorCard: renderTractorCard,
    renderTableRow: renderTableRow,
    buildTractorForm: buildTractorForm,
    renderTyreEntryRow: renderTyreEntryRow,
    renderIarEntryRow: renderIarEntryRow,
    collectFormData: collectFormData,
    renderFwlResult: renderFwlResult,
    renderFwlCombinationTable: renderFwlCombinationTable,
    showModal: showModal,
    closeModal: closeModal,
    esc: esc
  };
})();
