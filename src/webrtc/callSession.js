import CallState from "./callState";
export default class CallSession{
    callId;
    clientId;
    audioOnly;
    startTime;
    sessionCallback;
    callState;
    voipClient;
    tos;

    constructor(voipClient){
        this.startTime = new Date().getTime();
        this.voipClient = voipClient;
    }

    setState(state){
       if(this.callState != state){
            var previousState = this.callState;
            this.callState = state;
            console.log("set current call state "+this.callState);
            switch(state){
                case CallState.STATUS_INCOMING:
                case CallState.STATUS_OUTGOING:
                    this.voipClient.currentEngineCallback.shouldStartRing(state === CallState.STATUS_INCOMING)    
                    break;
                case CallState.STATUS_CONNECTING:
                    this.voipClient.currentEngineCallback.shouldSopRing()
                    break;
                case CallState.STATUS_IDLE:
                case CallState.STATUS_CONNECTED:
                    if (previousState == CallState.STATUS_INCOMING || previousState == CallState.STATUS_OUTGOING) {
                        this.voipClient.currentEngineCallback.shouldSopRing();
                    }
                    break;

            }
            if(this.sessionCallback){
                this.sessionCallback.didChangeState(this.callState);
            }
       }
       
    }

    endCall(endCallReason,sender=''){
       this.setState(CallState.STATUS_IDLE);
       this.voipClient.closeCall();
       this.voipClient.currentSession = null;
       if(this.sessionCallback){
         this.sessionCallback.didCallEndWithReason(endCallReason,sender);
       }
    }
}