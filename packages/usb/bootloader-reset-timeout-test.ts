#!/usr/bin/env ../../node_modules/.bin/ts-node-script

import Uhk, { errorHandler, yargs } from './src';
import { EnumerationModes, waitForDevice } from 'uhk-usb';
import { KBoot, UsbPeripheral } from '../kboot';
import { UHK_60_DEVICE } from 'uhk-common';

(async function () {
    try {
        const argv = yargs
            .usage('Test 2 bootloader timeout after KBoot reset command')
            .argv;

        const { device } = Uhk(argv);
        console.info('Start Bootloader re-enumeration with 60 sec');

        await device.reenumerate({
            enumerationMode: EnumerationModes.Bootloader,
            timeout: 60000,
            vid: UHK_60_DEVICE.vid,
            pid: UHK_60_DEVICE.bootloaderId
        });

        console.info('Kboot reset');
        const kboot = new KBoot(new UsbPeripheral({ vendorId: UHK_60_DEVICE.vid, productId: UHK_60_DEVICE.bootloaderId }));
        await kboot.reset();

        console.info('Wait for Keyboard');

        await waitForDevice(UHK_60_DEVICE.vid, UHK_60_DEVICE.pid);

    } catch (error) {
        errorHandler(error);
    }
})();
