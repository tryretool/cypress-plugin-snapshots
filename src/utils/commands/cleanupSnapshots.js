/* globals Cypress, before, after, cy */
/* eslint-env browser */
const { formatNormalizedJson, } = require('../../utils/json');
const getTextSnapshotFilename = require('../text/getSnapshotFilename');
const { snapshotTitleIsUsed } = require('../../utils/snapshotTitles');
const getConfig = require('./getConfig');
const { NO_LOG } = require('../../constants');

// Removes unused snapshots from snapshot file
function cleanUpSnapshots() {
  const config = getConfig();
  if (!config.autoCleanUp) {
    return;
  }

  const filename = getTextSnapshotFilename(Cypress.spec.relative);
  cy.readFile(filename, NO_LOG).then((content) => {
    if (content) {
      const snapshot = JSON.parse(content);
      const keys = Object.keys(snapshot);

      const cleanSnapshot = keys
        .filter(snapshotTitleIsUsed)
        .reduce((result, key) => {
          result[key] = snapshot[key];
          return result;
        }, {});

      cy.writeFile(filename,
        formatNormalizedJson(cleanSnapshot),
        NO_LOG);
    }
  });
}

module.exports = cleanUpSnapshots;