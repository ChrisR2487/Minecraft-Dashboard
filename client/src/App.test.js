import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');

// Define a helper function to mock a successful response from axios
const mockAxiosGet = (url, response) => {
  axios.get.mockImplementationOnce((url) => Promise.resolve(response));
};

test('starts and stops the server', async () => {
  // Mock the responses for the status, start, and stop requests
  mockAxiosGet('http://localhost:3000/status', { data: { status: 'Running' } });
  mockAxiosGet('http://localhost:3000/stop', { data: 'Server stopped' });
  mockAxiosGet('http://localhost:3000/start', { data: 'Server started' });

  render(<App />);

  // Check that the server status is displayed
  await waitFor(() => screen.getByText('Status: Running'));

  // Click the "Stop Server" button and check that the server is stopped
  userEvent.click(screen.getByText('Stop Server'));
  await waitFor(() => screen.getByText('Status: Stopped'));

  // Click the "Start Server" button and check that the server is started
  userEvent.click(screen.getByText('Start Server'));
  await waitFor(() => screen.getByText('Status: Running'));

  // Check that the correct axios.get calls were made
  expect(axios.get).toHaveBeenCalledTimes(3);
  expect(axios.get).toHaveBeenNthCalledWith(1, 'http://localhost:3000/status');
  expect(axios.get).toHaveBeenNthCalledWith(2, 'http://localhost:3000/stop');
  expect(axios.get).toHaveBeenNthCalledWith(3, 'http://localhost:3000/start');
});
