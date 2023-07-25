const Docker = require('dockerode');
const stream = require('stream');

const docker = new Docker();
const container = docker.getContainer('1ac82c7fb55a5707c45642730e4ffc71d05da7de6ba0cd7e1ac92d170bd73c17');

  var logStream = new stream.PassThrough();
  logStream.on('data', function(chunk){
    console.log(chunk.toString('utf8'));
  });

  container.logs({
    follow: true,
    stdout: true,
    stderr: true
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
    }, 10000);
  });
