<template>
  <div class="container-compo mx-auto">
    <div v-if="this.$store.state.logged" class="wall mx-auto">
      <h1 class="wall-title my-4">Fil d'actualité</h1>
      <NewPost @newpost="setReload" />
      <Feed :key="compoKey"/>
    </div>
    <div v-else class="welcome mx-auto">
      <img src="../assets/icon-above-font.png" alt="logo Groupomania" class="logo mx-auto d-block">
      <h1 class="welcome-title mt-4">Bienvenue sur le réseau social de Groupomania</h1>
      <p class= "welcome-text mt-4">Retrouvez-vous pour partager vos idées et rester en contact avec vos Groupo-collègues !</p>
      <div class="d-flex align-items-center justify-content-between mt-5 welcome-btns">
          <router-link to="/signup" class="btn btn-primary btn-signup">Créer un compte</router-link>
          <span class="ms-auto">Vous êtes déjà inscrit ?</span>
          <router-link to="/login" class="btn btn-primary btn-login">Se connecter</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Feed from "@/components/Feed.vue";
import NewPost from "@/components/NewPost.vue";

export default {
  name: 'HomeView',
  components: {
    NewPost,
    Feed
  },
  data() {
    return {
      compoKey: 0
    };
  },
  
  mounted() {
    console.log("logged", this.$store.state.logged);
  },
  updated() {
    console.log('HomeView mis à jour !')
  },
  methods: {
    setReload() {
      this.compoKey += 1;
    }
  }
}
</script>

<style scoped>
  .container-compo {
    margin-top: 3%;
  }
  .wall {
    max-width: 680px;
    width: 80%;
  }
  .wall-title{
    font-weight: 700;
    text-align: center;
  } 
  .welcome {
    padding: 0 25px;
    max-width: 800px;
    text-align: center;

  }
  .welcome-title {
    font-weight: 700;
    font-size: 2rem;
  }
  .logo {
    max-width: 400px;
    width: 80%;
  }
  .welcome-btns {
    gap: 20px;
  }
  .welcome-btns span {
    font-size: 1.1rem;
    font-weight: 500;
  }
  .btn-signup {
    width: 200px;
    background-color: #fff;
    color: #333 !important;
    border: 2px solid #FFD7D7;
    font-size: 1.2rem;
  }
  .btn-signup:hover {
    background-color: #FFD7D7;
  }
  .btn-login {
    width: 200px;
    background-color: #fff;
    color: #333 !important;
    border: 2px solid #FD2D01;
    font-size: 1.2rem;
  }
  .btn-login:hover {
    background-color: #ea2e09;
    color: #fff !important;
  }
  @media screen and (max-width: 768px) {
    .wall {
      max-width: 680px;
      width: 95%;
    }
    
    .welcome-btns {
      flex-direction: column;
    }
    .welcome-btns span {
      margin-left: 0 !important;
      margin-top: 20px;
    }
  }
  </style>