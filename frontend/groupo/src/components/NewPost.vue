<template>
  <section class="card newpost-card mt-5" id="newpost">
    <form class="bg-white p-3" @submit.prevent="handleSubmit" id="myForm" enctype="multipart/form-data">

        <div class="d-flex justify-content-between align-items-center mb-4">
         <div class="me-auto w-100">
            <textarea @click="resetErrorMessage" v-model="content" type="text" class="form-control" id="newPostInput" placeholder="Quoi de neuf ?" rows="5"/>
            </div>
        </div>
        
        <img v-if="previewImage" class="image-preview mb-4" :src="previewImage" />

        <p v-if="!valid" class="validFeedback">{{ errorMessage }}</p>

        <div class="d-flex justify-content-end mb-2 card-btns">
          <label for="newPostImage" class="form-label image-label d-flex">
            <i class="fas fa-image image-icon"></i>Image</label>
          <input v-if="!previewImage" type="file" id="newPostImage" ref="newPostImage" class="form-control btn-upload" @change="onFileSelected" @click="resetErrorMessage">
          <button v-else @click="removeImage" class="btn btn-remove">Retirer image</button>
          <button :disabled="!valid" type="submit" class="btn btn-groupo btn-publish">Publier</button>
        </div>

    </form>
  </section>
</template>

<script>

import Api from '../services/Api';
  export default {
    name: 'NewPost',
    data() {
      return {
        content: '',
        selectedFile: null,
        previewImage: '',
        valid: true,
        errorMessage: '',
      };
    },
    
    methods: {
      async handleSubmit() {  
        let body = { content: this.content}; 
        // si image uploadée, envoi d'un objet formData
        if (this.selectedFile !== null) {
          const formData = new FormData();
          formData.append('post', JSON.stringify({ content: this.content}));
          formData.append('image', this.selectedFile);
          body = formData;
        }
        const token = localStorage.getItem("token");
        try {
          await Api.post('posts/', body, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
          });
          this.content = '';
          this.selectedFile = null;
          this.previewImage = '';
          this.valid = true;
          this.errorMessage = '';
          this.$emit('newpost');
        } catch (error) {
            console.log(error.response.data);
            this.valid = false;
            this.errorMessage = error.response.data.message;
        }
      },
      onFileSelected(e) {
        const file = e.target.files[0];
        if (!file) {
          return
        }
        const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const MAX_SIZE = 1048576;
        const tooLarge = file.size > MAX_SIZE;
        if(allowedTypes.includes(file.type) && !tooLarge) {
          this.selectedFile = e.target.files[0];
          // preview uploaded image
          let reader = new FileReader;
          // const vm = this;
          reader.onload = e => {
            this.previewImage = e.target.result;
          }
          reader.readAsDataURL(file);
        } else {
            this.valid = false;
            this.errorMessage = tooLarge ? "Fichier trop volumineux : la taille ne doit pas dépasser 1 Mo" : "Seules les images sont autorisées";
            this.$refs.newPostImage.value = '';
        }
      },      
      removeImage() {
        this.previewImage = '';
        this.selectedFile = null;
      },
      resetErrorMessage() {
        this.valid = true;
      },
    }
  }
</script>

<style scoped>
  textarea {
    resize: none;
    background: #fcfbfb;
  }
  .newpost-card {
    border-radius: 15px;
    box-shadow: 0 2px 4px rgb(0 0 0 / 15%);
  }
  .newpost-card form{
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
  
  
  .card-btns {
    display: flex;
    gap: 15px;
    align-items: center;
  }
  .btn-publish {
    width: 120px;
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
  .image-preview {
    max-width: 100%;
  }
  .image-label {
    font-weight: 500;
    gap: 5px;
    margin-bottom: 0;
  }
  .image-icon {
    font-size: 20px;
    color:#FFD7D7;
  }
  .validFeedback {
    color:#FD2D01 ;
  }
  @media screen and (max-width: 615px) {
    .card-btns {
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }
  }
  
</style>