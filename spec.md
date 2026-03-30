# Spelling Checker

## Current State
New project with empty backend and no frontend implementation.

## Requested Changes (Diff)

### Add
- Text input area where users can type or paste text
- Real-time spell checking that highlights misspelled words
- Click on a highlighted word to see correction suggestions
- Ability to accept a suggestion or ignore the error
- Word count and error count summary
- Clear/reset button

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
- Frontend-only spelling checker using the browser's built-in spell check capabilities combined with a custom JS dictionary approach
- Use a popular JS spell-check library (e.g., nspell with a dictionary) or implement using a simple word comparison with a common English dictionary
- Highlight misspelled words inline in the text display area
- Show suggestion popover on clicking a highlighted word
- Display stats bar: word count, error count
- Backend: minimal (just a hello world actor, no backend APIs needed for core spell check functionality)
