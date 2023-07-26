var Docker = require('dockerode');
var stream = require('stream');

var docker = new Docker({
  socketPath: '/var/run/docker.sock'
});

/**
 * Get logs from running container
 */
function containerLogs(container) {

  // create a single stream for stdin and stdout
  var logStream = new stream.PassThrough();
  logStream.on('data', function(chunk){
    console.log(chunk.toString('utf8'));
  });

  container.logs({
    follow: true,
    stdout: true,
    stderr: true,
    tail: 10000
  }, function(err, stream){
    if(err) {
      return logger.error(err.message);
    }
    container.modem.demuxStream(stream, logStream, logStream);
    stream.on('end', function(){
      logStream.end('!stop!');
    });

    setTimeout(function() {
      stream.destroy();
    }, 2000);
  });
}

// docker.createContainer({
//     Image: 'ubuntu',
//     Tty: true,
//     Cmd: ['/bin/bash', '-c', 'apt-get update && apt-get install -y iputils-ping && ping 8.8.8.8']
//   }, function(err, container) {
//     if (err) {
//       console.error("Error creating container:", err);
//       return;
//     }

//     container.start({}, function(err, data) {
//       if (err) {
//         console.error("Error starting container:", err);
//         return;
//       }

//       containerLogs(container);
//     });
//   });

  const container = docker.getContainer('8cbc8b8cc2457f586679d0de4965b3cd925b6362564b5cbb5b59a807b30a049b');
  containerLogs(container);
