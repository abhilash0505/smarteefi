require('dotenv').config();

const SmarteefiAPI = require('../index');

(async () => {
    const apiHelper = new SmarteefiAPI(process.env.USERNAME, process.env.PASSWORD);
    if(await apiHelper.login()) {
        console.log(apiHelper.token);
        const devices = await apiHelper.getDevices();

        console.log(`${Object.keys(devices).length} Modules found`);

        let deviceCount = 0;
        for (let serial in devices) {
            for(let map in devices[serial]){
                if(parseInt(map) !== 0){
                    deviceCount++;
                    const currentDevice = devices[serial][map];
                    console.log(`Updating ${currentDevice.name} details`);
                    try {
                        await apiHelper.getDeviceDetails(currentDevice);
                    }catch(e){
                        console.error(e);
                    }
                    if(parseInt(map) === 112){
                        try {
                            await apiHelper.changeSpeed(currentDevice, 1);
                        }catch(e){
                            console.error(e);
                        }
                    }
                }
            }
        }

        console.log(`${deviceCount} Devices/Switches Found`);

        // await apiHelper.getBulkDeviceDetails();



    }else{
        console.error("Failed to login");
    }

})();