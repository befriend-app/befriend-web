let home_dir = '/home/befriend';

module.exports = {
    apps : [
        {
            name: 'befriend_web',
            script: 'server.js',
            instances: '2',
            exec_mode: 'cluster',
            cwd: home_dir,
            node_args: '-r dotenv/config',
        }
    ]
}