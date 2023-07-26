// Import the functions from server.js
const { startServer, stopServer, getServerStatus } = require('./server');

// Define a group of related tests
describe('Server Functions', () => {

    // Mock the Docker container that is used in the server.js functions
    const container = {
        start: jest.fn().mockResolvedValue(),
        stop: jest.fn().mockResolvedValue(),
        inspect: jest.fn()
    };

    // Test the startServer function
    it('should start the server', async () => {
        // Call the function with the mock container
        const result = await startServer(container);

        expect(result).toBe('Server started');

        // Check that the container's start method was called
        expect(container.start).toHaveBeenCalled();
    });

    // Test the stopServer function
    it('should stop the server', async () => {
        const result = await stopServer(container);
        expect(result).toBe('Server stopped');
        expect(container.stop).toHaveBeenCalled();
    });

    // Test the getServerStatus function when the server is running
    it('should return "Running" when the server is running', async () => {
        // Set up the mock container to indicate that the server is running
        container.inspect.mockResolvedValue({ State: { Running: true } });

        const status = await getServerStatus(container);

        expect(status).toEqual({ status: 'Running' });
    });

    // Test the getServerStatus function when the server is not running
    it('should return "Stopped" when the server is not running', async () => {
        // Set up the mock container to indicate that the server is not running
        container.inspect.mockResolvedValue({ State: { Running: false } });

        const status = await getServerStatus(container);

        expect(status).toEqual({ status: 'Stopped' });
    });

});
