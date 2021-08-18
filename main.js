const { app, Tray, Menu } = require('electron')
const { getRunningContainers, toggleContainer } = require('./utils/docker')

var tray = null

app.whenReady().then(() => {
    tray = new Tray('./icon.png')
    fetch()
})

const fetch = () => {
    getRunningContainers((cont) => {
        console.log(cont);
        const menu = Menu.buildFromTemplate(cont.map(el => ({
            label: el.name, 
            type: 'checkbox',
            checked: el.running,
            click: () => {
                toggleContainer(el, () => fetch)
            }
        })))

        tray.setContextMenu(menu)
    })
}

setInterval(() => {
    tray = tray
}, 3000)