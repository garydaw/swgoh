import ComlinkStub from '@swgoh-utils/comlink';

const comlink = new ComlinkStub({
    url: process.env.COMLINK_URL,
    accessKey: process.env.COMLINK_ACCESS_KEY,
    secretKey: process.env.COMLINK_SECRET_KEY
});

export default comlink;