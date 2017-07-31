var cluster = require('cluster');

function startWorker() {
    var worker = cluster.fork();
    console.log('CLUSTER: Worker started - ' + worker.id);
}

if (cluster.isMaster) {
    require('os').cpus().forEach(function(){
        startWorker();
    });
    
    cluster.on('disconnect', function(worker){
        console.log('CLUSTER: Worker disconnected');
    })
    
    cluster.on('exit', function(worker, code, signal){
        console.log('New Worker Started')
        startWorker();
    })
}else{
    require('./server.js');
}