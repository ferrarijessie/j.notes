import React from 'react';
import { render, screen } from '@testing-library/react';
import { BaseProvider, LightTheme } from 'baseui';
import { Provider as StyletronProvider } from 'styletron-react';
import { Client as StyletronClient } from 'styletron-engine-atomic';

import NoteOverlay from '../src/app/components/NoteOverlay';

test('shows placeholder when content is default seed', () => {
  const engine = new StyletronClient();

  render(
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <NoteOverlay
          open={true}
          categories={[]}
          selectedCategoryId={null}
          onSelectCategoryId={() => {}}
          title={'Note Title'}
          onChangeTitle={() => {}}
          content={'Note content...'}
          onChangeContent={() => {}}
          error={null}
          lastEditedAt={null}
          onEdited={() => {}}
          onClose={() => {}}
        />
      </BaseProvider>
    </StyletronProvider>,
  );

  const textbox = screen.getByPlaceholderText('Pour your heart out...') as HTMLTextAreaElement;
  expect(textbox.value).toBe('');
});
