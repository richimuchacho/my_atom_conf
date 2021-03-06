'use babel'

import { Range } from 'atom'
import { it } from 'jasmine-fix'
import ProviderHighlight from '../lib/provider-highlight'

describe('ProviderHighlight', function() {
  let editor
  let providerParams
  let providerHighlight

  beforeEach(function() {
    if (providerHighlight) {
      providerHighlight.dispose()
    }
    providerHighlight = new ProviderHighlight()
    atom.packages.activatePackage('language-javascript')
    atom.workspace.destroyActivePane()
    waitsForPromise(function() {
      return atom.workspace.open(__filename).then(function() {
        editor = atom.workspace.getActiveTextEditor()
        providerParams = { textEditor: editor, visibleRange: Range.fromObject([[0, 0], [13, Infinity]]) }
      })
    })
  })

  it('works', async function() {
    let requestIntentionsCalled = false
    providerHighlight.onShouldProvideDeclarations(function(e) {
      expect(e.parameters.visibleRange).toEqual({
        start: {
          row: 0,
          column: 0,
        },
        end: {
          row: 13,
          column: Infinity,
        },
      })
      if (requestIntentionsCalled) {
        return
      }
      requestIntentionsCalled = true
      e.result = [{
        range: [[1, 1], [1, Infinity]],
      }]
    })

    let results
    results = await providerHighlight.getIntentions(providerParams)
    expect(results).toEqual([{
      range: [[1, 1], [1, Infinity]],
      created: results[0].created,
    }])
    expect(requestIntentionsCalled).toBe(true)
    results = await providerHighlight.getIntentions(providerParams)
    expect(results).toEqual([])
  })
})
