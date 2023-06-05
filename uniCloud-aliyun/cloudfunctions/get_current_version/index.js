'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	const version = await db.collection('version').get();

	//返回数据给客户端
	return {
		code: 0,
		data: {
			version: version.data[0].current_version;
			downLoadLinkUrl: "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-f587c0cc-185d-49e7-babb-25190b7dcd13/49fedd88-13c1-417f-bc51-0d04a0d592e1.apk"
		}
	}
};
