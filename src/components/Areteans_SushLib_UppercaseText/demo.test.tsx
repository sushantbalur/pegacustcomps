import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';

const { BaseAreteansSushLibUppercaseText: Base } = composeStories(DemoStories);

const getInput = () => screen.getByRole('textbox', { name: /reference code/i }) as HTMLInputElement;

test('renders label, placeholder and helper text', () => {
  render(<Base />);
  const input = getInput();
  expect(input.value).toBe('');
  expect(input).toHaveAttribute('placeholder', 'Type a code');
  expect(input).toHaveAccessibleDescription(/converted to uppercase/i);
});

test('converts typed text to uppercase without committing', () => {
  const onTriggerFieldChange = jest.fn();
  const storyArgs: Record<string, unknown> = { onTriggerFieldChange };
  render(<Base {...storyArgs} />);
  fireEvent.change(getInput(), { target: { value: 'abc-12x' } });
  expect(getInput().value).toBe('ABCX');
  expect(onTriggerFieldChange).not.toHaveBeenCalled();
});

test('ignores numbers and special characters but keeps underscores', () => {
  render(<Base />);
  fireEvent.change(getInput(), { target: { value: 'a1_b!c 2@' } });
  expect(getInput().value).toBe('A_BC');
});

test('commits the uppercase value on blur', () => {
  const onTriggerFieldChange = jest.fn();
  const storyArgs: Record<string, unknown> = { onTriggerFieldChange };
  render(<Base {...storyArgs} />);
  fireEvent.change(getInput(), { target: { value: 'hello' } });
  fireEvent.blur(getInput());
  expect(onTriggerFieldChange).toHaveBeenCalledWith('.ReferenceCode', 'HELLO');
});

test('unchanged blur only validates', () => {
  const onTriggerFieldChange = jest.fn();
  const onValidate = jest.fn();
  const storyArgs: Record<string, unknown> = { onTriggerFieldChange, onValidate };
  render(<Base {...storyArgs} />);
  fireEvent.blur(getInput());
  expect(onValidate).toHaveBeenCalledWith('');
  expect(onTriggerFieldChange).not.toHaveBeenCalled();
});

test('truncates to maxLength', () => {
  render(<Base maxLength={5} />);
  fireEvent.change(getInput(), { target: { value: 'abcdefgh' } });
  expect(getInput().value).toBe('ABCDE');
});

test('treats null value as empty and accepts typing over it', () => {
  render(<Base value={null} />);
  expect(getInput().value).toBe('');
  fireEvent.change(getInput(), { target: { value: 'x' } });
  expect(getInput().value).toBe('X');
});

test('handles a long value', () => {
  render(<Base maxLength={undefined} />);
  const long = 'a'.repeat(300);
  fireEvent.change(getInput(), { target: { value: long } });
  expect(getInput().value).toBe(long.toUpperCase());
});

test('required, disabled and read-only states', () => {
  const { rerender } = render(<Base required />);
  expect(getInput()).toBeRequired();
  rerender(<Base disabled />);
  expect(getInput()).toBeDisabled();
  rerender(<Base readOnly />);
  expect(getInput()).toHaveAttribute('readonly');
});

test('read-only string flag does not commit on blur', () => {
  const onTriggerFieldChange = jest.fn();
  const storyArgs: Record<string, unknown> = { onTriggerFieldChange, readOnly: 'true', value: 'ABC' };
  render(<Base {...storyArgs} />);
  const input = screen.queryByRole('textbox');
  if (input) fireEvent.blur(input);
  expect(onTriggerFieldChange).not.toHaveBeenCalled();
});

test('validation message replaces helper text', () => {
  render(<Base validatemessage='Cannot be blank' />);
  expect(getInput()).toHaveAccessibleDescription(/cannot be blank/i);
});

test('hidden label keeps the accessible name', () => {
  render(<Base hideLabel />);
  expect(getInput()).toBeInTheDocument();
});

test('DISPLAY_ONLY shows the value without an input', () => {
  render(<Base displayMode='DISPLAY_ONLY' value='SHOWN' />);
  expect(screen.getByText('SHOWN')).toBeVisible();
  expect(screen.queryByRole('textbox')).toBeNull();
});

test('DISPLAY_ONLY with no value renders no input', () => {
  render(<Base displayMode='DISPLAY_ONLY' />);
  expect(screen.queryByRole('textbox')).toBeNull();
});
