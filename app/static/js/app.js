/* Add your Application JavaScript */
Vue.component('app-header', {
    template: `
     <div>
    <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet"> 
    <link rel="stylesheet" type="text/css" href="static/css/next.css">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <a class="navbar-brand" href="#" id = "gram"><img class="icon" :src="'/static/css/cam.jpg'">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"  v-if="user">
          <li class="nav-item active">
            <router-link class="nav-link" to="/" >Home <span class="sr-only">(current)</span></router-link>
          </li>
        
          <li class="nav-item active" >
            <router-link class="nav-link" to= "/explore"> Explore <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active" >
            <router-link class="nav-link"  v-bind:to="'/users/'+ userid""> My Profile <span class="sr-only">(current)</span></router-link>
          </li>
        </ul>
        <ul class="navbar-nav" v-if="user">
            <li class="nav-item active">
              <router-link class="nav-link" to="/logout/">Logout <span class="sr-only">(current)</span></router-link>
            </li>  
        </ul>
 
        
      </div>
    </nav>
    </div>
    `,
    watch: {
        '$route' (to, fom){
            this.reload()
        }
      },
    created: function() {
        let self = this;
        self.user=localStorage.getItem('token');
        self.userid=localStorage.getItem('userid')
    },
    data: function() {
        return {
            user: [],
        }
    },
    methods:{
        reload(){
            let self = this;
            self.user=localStorage.getItem('token');
            self.userid=localStorage.getItem('userid')
        }
    }
});


Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});

const Home = Vue.component('home', {
   template:
   `
    <div class= "ali">
    <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet"> 
    <link rel="stylesheet" type="text/css" href="static/css/main.css">
    <br>
    <br>
   
        <div class = "whole" id="new" >
        
            <img class="homeimg" :src="'/static/css/home.jpg'">
        </div>
        
        <div id="gallery" class ="whole">
            <h1 id= "gram1"><img class="homeicon" :src="'/static/css/cam.jpg'"> Photogram</h1>
            <hr>
            <p> Share photos of your favourite moments with friends family and the world</p>
            <br>

            
            <div id= "whole2" >
                <router-link to="register"  class=" btn btn-success">Register</router-link>
                
                <router-link to="login"  class="btn btn-primary">Login</router-link>
            </div>
        </div>
        
    
    </div>
   `,
    data: function() {
       return {}
    }
});

const Register= Vue.component('register', {template:
`  
        
    <div class= "paper">
        <link rel="stylesheet" type="text/css" href="static/css/next.css">
        <ul class="list">
            <li v-for="resp in error" class="list alert alert-danger">
                {{ resp.errors[0] }} <br>
                {{ resp.errors[1] }}
                {{ resp.errors[2] }} <br>
                {{ resp.errors[3] }}
                {{ resp.errors[4] }} <br>
                {{ resp.errors[5] }}
                {{ resp.errors[6] }} <br>
                {{ resp.errors[7] }}
                {{ resp.errors[8] }} <br>
              
            </li>
        </ul>

        <h1> Register </h1>

        <form id= "CreateUser"  @submit.prevent="Regist"   method="POST" enctype="multipart/form-data">
            <div class="form-group">
              <label for="fName">First Name:</label>
              <input type="text" class="form-group form-control" name="fName">
            </div>
            <div class="form-group">
              <label for="lName"word>Last Name:</label>
              <input type="text" class="form-group form-control" name="lName">
            </div>
            <div class="form-group">
              <label for="userName">Username:</label>
              <input type="text" class="form-group form-control" name="userName">
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="text" class="form-group form-control" name="email">
            </div>
            <div class="form-group">
              <label for="bio">Biography:</label>
              <input type="textarea" class="form-group form-control" name="bio">
            </div>
            <div class="form-group">
              <label for="location">Location:</label>
              <input type="text" class="form-group form-control" name="location">
            </div>
            <div class="form-group">
                <label for="msg"> Browse to Upload Photo </label>
            </div>
            <div class="upload-btn-wrapper">
                <button id="btn">Browse</button>
                <input type="file" name="imgfile" />
            </div>
          
            
            <br>
            
            <div class="form-group">
              <label for="password">Password:</label>
              <input type="password" class="form-group form-control" name="password">
            </div>
            <div class="form-group">
              <label for="confirm">Confirm Password:</label>
              <input type="password" class="form-group form-control" name ="confirm">
            </div>
            <button class=" btn upload-btn bg-primary" type="submit">Submit</button>
        </form>
    </div>
    `
 ,
    data : function(){
        return {
            response:[],
            error:[]
        };
    },
    methods : {
        Regist : function(){
            let self = this;
            let CreateUser = document.getElementById('CreateUser');
            let form_data = new FormData(CreateUser);
            fetch("/api/users/register", {
                method: "POST",
                body : form_data,
                headers: {
                    "X-CSRFToken": token
                },
                credentials: "same-origin"
            })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                if(jsonResponse.msg){
                    alert("User Registered. Please Login")
                    self.$router.push('/');
                }
                else if(jsonResponse.errors){
                self.error = jsonResponse.errors;
                }
                })
                
        }
    }
});


const Login = Vue.component('login', {
   template: `
   <div class= "paper2" >
   <link rel="stylesheet" type="text/css" href="static/css/next.css">
        <ul class="list">
            <li v-for="resp in errors" class="list alert alert-danger">
                {{ resp }} <br>
                
            </li>
        </ul>
   
   
       <form id = "LoginForm" class="form-login" @submit.prevent="Log" method="post">
            <h2>Login</h2>
          
            <div class="form-group">
                <label for="username" class="sr-only">Username</label>
                <input type="text" id="username" name="username" class="form-group form-control" placeholder="Your username" required >
            </div>
            <div class="form-group">
                <label for="password" class="sr-only">Password</label>
                <input type="password" id="password" name="password" class="form-group form-control" placeholder="Password" required>
            </div>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
        </form>
    </div>
   `,
      data : function(){
        return {
            errors:[],
            response:[]
        }
    },
    methods : {
        Log : function(){
                let self = this;
                let LoginForm = document.getElementById('LoginForm');
                let form_data = new FormData(LoginForm);
                fetch('/api/auth/login', {
                    method: 'POST',
                    body : form_data,
                    headers: {
                        'X-CSRFToken': token
                    },
                    credentials: "same-origin"
                })
                    .then(function (response) {
                    return response.json();
                    })
                    .then(function (jsonResponse) {
                    // display a success message
                    console.log(jsonResponse);
                    if(jsonResponse.errors){
                        self.error = jsonResponse.errors;
                    } 
                    else{
                        let jwt_token = jsonResponse.data.token;
                        let userid = jsonResponse.data.userid;
                        localStorage.setItem('token', jwt_token);
                        localStorage.setItem('userid', userid);
                        self.$router.push('/explore');
                }
                })
                    .catch(function (error) {
                    console.log(error);
            });
                  
        }
    }
 
});





const Explore = Vue.component('explore', {template:`

    <div>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <div v-if="messageFlag" class="sidenav">
            <router-link class="btn btn-primary but" to="/post/new">New Post</router-link>
        </div>
       
        <div class=" container-fluid fix-explore" v-if="output">
            <li v-for="resp in output "class="list" style = "list-style:none;" >
                <div id="wrap">
					<section class="main items">
    					<div class="boxout">
                            <p><img v-bind:src= "'/static/uploads/'+resp.proPhoto"style="width: 2rem; height: 2rem; padding: 3px; border-radius:100px;"/><router-link v-bind:to="'/users/' +resp.user_id">{{resp.username}}</router-link></p>
    						<article class="sub">
    							<header>
    								<img v-bind:src= "'/static/uploads/'+resp.photo" style="width: 32.9rem; height: 20rem;"/>
    							</header>
    							<p class="cap"><strong style="color:black;">{{resp.username}}:</strong> {{resp.caption}}</p>
    						</article>
    						<section class="like liker">
    						    <div v-if="resp.heart">
        						    <a  v-on:click="likes(resp.postid)" v-bind:value= "resp.postid"> <i  class="fa fa-heart" style="font-size:24px;color:red"></i></a>
                                    <a >{{resp.likes}} Likes</a>
                                    <a class="likey dark nohover" href="#"><span class="codeine core">{{resp.created_on}}</span></a>
                                </div>
                                <div v-else>
                                    <a  v-on:click="likes(resp.postid)"> <i class="fa fa-heart" style="font-size:24px;color:red"></i></a>
                                    <a >{{resp.likes}} Likes</a>
                                    <a class="likey dark nohover" href="#"><span class="codeine core">{{resp.created_on}}</span></a>
                                
                                </div>
                            </section>
    					</div>
					</section>
			     </div>
            </li>
        </div>
        <div v-else>
            <li v-for="resp in output"class="list">
                <h5>No Posts</h5>
            </li>
        </div>
    </div>
`,
    created: function() {
        let self = this;
        fetch('/api/posts ',{
            method: 'GET',
            'headers':{
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'X-CSRFToken': token
                
            },
            credentials: 'same-origin'
            
        })
            .then(function(response) {
            return response.json();

            })
            
            .then(function(jsonResponse) {
            console.log(jsonResponse);
            if(jsonResponse.data){
                
                self.output = jsonResponse.data;
                self.messageFlag = true;
                self.trigger = false;
            }
                
    
            })
            .catch(function(error){
            console.log(error)
        });

        
    }, 
    data: function() {
        return {
            output: [],
            error:[],
            messageFlag: false,
            trigger: null,
            };
    },
    methods: {
        
    likes: function(postid){
        let self = this;
        fetch("/api/posts/"+postid+"/like",{
            method: 'POST',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
        .then(function(response){
        return response.json();
        })
        .then(function(jsonResponse){
        console.log(jsonResponse);
        if(jsonResponse.message){
            let message = jsonResponse.message;
            alert(message);
            self.trigger = true;
            this.$router.go('/explore');
        }else if (jsonResponse.mesg){
            let mesg = jsonResponse.mesg;
            alert(mesg);
            self.$router.push('/explore')
        }else{
            alert("Did Not like Post Successfully")
            self.$router.push('/explore')
        }
        
        
        })
        .catch(function(error){
        console.log(error);
        });
        }
    }
});

const uploadpost= Vue.component('upload-form', {
    template: `
        <div>
          <div id ="tall1"><p>New Post </p></div>
          <div>
            <ul class="list">
                <li v-for="resp in response" class="list alert alert-success">
                    {{ resp.message }}
                </li>
                <li v-for="resp in error" class="list alert alert-danger">
                    {{ resp.errors[0] }} <br>
                    {{ resp.errors[1] }}
                </li>
            </ul>

            <form id="uploadForm"  @submit.prevent="uploadPhoto" method="POST" enctype="multipart/form-data">
                <div id ="tall">
                    
                    <div class="form-group " id="tall1">
                        <label for="msg"> Photo </label>
                        <br>
                        <div class="upload-btn-wrapper">
                            <button id="btn">Browse</button>
                            <input type="file" name="photo" />
                        </div>
                    </div>
                   
                    <div class="form-group " id="tall1">
                        <label for="msg">Caption</label>
                        <br>
                        <textarea class="textbx" id="msg" placeholder="Write a Caption" name="caption"></textarea>
                    </div>
                <button class=" btn upload-btn btn-success btn-block" type="submit">Submit</button> 
                </div>
                <br/>
                
            </form>
          </div>
          </br>
        </div>
    `,
    data: function() {
       return {
           response: [],
           error: []
       };
    },
    methods: {
        uploadPhoto: function () {
            let self = this;
            let userid = localStorage.getItem('userid');
            let uploadForm = document.getElementById('uploadForm');
            let form_data = new FormData(uploadForm);
            fetch("/api/users/"+userid+"/posts", {
                method: 'POST',
                body: form_data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                console.log(jsonResponse);
                if(jsonResponse.result){
                    let message = jsonResponse.result[0].message
                    alert("Post Added")
                    self.$router.push('/explore');
                    }
                else if(jsonResponse.errors){
                self.error = jsonResponse.errors;
                alert("Errors in the air")
                }
                })
        }
    }
});


const UserProfile = Vue.component('use', {
    template: `
    <div>
        <link rel="stylesheet" type="text/css" href="static/css/next.css">
        <div v-if="info" class="container-fluid" style="background-color:white; width:100p%; height:200px; border-radius:5px; ">
            <li v-for="user in info" class="list" style="list-style:none;"id="vis">
                <div class="row border-style center profile profiles-container">
                    <a href="#"><img v-bind:src= "'/static/uploads/'+user.photo" class="post_pic"></a>
                        <div class="col">
                            <h2><strong>{{user.firstname}} {{user.lastname}}</strong></h2>
                            <h5 id="pro_info"><span>{{ user.location}}</span></h5>
                            <h5 id="pro_date"><span> Member since: {{ user.joined_on}}</span></h5>
                            <h5 id="pro_info"><span>{{ user.biography}}</span></h5>
                            
                        </div>
                    <div class="seeprofile center col-3 bio">
                        </br>
                        <section class="lki lkie wip"  >
                            <p class="count"><span class="post_len" >{{postr}}</span><span class="follen">{{numberoffollower}}</span></p>
                        </section>
                        <section class="lki lkie">
                            <p class="count"><span class="followtitle">Posts</span><span class="followtitle">Followers</span></p>
                        </section>
                        
                    </div>
                    <br>
                    <div v-if="auser">
                    </div>
                        <div v-else class="pro-btn">
                            <div v-if="following">
                                <a class="view-btn btn-warning btn-long pro-style" >Following</a>
                            <br>
                            <br>
                            </div>
                            <div  v-else>
                                <a class="view-btn btn-primary btn-long pro-style" @click="follow">Follow</a>
                            </div>
                        </div>
                </div >
                       
            </li>
        </div>
        <br>
        <div v-else >
            <li v-for="resp in info"class="list" style="list-style:none;">
                <h5>No Posts</h5>
            </li>
        </div>
        
        <div style="flex-direction: row">
            <div class="imageView">
                <li v-for=" i in output" style="list-style:none">
                    <img  v-bind:src= "'/static/uploads/'+i.photo" class="profile_post">
                </li>
            </div>
        </div>
    </div>
    `,
     created: function() {
        let self = this;
        let userid = this.$route.params.userid;
        fetch("/api/users/"+userid+"/posts", { 
            method: 'GET',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.Post){
                self.output = jsonResponse.Post;
            }
            })
            .catch(function (error) {
            console.log(error);
        });
        fetch("/api/users/"+userid+"/", { 
            method: 'GET',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.profile){
                self.info = jsonResponse.profile[0];
                self.postr= jsonResponse.profile[0].poscount
            }
            if(jsonResponse.auser){
                self.auser = jsonResponse.auser;
            }if(jsonResponse.lis){
                self.lise = jsonResponse.lis
                
            }
            
            else{
                self.auser = false;
            }
            })
            .catch(function (error) {
            console.log(error);
        });
         fetch("/api/users/"+userid+"/follow", { 
            method: 'GET',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
        })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.Follow){
                self.numberoffollower = jsonResponse.Follow[jsonResponse.Follow.length-1].count;
            
                let follow = jsonResponse.Follow[0].Status;
                if (follow==false){
                    console.log(follow)
                    self.following = false;
                }
                else{
                    self.following = true;
                }
            }
            })
            .catch(function (error) {
            console.log(error);
        });
        fetch("/api/users/"+userid+"/", { 
                method: 'GET',
                'headers': {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'X-CSRFToken': token
                },
                credentials: 'same-origin'
            })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse);
                if(jsonResponse.profile){
                    self.info = jsonResponse.profile;
                }
                if(jsonResponse.auser){
                    self.auser = jsonResponse.auser;
                }else{
                    self.auser = false;
                }
                })
                .catch(function (error) {
                console.log(error);
            });
    },
     data: function() {
       return {
           output:[],
           info:[],
           postr:[],
           Post:null,
           error: [],
           numberoffollower:[],
           following: null,
       }
     }
    ,
   methods : {
 
         follow: function(){
            let self = this;
            let userid = this.$route.params.userid;
            fetch("/api/users/"+userid+"/follow", { 
            method: 'POST',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'X-CSRFToken': token
            },
            credentials: 'same-origin'
            })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.Follow){
                let message = jsonResponse.Follow[0].message;
                alert(message);
                self.following = true;
                alert("You are now following someone new");
                
                self.$router.push('/users/'+userid);
            }else{
                alert("You are now following someone new");
            }
            })
            .catch(function (error) {
            console.log(error);
            });
        }
    }
});

const logout= Vue.component('logout-form', {
    template: `<div></div>`,
    created: function() {
        let self = this;
        fetch("/api/auth/logout", { 
            method: 'GET',
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(function (response) {
            return response.json();
            })
            .then(function (jsonResponse) {
            // display a success message
            console.log(jsonResponse);
            if(jsonResponse.msg){
                let message = jsonResponse.msg;
                localStorage.removeItem('token');
                localStorage.removeItem('userid');
                alert ("You have sucessfully logged out");
                self.$router.push('/');
                
            }
            })
            .catch(function (error) {
            console.log(error);
        });
    },
    methods: {
    }
});

// Define Routes
const router = new VueRouter({
    routes: [
        { path: "/", component: Home },
        {path: "/register", component:Register},
        {path: "/login", component:Login},
        {path:"/explore", component:Explore},
        {path:"/post/new", component: uploadpost},
        {path:"/users/:userid",component: UserProfile},
        {path:"/logout",component: logout}
  ]
});
// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
    

    
});