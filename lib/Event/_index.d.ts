import preInit from "./preInit";
import init from "./init";
import cycle from "./cir";
declare const Event: {
    preInit: typeof preInit;
    init: typeof init;
    cycle: typeof cycle;
};
export default Event;
