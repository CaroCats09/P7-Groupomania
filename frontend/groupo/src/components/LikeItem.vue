<template>
    <div class="card d-flex bg-white p-3 border-0 like-dislike-item">
        <div class="like-btn-container py-1 d-flex align-items-center justify-content-between">
          <button type="button" @click="handleLike" class="p-2 like-btn border-0 d-flex justify-content-center align-items-center" :disabled="checkUserLikeClassBtn"  >
                <i v-if="!isLiked" class="far fa-sun like-icon me-2" ref="icon"></i>
                <i v-if="isLiked" class="fas fa-sun like-icon me-2" ref="icon"></i>
                <span v-if="!isLiked" class="like-text color-grey" ref="text">Cool</span>
                <span v-if="isLiked" class="like-text color-groupo" ref="text">Cool</span>
            </button>
            <span class="count-like p-2">{{ countLikes }} Cool</span>
        </div>
        <div class="dislike-btn-container py-1 d-flex align-items-center justify-content-between">
         <button type="button" @click="handleDislike" class="p-2 dislike-btn border-0 d-flex justify-content-center align-items-center"  :disabled="checkUserDislikeClassBtn" >
               
                <span v-if="!isDisliked" class="dislike-text color-grey-pascool" ref="text">Pas cool</span>
                <span v-if="isDisliked" class="dislike-text color-groupo-pascool" ref="text">Pas cool</span>
            </button>
            <span class="count-dislike p-2"> {{ countDisLikes }} Pas cool</span>
        </div>
    </div>
</template>

<script>
    import Api from '../services/Api';
    export default {
        name: 'LikeItem',
        props: {
            postId: String,
            likes: Number,
            dislikes: Number,
            usersLiked: Array,
            usersDisliked: Array,
        },
        data() {
            return {
                
              countLikes: this.$props.likes,
                countDisLikes: this.$props.dislikes,
                listUsersLiked: this.$props.usersLiked,
                listUsersDisliked: this.$props.usersDisliked,
            };
        },
        computed: {
        
            //vérifier si l'utilisateur exist dans le tableau de dislike  return disabled
        checkUserLikeClassBtn() {
            if (this.listUsersDisliked.includes(localStorage.getItem("userId")) == false) { 
               
            return false;
        }
            else
                return true;
            },
            //vérifier si l'utilisateur exist dans le tableau de like  return disabled
        checkUserDislikeClassBtn() {
          
             if (this.listUsersLiked.includes(localStorage.getItem("userId")) == false)
                return false;
            else
                return true;
            },

            isLiked() {
                const likesUserIdList = this.$props.usersLiked.map(like => like.userId);
                const userId = this.$store.state.userId;
                return likesUserIdList.includes(userId);
            },
             isDisliked() {
                const dislikesUserIdList = this.$props.usersDisliked.map(dislike => dislike.userId);
                const userId = this.$store.state.userId;
                return dislikesUserIdList.includes(userId);
            }
        },
        methods: {
            async handleLike() {
                // Affichage du like                
                this.displayLike();
                // Logique du like
                const postId = this.$props.postId;
                const token = localStorage.getItem("token");
                let like = (this.listUsersLiked.includes(localStorage.getItem("userId"))) ? 1 : 0;
                
                if (like == 1) like = 0;
                if (like == 0) like = 1;
                try {
                    await Api.post(`posts/${postId}/like`, {userId:localStorage.getItem("userId"), like:like}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } catch (error) {
                    console.log(error.response.data);
                }
            },
            displayLike() {
                const likeIcon = this.$refs.icon;
                const likeText = this.$refs.text;
                if (likeIcon.classList.contains('far')) {
                    likeIcon.classList.replace('far', 'fas');
                    likeIcon.classList.add('anim');
                    likeIcon.classList.replace('color-grey','color-groupo');
                    likeText.classList.replace('color-grey','color-groupo');
                    this.countLikes++;
                    this.listUsersLiked.push(localStorage.getItem("userId"));
                    
                } else {
                    likeIcon.classList.replace('fas', 'far');
                    likeIcon.classList.remove('anim');
                    likeText.classList.replace('color-groupo','color-grey');
                    this.countLikes--;
                    let position = this.listUsersLiked.indexOf(localStorage.getItem("userId"));
                    this.listUsersLiked.splice(position, 1);
                }
                
            },
            async handleDislike() {
                // Affichage du dislike                
                this.displayDislike();
                // Logique du dislike
                const postId = this.$props.postId;
                const token = localStorage.getItem("token");


                let like = (this.listUsersDisliked.includes(localStorage.getItem("userId"))) ? -1 : 0;
                if (like == -1) like = 0;
                if (like == 0) like = -1;
                try {
                    await Api.post(`posts/${postId}/like`, {userId:localStorage.getItem("userId"), like:like}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } catch (error) {
                    console.log(error.response.data);
                }
            },
            displayDislike() {
            const dislikeText = this.$refs.text;
                if
                    (dislikeText.classList.replace('color-grey-pascool', 'color-groupo-pascool')){
                    this.countDisLikes++;
                    this.listUsersDisliked.push(localStorage.getItem("userId"));
                } else {
                    (dislikeText.classList.replace('color-groupo-pascool', 'color-grey-pascool'))
                    this.countDisLikes--;
                    let position = this.listUsersDisliked.indexOf(localStorage.getItem("userId"));
                    this.listUsersDisliked.splice(position, 1);
                }
            }
        }
    }
</script>

<style scoped>
    .like-dislike-btn-container {
        border-top: 1px solid #dfdfdf;
        border-bottom: 1px solid #dfdfdf;
    }
    .like-btn  {
        border-radius: 20px;
        background-color: #fff;
    }
    .dislike-btn {
        border-radius: 20px;
        background-color: #fff;
    }
    .like-btn:hover  {
        background-color: #FFD7D7;
        cursor: pointer;
    }
    .dislike-btn:hover {
        background-color: #FFD7D7;
    }
    
    @keyframes like-button-animation {
        0% {
            -webkit-transform: scale(1);
            transform: scale(1)
        }
        25% {
            -webkit-transform: scale(1.2);
            transform: scale(1.2)
        }
        50% {
            -webkit-transform: scale(.95);
            transform: scale(.95)
        }
        100% {
            -webkit-transform: scale(1);
            transform: scale(1);
        }
    }
    .anim {
        -webkit-animation-duration: .45s;
        animation-duration: .45s;
        -webkit-animation-name: like-button-animation;
        animation-name: like-button-animation;
        -webkit-animation-timing-function: ease-in-out;
        animation-timing-function: ease-in-out;
        -webkit-transform: scale(1);
        transform: scale(1);
    }  

    

    .like-text {
        font-weight: 500;
        user-select: none;
    }
    
    .far {
        color :#4E5166;
    }
    
    .fas {
        color: #FD2D01;
    }
   
    .color-groupo {
        color: #FD2D01;
    }
    .color-groupo-pascool {
        color: #FD2D01;
    }
    .color-grey {
        color: #4E5166;
    }
    .color-groupo-pascool{
        color: #FD2D01;
    }
    .count-like {
        font-weight: 500;
    }
    .count-dislike {
        font-weight: 500;
    }
    </style>
    
