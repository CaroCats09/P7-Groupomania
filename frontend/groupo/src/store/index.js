import { createStore } from 'vuex'
import jwt_decode from "jwt-decode";

export default createStore({
  state: {
  
    logged: false,
    posts: []
  },
  getters: {
   
    loggedIn(state) {
      return state.logged
    }
  },
  mutations: {
 
    SET_LOGIN(state) {
      state.logged = true
    },
    SET_LOGOUT(state) {
      state.logged = false
      state.posts = []
    },
    SET_POSTS(state, posts) {
      state.posts = posts
    }
  },
  actions: {
    
    setLogin({ commit }) {
      commit('SET_LOGIN')
    },
    setLogout({ commit }) {
      commit('SET_LOGOUT')
    },
    setPosts(context, posts) {
      context.commit('SET_POSTS', posts)
    },
    checkToken({ commit }) {
      if(localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        const decodedToken = jwt_decode(token);
        console.log('*** Heures restantes avant expiration Token ***', Math.round(((decodedToken.exp * 1000) - Date.now())/1000/3600*100)/100);

        // Vérification si token est expiré

        if(Date.now() >= decodedToken.exp * 1000) {
          console.log('token expiré');
          alert('Session expirée - Veuillez vous reconnecter');
          localStorage.clear();
          commit('SET_LOGOUT');
        } else {
            commit('SET_LOGIN')
           
        }

      } else {
        console.log('pas de token')
        commit('SET_LOGOUT')
      }
    }
    
  },
  modules: {
  }
})