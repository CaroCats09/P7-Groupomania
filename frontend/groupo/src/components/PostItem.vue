<template>
    <div class="card post-card">

        <!-- Entête du post -->

        <div class="card-header bg-white p-3">
            <div class="d-flex justify-content-between align-items-center">

                <div class="d-flex justify-content-between align-items-center">
                    <div class="ms-2">
                        <div class="h5 m-0 post-username">{{ post.userName }}</div>
                      
                    </div>
                </div>

                <div v-if="userId === post.UserId || user.isadmin" class="dropdown">
                    <a class="btn btn-white" type="button" v-bind:id="'dropdownMenuButton' + post._id" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i class="fas fa-ellipsis-h ellipsis-icon"></i>
                    </a>

                    <ul class="dropdown-menu dropdown-menu-right"  v-bind:aria-labelledby="'dropdownMenuButton' + post._id">
                        <li ><button v-if="userId === post.UserId" class="dropdown-item" @click="editPost(post._id)">Modifier</button></li>
                        <li><button class="dropdown-item dropdown-item-delete" @click="deletePost(post._id)">Supprimer</button></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Contenu du post : texte et image -->

        <div v-show="!toModify" class="card-body">
            <p class="card-text" ref="mycardtext">
                
            </p>
            <img loading="lazy" v-if="post.imageUrl" :src="post.imageUrl" alt="image" class="post-image">
        </div>

        <!-- Affichage lors de la modification -->

        <div v-if="toModify" class="card-body">
            <h3 class="text-center mb-3">Modifier la publication</h3>
            <form @submit.prevent="modifyPost" id="myForm" enctype="multipart/form-data" class="mb-3">
                <div class="mb-3">
                    <label for="messageInput" class="form-label">Message</label>
                    <textarea @click="resetErrorMessage" v-model="messageEdit" type="text" class="form-control" id="messageInput" rows="5" />
                </div>
                <div class="mb-3">
                    <label for="imageInput" class="form-label mb-3 d-block">Image</label>
                    <img v-if="previewImageEdit" class="image-preview d-block mb-3" :src="previewImageEdit" />
                    <button v-if="previewImageEdit" @click.prevent="removeImage" class="btn btn-danger mb-3">Retirer image</button>
                    <input v-if="!previewImageEdit" class="form-control btn-upload mb-3" type="file" id="imageInput" ref="imageInput" @change="onFileSelected" @click="resetErrorMessage">
                </div>
                
                <p v-if="!validEdit" class="validFeedback">{{ errorMessageEdit }}</p>
                <p v-if="isEmptyContent" class="validFeedback">Un message seul doit contenir au moins deux caractères.</p>
                <button @click.prevent="abort" class="btn btn-light btn-space btn-abort">Annuler</button>
                <button :disabled="!validEdit || isEmptyContent" type="submit" class="btn btn-groupo">Sauvegarder</button>
            </form>
            
        </div>

        <!-- Affichage bouton like -->
        
        <LikeItem v-bind:postId="post._id" 
        v-bind:likes="likes" 
         v-bind:usersLiked="usersLiked"
         v-bind:usersDisliked="usersDisliked"
         v-bind:dislikes="dislikes"/>

    </div>

</template>

<script>
    import moment from 'moment';
    moment.locale('fr');
    import Api from '../services/Api';
    import ClickLink from '../utils/ClickLink';
    import LikeItem from "@/components/LikeItem.vue";
    export default {
        name: 'PostItem',
        props: {
            post: Object
        },
        components: {
            LikeItem
        },
        data() {
            return {
                postId: null,
                messageEdit: this.$props.post.content,
                selectedFileEdit: null,
                previewImageEdit: this.$props.post.imageUrl,
                previousImage: '',
                validEdit: true,
                errorMessageEdit: '',
                toModify: false,
                deleteImg: false,
                keepPreviousImg: false,
                showMore: false,
                likes: this.$props.post.likes,
                dislikes: this.$props.post.dislikes,
                usersLiked: this.$props.post.usersLiked,
                usersDisliked: this.$props.post.usersDisliked
            };
        },
        computed: {
          
            isEmptyContent() {
              return this.previewImageEdit === '' && this.messageEdit.length < 2;
            }
        },
        methods: {
      
            async deletePost(id) {
                const token = localStorage.getItem("token");
                const postId = id;
                let okToDelete = confirm('Vous êtes sûr(e) de supprimer ce post ?')
                if (!okToDelete) {
                    return
                }
                try {
                    console.log("postId" + postId);
                    await Api.delete(`posts/${postId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    alert('Post supprimé !');
                    this.$emit('postdeleted');
                } catch (error) {
                    console.log(error.response.data);
                }
            },
            editPost(id) {
                this.toModify = true;
                this.postId = id;
            },
            async modifyPost() {
      
                this.keepPreviousImg = this.previewImageEdit === this.previousImage;
                const postInfos = {
                    content: this.messageEdit,
                    deleteImg: this.deleteImg,
                    keepPreviousImg: this.keepPreviousImg
                }
                let body = postInfos;
                // si image uploadée, envoi d'un objet formData
                if (this.selectedFileEdit !== null) {
                    const formData = new FormData();
                    formData.append('post', JSON.stringify({ content: this.messageEdit}));
                    formData.append('image', this.selectedFileEdit);
                    body = formData;
                }
                const token = localStorage.getItem("token");
                try {
                    const response = await Api.put(`posts/${this.postId}`, body, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    alert('Les modifications ont bien été enregistrées !');
                    console.log("données mises à jour", response.data);
                    // this.messageEdit = '';
                    // this.previewImageEdit = '';
                    this.selectedFileEdit = null;
                    this.deleteImg = false;
                    this.keepPreviousImg = false;
                    this.toModify = false;
                    if (response.data.updatedData.imageUrl !== null) {
                        this.previousImage = response.data.updatedData.imageUrl;
                        this.previewImageEdit = this.previousImage;
                    }
                    this.$emit('postupdated');
                    // this.$router.go();
                } catch (error) {
                    console.log(error.response.data);
                    this.validEdit = false;
                    this.errorMessageEdit = error.response.data.message;
                }
            },
            abort() {
                this.toModify = false;
                this.messageEdit = this.$props.post.content;
                this.previewImageEdit = this.previousImage;
                this.selectedFileEdit = null;
                this.deleteImg = false;
                this.keepPreviousImg = false;
                this.errorMessageEdit = '';
                this.validEdit = true;
            },
            onFileSelected(e) {
                const file = e.target.files[0];
                if (!file) {
                    if(this.deleteImg) {
                        this.previewImageEdit = '';
                    } else {
                        this.previewImageEdit = this.previousImage;
                    }
                    this.selectedFileEdit = null;
                    return
                }
                const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
                const MAX_SIZE = 1048576;
                const tooLarge = file.size > MAX_SIZE;
                if(allowedTypes.includes(file.type) && !tooLarge) {
                    this.selectedFileEdit = e.target.files[0];
                    // preview uploaded image
                    let reader = new FileReader;
                    // const vm = this;
                    reader.onload = e => {
                        this.previewImageEdit = e.target.result;
                    }
                    reader.readAsDataURL(file);
                } else {
                    this.validEdit = false;
                    this.errorMessageEdit = tooLarge ? "Fichier trop volumineux : la taille ne doit pas dépasser 1 Mo" : "Seules les images sont autorisées";
                    this.$refs.imageInput.value = '';
                }
            },
            removeImage() {
                this.previewImageEdit = '';
                this.selectedFileEdit = null;
                this.deleteImg = true;
            },
            resetErrorMessage() {
                this.validEdit = true;
            }
        },
        mounted() {
            this.$refs.mycardtext.innerHTML = ClickLink(this.$props.post.content);
            if(this.previewImageEdit) {
                this.previousImage = this.previewImageEdit;
            }
            // console.log('mounted !')
        },
        updated() {
            console.log("PostItem mis à jour")
            this.$refs.mycardtext.innerHTML = ClickLink(this.$props.post.content);
        }
    }
</script>

<style scoped>
    ul {
        list-style-type: none;
        padding-left: 0;
    }
    
    .post-card {
        border-radius: 15px;
        box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
    }
    
    .post-card .card-header {
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }
    .post-card .card-footer {
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        gap: 20px;
    }
    .ellipsis-icon {
        color: #4E5166
 ;
    }
    .dropdown-item,
    .card-link {
        color: #4E5166
 ;
    }
    .card-text {
        white-space: pre-wrap;
    }
    .post-image {
        width: 100%;
    }
    .post-time {
        font-size: 0.9rem;
    }
    label {
        font-weight: 500;
    }
    textarea {
        resize: none;
        background: #fcfbfb;
    }
    .validFeedback {
        color: #FD2D01;
    }
    .btn-space {
        margin-right: 10px;
    }
    .image-preview {
        max-width: 100%;
    }
    .btn-upload {
        max-width: 320px;
        border-radius: 24px;
    }
    .btn-remove {
        background-color: #FFD7D7;
        border-color: #FFD7D7;
        color: #111 !important;
    }
    .btn-remove:hover {
        background-color: #d6d6d6;
    }
    .btn-showmore {
        color: #2c3e50;
    }
    .btn-groupo{
        background-color: #FD2D01;
    }
    .btn-abort:hover {
        background-color: #FFD7D7;
    }
    .dropdown-item {
        font-weight: 500;
    }
    .dropdown-item:active {
        color: #fff;
    }
    .dropdown-item.dropdown-item-delete:active {
        background-color: #FD2D01;
    }
    
</style>