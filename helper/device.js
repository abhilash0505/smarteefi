const HTTP = require('./http');
const CONFIG = require("../config");

module.exports = {
    getDevices: async (token) => {
        const url = `${CONFIG.baseUrl}/${CONFIG.paths.devices}`;
        const dataObject = {
            "UserDevice": {
                "access_token": token,
            }
        };

        return await HTTP.MAKE_POST_CALL(url,
            dataObject,
            "Failed to get devices");
    },

    getStatus: async (device, token) => {
        const url = `${CONFIG.baseUrl}/${CONFIG.paths.getStatus}`;
        const dataObject = {
            "DeviceStatus": {
                "access_token": token,
                "serial": device.serial,
                "switchmap": device.map,
                "statusmap": 0,
                "duration": 0
            }
        };

        return await HTTP.MAKE_POST_CALL(url,
            dataObject,
            "Failed to get device details",
            module.exports._getOfflineStringForDevice(device?.name)
        );
    },


    getStatusOfManyDevices: async (devicesList, token) => {
        const url = `${CONFIG.baseUrl}/${CONFIG.paths.getBulkStatus}`;
        const dataObject = {
            "access_token": token,
            "devlist": devicesList
        };

        return await HTTP.MAKE_POST_CALL(url,
            dataObject,
            "Failed to get bulk devices detail",
            module.exports._getOfflineStringForDevice(device?.name)
        );
    },

    turnOff: async (device, token) => {
        return await module.exports._toggleSwitch(device, token, false);
    },

    turnOn: async (device, token) => {
        return await module.exports._toggleSwitch(device, token, true);
    },

    changeSpeed: async (device, speed, token) => {
        const url = `${CONFIG.baseUrl}/${CONFIG.paths.changeSpeed}`;
        const dataObject = {
            "DimControl": {
                "access_token": token,
                "serial": device?.serial,
                "appliancemap": device?.map,
                "ctlflag": 0,
                "value": speed,
                "duration": 0
            }
        };

        console.log(`Changing Speed to ${speed} :  ${device.name}`);

        return await HTTP.MAKE_POST_CALL(url,
            dataObject,
            "Failed to get bulk devices detail",
            module.exports._getOfflineStringForDevice(device?.name)
        );
    },

    _getOfflineStringForDevice: (deviceName) => {
        return `Device Offline: ${deviceName}`;
    },


    _toggleSwitch: async (device, token, status = true) => {
        const url = `${CONFIG.baseUrl}/${CONFIG.paths.setStatus}`;
        const dataObject = {
            "DeviceStatus": {
                "access_token": token,
                "serial": device.serial,
                "switchmap": device.map,
                "statusmap": status ? device.map : 0,
                "duration": 0
            }
        };

        console.log(`Turning ${status ? 'ON' : 'OFF'} ${device.name}`);

        return await HTTP.MAKE_POST_CALL(url,
            dataObject,
            `Failed to set device status to ${status ? 'ON' : 'OFF'}`,
            module.exports._getOfflineStringForDevice(device?.name)
        );
    }
}