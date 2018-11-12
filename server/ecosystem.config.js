module.exports = {
  apps : [{
    name      : 'donnieslist-server',
    script    : './index.js',
    env: {
      NODE_ENV: 'development'
    },
    env_production : {
      NODE_ENV: 'production'
    },
    exec_mode: 'cluster',
    instances: 'max',
    output: './logs/out.log',
    error: './logs/error.log',
    log: './logs/combined.outerr.log',
  }],

  deploy : {
    production : {
      user : 'node',
      host : '<>',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : './index.js',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
