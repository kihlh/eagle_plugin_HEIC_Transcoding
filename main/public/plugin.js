if (typeof window.eagle != "undefined") {
    eagle.onPluginCreate((plugin) => {
        console.log('eagle.onPluginCreate');
        console.log(plugin);
        console.log('eagle.onPluginCreate', window?.eagle?.item?.getSelected());

    });

    eagle.onPluginRun(() => {
        console.log('eagle.onPluginRun');
    });

    eagle.onPluginShow(() => {
        console.log('eagle.onPluginShow');
    });

    eagle.onPluginHide(() => {
        console.log('eagle.onPluginHide');
    });

    eagle.onPluginBeforeExit((event) => {
        console.log('eagle.onPluginBeforeExit');
    });
}