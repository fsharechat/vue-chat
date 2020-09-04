import AbstractMessageHandler from "./abstractmessagehandler";
import { PUB_ACK, LRM } from "../../constant";

export default class LoadRemoteMessageHandler extends AbstractMessageHandler {
    match(proto){
        return proto.signal == PUB_ACK && proto.subSignal == LRM;
    }
}