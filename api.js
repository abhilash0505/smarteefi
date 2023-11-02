const HTTP_ACCOUNT = require('./helper/account');
const HTTP_DEVICE = require('./helper/device');

class Api {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.devices = {};
        this.homes = [];
        this.token = null;
    }

    async login() {
        this.token = await HTTP_ACCOUNT.login(
            {
                username: this.username,
                password: this.password
            });

        return true;
    }

    async getDeviceDetails(device) {
        const data = await HTTP_DEVICE.getStatus(device, this.token);

        if (this.devices[device.serial][device.map] === undefined)
            this.devices[device.serial][device.map] = {};

        this.devices[device.serial][device.map].status = {...data, type: "switch"};
        delete this.devices[device.serial][device.map].status.result;

        return data;
    }

    async turnOff(device){
        return await HTTP_DEVICE.turnOff(device, this.token);
    }

    async turnOn(device){
        return await HTTP_DEVICE.turnOn(device, this.token);
    }

    async changeSpeed(device, speed) {
        return await HTTP_DEVICE.changeSpeed(device, speed, this.token);
    }

    async getBulkDeviceDetails(devices) {
        const devicesList = this._prepareListOfDevices(devices);

        const data = await HTTP_DEVICE.getStatusOfManyDevices(devicesList, this.token);

        data.devlist.forEach((device) => {

            if (device.statusmap === 0) {
                //Update module status
            } else {
                //Update switch status
            }
        });

        return data;
    }

    async getDevices() {
        if (!this.token)
            throw new Error("Cannot load devices without login");

        const data = await HTTP_DEVICE.getDevices(this.token);

        data?.switches.forEach((switchItem) => {
            if (this.devices[switchItem.serial] === undefined)
                this.devices[switchItem.serial] = {};

            if (this.devices[switchItem.serial][switchItem.map] === undefined)
                this.devices[switchItem.serial][switchItem.map] = {};

            this.devices[switchItem.serial][switchItem.map] = {...switchItem};
        });

        data.modules.forEach((module) => {
            this.devices[`${module.serial}`]["0"] = {...module, type: "module"};
        });

        this.homes = data.homes;

        return this.devices;
    }

    _prepareListOfDevices(devices) {
        let devicesList = [];

        if (devices === undefined || devices === null) {
            for (let serial in this.devices) {
                for (let map in this.devices[serial]) {
                    if (parseInt(map) !== 0) {
                        devicesList.push({
                            serial,
                            map
                        })
                    }
                }
            }
        } else {
            devices.forEach((device) => {
                devicesList.push({
                    serial: device.serial,
                    map: device.map
                })
            })
        }

        return devicesList;
    }
}

module.exports = Api;