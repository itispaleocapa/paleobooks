(this.webpackJsonpfrontend_react=this.webpackJsonpfrontend_react||[]).push([[0],{64:function(e,t,n){e.exports=n(77)},69:function(e,t,n){},70:function(e,t,n){e.exports=n.p+"static/media/logo.ee7cd8ed.svg"},71:function(e,t,n){},77:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),i=n(9),l=n.n(i),r=(n(69),n(27)),c=n(29),s=n(28),u=(n(70),n(71),n(124)),d=n(125),g=n(57),h=n(46),m=n(11),p=n(54),f=n(37),E=n(115),b=n(126),v=n(78),w=n(127),k=n(129),y=n(119),I=n(120),C=n(121),x=n(122),L={request:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"GET",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return new Promise((function(a,o){fetch("https://www.paleobooks.it/pbapi/public"+e,{method:t,headers:{"Content-Type":"application/json",Authorization:"Bearer "+sessionStorage.getItem("access_token")},body:n}).then((function(e){200!==e.status?o():e.json().then((function(e){a(e)}))}))}))},login:function(e,t){return new Promise((function(n,a){L.request("/auth/login","POST",JSON.stringify({email:e,password:t})).then((function(e){var t=new Date;t.setFullYear(t.getFullYear()+1),sessionStorage.setItem("access_token",e.access_token),document.cookie="refresh_token="+e.refresh_token+"; expires="+t.toUTCString()+"; path=/",n()})).catch((function(){a()}))}))},logout:function(){var e=new Date;e.setFullYear(e.getFullYear()+1),sessionStorage.setItem("access_token",null),document.cookie="refresh_token=; expires="+e.toUTCString()+"; path=/"},isLoggedIn:function(){return new Promise((function(e,t){L.request("/users/profile").then((function(t){e()})).catch((function(){t()}))}))}},O=L,j=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).handleInputChange=function(e,t){a.setState(Object(p.a)({},e,t.target.value))},a.handleLogin=function(){O.login(a.state.email,a.state.password).then((function(e){a.props.checkLogin()})).catch((function(){a.setState({dialogTitle:"Errore",dialogContent:"Credenziali non valide",dialogOpen:!0})}))},a.handleRegistrationBtn=function(){a.setState({dialogTitle:"Attenzione",dialogContent:"Questa funzione non \xe8 ancora disponibile",dialogOpen:!0})},a.dialogHandleClose=function(){a.setState({dialogOpen:!1})},a.state={name:"",email:"",password:""},a.state.paleoIdUrl="https://id.paleo.bg.it/oauth/authorize?client_id=0cfa9278e6d017629b9dc26bffbd8335&response_type=code&state=paleobooks&redirect_uri="+encodeURIComponent("https://www.paleobooks.it/pbr/login"),a}return Object(f.a)(n,[{key:"render",value:function(){var e=this;return o.a.createElement(E.a,{style:{alignItems:"center",marginTop:"10px"}},o.a.createElement(v.a,{style:{maxWidth:"500px",padding:"15px",margin:"0 auto"}},o.a.createElement("form",{noValidate:!0,autoComplete:"off"},o.a.createElement(g.a,{variant:"h4",style:{textAlign:"center"}},"Login"),o.a.createElement(b.a,{id:"outlined-basic",label:"Email",variant:"outlined",fullWidth:!0,style:{marginTop:"10px"},onChange:function(t){return e.handleInputChange("email",t)}}),o.a.createElement(b.a,{id:"outlined-basic",label:"Password",variant:"outlined",fullWidth:!0,type:"password",style:{marginTop:"10px"},onChange:function(t){return e.handleInputChange("password",t)}}),o.a.createElement("div",{style:{width:"fit-content",margin:"12px auto 10px"}},o.a.createElement(w.a,{variant:"contained",style:{marginRight:"4px"},onClick:this.handleLogin},"Accedi"),o.a.createElement(w.a,{variant:"contained",style:{marginLeft:"4px"},onClick:this.handleRegistrationBtn},"Registrati")),o.a.createElement("div",{style:{width:"fit-content",margin:"20px auto 0px"}},o.a.createElement(w.a,{variant:"contained",color:"primary",href:this.state.paleoIdUrl},"Accedi con PaleoID")))),o.a.createElement(k.a,{open:this.state.dialogOpen,onClose:this.dialogHandleClose,"aria-labelledby":"alert-dialog-title","aria-describedby":"alert-dialog-description"},o.a.createElement(y.a,{id:"alert-dialog-title"},this.state.dialogTitle),o.a.createElement(I.a,null,o.a.createElement(C.a,{id:"alert-dialog-description"},this.state.dialogContent)),o.a.createElement(x.a,null,o.a.createElement(w.a,{onClick:this.dialogHandleClose,color:"primary",autoFocus:!0},"Chiudi"))))}}]),n}(o.a.Component),S=n(123),z=n(55),T=function(e){var t=e.component,n=e.auth,a=e.wasInitialized,i=Object(z.a)(e,["component","auth","wasInitialized"]);return o.a.createElement(m.b,Object.assign({},i,{render:function(e){return!0===n?o.a.createElement(t,e):a?o.a.createElement(m.a,{to:"/login"}):""}}))},_=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(e){var a;return Object(r.a)(this,n),(a=t.call(this,e)).handleLogout=function(){O.logout(),a.props.checkLogin()},a}return Object(f.a)(n,[{key:"render",value:function(){return o.a.createElement(o.a.Fragment,null,o.a.createElement(g.a,{variant:"h4",style:{textAlign:"center",marginTop:"15px"}},"Sono la home page!"),o.a.createElement(w.a,{variant:"contained",color:"secondary",style:{margin:"10px auto",display:"block"},onClick:this.handleLogout},"Logout"))}}]),n}(o.a.Component),P=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(){var e;return Object(r.a)(this,n),(e=t.call(this)).componentDidMount=function(){e.chechLogin()},e.chechLogin=function(){O.isLoggedIn().then((function(){e.setState({isLoggedIn:!0,wasInitialized:!0}),console.log(!0)})).catch((function(){e.setState({isLoggedIn:!1,wasInitialized:!0}),console.log(!1)}))},e.render=function(){return null===e.state.isLoggedIn?o.a.createElement("div",{style:{margin:"20px auto",width:"fit-content"}},o.a.createElement(S.a,null)):o.a.createElement(h.a,null,o.a.createElement(u.a,{position:"static",style:{alignItems:"center"}},o.a.createElement(d.a,null,o.a.createElement(g.a,{variant:"h6"},"PaleoBooks"))),o.a.createElement(m.d,null,o.a.createElement(T,{auth:e.state.isLoggedIn,wasInitialized:e.state.wasInitialized,exact:!0,component:function(){return o.a.createElement(_,{checkLogin:e.chechLogin})},path:"/"}),o.a.createElement(m.b,{exact:!0,path:"/login"},e.state.isLoggedIn?o.a.createElement(m.a,{to:""}):o.a.createElement(j,{checkLogin:e.chechLogin})),o.a.createElement(m.b,{path:"*"},o.a.createElement(m.a,{to:""}))))},e.state={isLoggedIn:null,wasInitialized:!1},e}return n}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(P,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[64,1,2]]]);
//# sourceMappingURL=main.bd2ce00a.chunk.js.map