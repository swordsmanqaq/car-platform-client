
axios.defaults.baseURL = "http://localhost:8081"
Vue.prototype.$http = axios;


// 定义要放行的页面
var releaseHtmls = ["/index.html","/exam.html"];
// 拿到当前要访问的页面路径
var url = location.href;
//是否放行
var isRun = false;
if(url == "http://127.0.0.1/" || url == "http://localhost/"){
    isRun = true;
}else{
    for (var i=0;i<releaseHtmls.length;i++){
        // 如果url中包含某个放行的地址,那么我们就直接放行就好了
        if(url.indexOf(releaseHtmls[i]) > -1){
            isRun = true;
            break
        }
    }
}

// 如果isRun=false，拦截做登录
if(!isRun){
    var token = localStorage.getItem("token");
    if(!token){
        //为空说明没有登录过
        alert("请登录后再次访问!");
        location.href = "/index.html";
    }
}

axios.interceptors.request.use(
    config => {
        // 从localStorage中获取token
        let token = localStorage.getItem("token");

        // 如果token有值,我们就放到请求头里面
        if (token) {
            config.headers.token = token;
        }
        return config
    },
    error => {
        return Promise.reject(error)
    })


// 响应拦截器:后端响应结果给前端时,都要先经过响应拦截器
axios.interceptors.response.use(function(response){
    //对返回的数据进行操作
    let result = response.data;  // response.data 就是后端返给我们的数据  {success:false,message:"noLogin"}
    if(!result.success && result.message == "NoLogin"){ // 说明未登录,被拦截了,那么就要跳回到登陆页面
        alert("请登录后再次访问!");
        location.href="/index.html";
    }else{
        // 如果登录过的话,就继续往下运行
        return response;
    }
},function(err){
    return Promise.reject(err)
})