import { render, screen, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';

import * as DemoStories from './demo.stories';
import { toPlaces } from './index';

const { BaseAreteansSushLibAwardPodium, OneNameMissing, NoNames, LongName, HiddenLabel } =
  composeStories(DemoStories);

test('renders the three winners in rank order with their awards', () => {
  render(<BaseAreteansSushLibAwardPodium />);
  expect(screen.getByRole('heading', { name: 'Our Stars' })).toBeVisible();

  const places = within(screen.getByRole('list', { name: 'Our Stars' })).getAllByRole('listitem');
  expect(places).toHaveLength(3);
  expect(places[0]).toHaveTextContent('Priya Raman');
  expect(places[0]).toHaveTextContent('Employee of the Month');
  expect(places[0]).toHaveTextContent('Rank 1');
  expect(places[1]).toHaveTextContent('Marcus Okafor');
  expect(places[1]).toHaveTextContent('Star of the Week');
  expect(places[2]).toHaveTextContent('Elena Fischer');
  expect(places[2]).toHaveTextContent('Inspiration of the Day');
});

test('shows "To be announced" for a blank name', () => {
  render(<OneNameMissing />);
  const places = screen.getAllByRole('listitem');
  expect(places[1]).toHaveTextContent('To be announced');
  expect(places[1]).toHaveTextContent('Star of the Week');
});

test('shows an empty state when no names are configured', () => {
  render(<NoNames />);
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
  expect(screen.getByText('No awards have been announced yet.')).toBeVisible();
});

test('renders a long name in full', () => {
  render(<LongName />);
  expect(screen.getByText('Maximiliana Alexandrina Featherstonehaugh-Montgomery')).toBeVisible();
});

test('hides the heading but keeps the list name when hideLabel is set', () => {
  render(<HiddenLabel />);
  expect(screen.queryByRole('heading', { name: 'Our Stars' })).not.toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'Our Stars' })).toBeInTheDocument();
});

test('toPlaces trims names and defaults missing ones to blank', () => {
  expect(toPlaces('  Ann  ').map(place => place.name)).toEqual(['Ann', '', '']);
  expect(toPlaces(null, null, null).map(place => place.name)).toEqual(['', '', '']);
});
