const {exec} = require('child_process')

/**
 * 
 * @callback {Array} callback
 * @returns 
 */
exports.getRunningContainers = (callback) => exec(`docker ps -a --format '{{.ID}}---{{.Names}}---{{.State}}---{{.Labels}}'`, (err, resp, getter) => {
	let containers = resp.split('\n').filter(el => el.length ?? el).map(container => {
    container = container.split('---')
    return {
      id: container[0],
      name: container[1],
      status: container[2],
      running: container[2] === 'running',
      labels: container[3]
    }
  })
  callback(containers)
})

/**
 * 
 * @param {Object} container 
 * @param {String} container.name 
 * @param {String} container.id 
 * @param {String} container.status 
 */
exports.toggleContainer = (container, cb) => {
  const labels = container.labels.split(',')
  const workingDir = labels.find(el => el.includes('com.docker.compose.project.working_dir')).split('=')[1]
  const service = labels.find(el => el.includes('com.docker.compose.service')).split('=')[1]
  if (container.running) {
    exec(`docker-compose -f ${workingDir}/docker-compose.yml stop ${service}`, (err, data) => {
      if (err) {}
      cb()
    })
  } else {
    exec(`docker-compose -f ${workingDir}/docker-compose.yml start ${service}`, (err, data) => {
      if (err) {}
      cb()
    })
  }
  console.log(container.running);
  container.running = !container.running
}
