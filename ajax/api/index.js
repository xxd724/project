// 使用webpack的require.context()方法对所有的请求函数收集
// require.context()是什么？
// 一个webpack的api，通过执行require.context()函数获取一个特定的上下文，主要用来实现自动化导入模块，在前端工程中，如果遇到从一个文件夹引入很多模块的情况，可以使用这个api，它会遍历文件夹中的指定文件，然后自动导入，使得不需要每次显示的调用import导入模块

// require.context(directory,useSubdirectories,regExp)
// 1、directory:表示检索的目录
// 2、useSubdirectories：表示是否检索子文件夹
// 3、regExp:匹配文件的正则表达式,一般是文件名
// 	例如 require.context("@/views/components",false,/.vue$/)
	
const requireApi=require.context('.',true,/js$/); 
 let module={};
 requireApi.keys().forEach((key,index) => {
	 if(key == './index.js'){ return};
	 Object.assign(module,requireApi(key));
 })
 export default module;