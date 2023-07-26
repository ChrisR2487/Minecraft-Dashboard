import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import App from './App';

// Set up a mock server to intercept HTTP requests
const server = setupServer(
  rest.get('http://localhost:3000/status', (req, res, ctx) => {
    return res(ctx.json({ status: 'Running' }));
  }),
  rest.get('http://localhost:3000/start', (req, res, ctx) => {
    return res(ctx.text('Server started'));
  }),
  rest.get('http://localhost:3000/stop', (req, res, ctx) => {
    return res(ctx.text('Server stopped'));
  })
);

beforeAll(() => server.listen());  // Start the mock server
afterEach(() => server.resetHandlers());  // Reset any runtime request handlers
afterAll(() => server.close());  // Stop the mock server

test('starts and stops the server', async () => {
  render(<App />);

  // Check that the server status is displayed
  await waitFor(() => screen.getByText('Status: Running'));

  // Click the "Stop Server" button and check that the server is stopped
  userEvent.click(screen.getByText('Stop Server'));
  await waitFor(() => screen.getByText('Status: Stopped'));

  // Click the "Start Server" button and check that the server is started
  userEvent.click(screen.getByText('Start Server'));
  await waitFor(() => screen.getByText('Status: Running'));
});
