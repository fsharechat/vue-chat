import MediaMessageContent from './mediaMessageContent';
import MessageContentMediaType from './messageContentMediaType';
import MessageContentType from './messageContentType';

export default class FileMessageContent extends MediaMessageContent {
    name = '';
    size = 0;
    static FILE_NAME_PREFIX = '[文件] ';

    constructor(fileOrLocalPath, remotePath) {
        super(MessageContentType.File, MessageContentMediaType.File, fileOrLocalPath, remotePath);
        if (typeof File !== 'undefined' && fileOrLocalPath instanceof File) {
            this.name = fileOrLocalPath.name;
            this.size = fileOrLocalPath.size;
        }
    }

    digest() {
        return '[文件]';
    }

    encode() {
        let payload = super.encode();
        payload.searchableContent = FileMessageContent.FILE_NAME_PREFIX + this.name;
        payload.content = this.size + '';
        return payload;
    };

    decode(payload) {
        super.decode(payload);
        if(payload.searchableContent){
            if(payload.searchableContent.indexOf(FileMessageContent.FILE_NAME_PREFIX) === 0){
                this.name = payload.searchableContent.substring(payload.searchableContent.indexOf(FileMessageContent.FILE_NAME_PREFIX) + FileMessageContent.FILE_NAME_PREFIX.length);
            }else {
        this.name = payload.searchableContent;
            }
        this.size = this.formateSize(payload.content);
        }
    }

    formateSize(value) { if (null == value || value == '') { return "0 Bytes"; }
        var unitArr = new Array("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"); var index = 0;
        var srcsize = parseFloat(value); index = Math.floor(Math.log(srcsize) / Math.log(1024));
        var size = srcsize / Math.pow(1024, index); size = size.toFixed(2);		//保留的小数位数
        return size + unitArr[index];
    }

}