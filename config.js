module.exports = {
    baseUrl: 'https://www.smarteefi.com/api/v3',
    paths: {
        login: 'user/login',
        devices: 'user/devices',
        getStatus: 'device/getstatus',
        setStatus: 'device/setstatus',
        changeSpeed: 'device/setdimctl',
        getBulkStatus: 'device/cachedstatus'
    }
}