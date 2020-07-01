$(document).ready(function () {
    if (!isAuthenticated()){
        //window.location.href = "login.html";
        document.getElementById('nav').innerHTML = "<img src=\"assets/img/LOGO1.png\" img src=\"img_girl.jpg\" style=\"max-width:10%; height:auto;\" alt=\"logo-navbar\"><button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarNav\" aria-controls=\"navbarNav\" aria-expanded=\"false\" aria-label=\"Toggle navigation\"> <span class=\"navbar-toggler-icon\"></span> </button> <div class=\"collapse navbar-collapse\" id=\"navbarNav\"> <ul class=\"navbar-nav\"> <li class=\"nav-item\"> <a class=\"nav-link\" href=\"login.html\"> LOGIN <span class=\"sr-only\">(corrente)</span> </a> </li> <li class=\"nav-item\"> <a class=\"nav-link\" href=\"registrati.html\"> REGISTRATI </a> </li>   <li class=\"nav-item active\"> <a class=\"nav-link\" href=\"about.html\"> ABOUT US </a> </li></ul> </div>";
    }
});