const Docker = require('dockerode');

const docker = new Docker();

docker.listContainers((err, containers) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log('Containers:', containers);
});
