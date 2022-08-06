<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <img
          src="../assets/icon-left-font-1.png"
          alt="logo Groupomania"
          class="d-inline-block align-text-top logo"
        />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav" >
        <ul class="navbar-nav ms-auto" v-if="!loggedIn">
          <li class="nav-item">
            <router-link to="/login" class="nav-link login-link">Connexion</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signup" class="nav-link signup-link">Inscription</router-link>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto" v-if="loggedIn">
          <li class="nav-item nav-item-home">
            <router-link to="/" class="nav-link d-flex"><i class="fas fa-home logo-home" title="Accueil"></i></router-link>
          </li>
          <li class="nav-item nav-item-logout">
            <button @click="logOut" class="nav-link logout-link btn btn-groupo">Se déconnecter</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "NavBar",
  methods: {
    logOut() {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('isadmin');
      this.$store.dispatch('setLogout');
      alert('Vous êtes déconnecté(e) !');
      this.$router.push('/');
    }
  },
  computed: {
    ...mapGetters(['loggedIn']),
  },
  beforeMount() {
    this.$store.dispatch('checkToken');
  }  
};
</script>

<style scoped>
  .navbar {
    border-bottom: 1px solid #FFD7D7;
    padding: 30px;
  }
  .navbar .logo {
    width: 225px;
    height: 50px;
  }
  .navbar-nav {
    gap: 30px;
  }
  
  .nav-item {
    font-weight: 500;
    padding: 30px;
  }
  .nav-link {
    display: inline-block;
  }
  .login-link, .signup-link, .logout-link {
    padding: 8px 12px !important;
    border-radius: 24px;
  }
  .login-link, .logout-link {
    background-color: #FD2D01
 ;
    color: #fff !important;
  }
  .login-link:hover, .logout-link:hover  {
    background-color: #ea2e09;

  }
  .signup-link {
    background-color:#FFD7D7
 ;
    color: #111 !important;
  }
  .signup-link:hover {
    background-color:#eebebe ;
  }
  
  .profile-link {
    border-radius: 50%;
  }
  .profile-link:hover {
    background-color:#FFD7D7;
  }
  .nav-item-logout, .nav-item-home {
    display: flex;
    align-items: center;
  }
  .logo-home {
    font-size: 2rem;
    color: #FD2D01
 ;
  }
  .logo-home:hover {
    font-size: 2rem;
    color: #ea2e09;
  }
  @media screen and (max-width: 992px) {
    .navbar-nav {
      margin-top: 25px;
      gap: 15px;
      align-items: center;
    }
    .nav-link {
      padding: 0.5rem;
    }
  }
  @media screen and (max-width: 400px) {
    .navbar .logo {
      width: 130px;
      height: 30px;
    }
  }
</style>