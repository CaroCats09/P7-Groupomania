const Post = require('../models/post');
const fs = require('fs');
const jwt = require('jsonwebtoken');

//Récupération d'un post
exports.getOnePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then(post => res.status(200).json(post))
        .catch(error => {
            console.log(error);
            res.status(404).json({ message: error.message });
        });
};

//Récupération des posts
exports.getAllPost = (req, res, next) => {
    Post.find().sort({_id: -1})
        .then(posts => res.status(200).json(posts))
        .catch(error => {
            console.log(error);
            res.status(404).json({ message: error.message });
        });
};
//Création d'un post
exports.createPost = (req, res, next) => {
    const postObject = JSON.parse(req.body.post);
    delete postObject._id;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    const userName = decodedToken.name;
    
    const post = new Post({
        ...postObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: userId,
        userName: userName,
    });
    post.save()
        .then(() => res.status(201).json({ message: 'Post enregistré !' }))
        .catch(error => res.status(400).json({ message: error.message }));

};


//Suppression post
exports.deletePost = (req, res, next) => {
    Post.findOne({ _id: req.params.id })
        .then((post) => {
            if (!post) {
                res.status(404).json({
                    message: 'Post non trouvé !'
                });
            }
            else {
                // post dispo 
                const token = req.headers.authorization.split(' ')[1];
                const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
                const userId = decodedToken.userId;
                const isadmin = decodedToken.isadmin;
                if (post.userId !== userId && !isadmin) {
                    res.status(401).json({
                        message: 'Requête non autorisée!'
                    });
                }
                else {
                    // utilisateur a le droit de supprimer 
                    const filename = post.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Post.deleteOne({ _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                            .catch(error => res.status(400).json({ message: error.message }));
                    });
                }
            }

        })
        .catch(error => res.status(500).json({ message: error.message }));
};


exports.modifyPost = (req, res, next) => {
    
        Post.findOne({ _id: req.params.id })
            .then((post) => {
                if (!post) {
                    res.status(404).json({
                        message: 'Post non trouvé !'
                    });
                }
                else {
                    // post dispo 
                    const token = req.headers.authorization.split(' ')[1];
                    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
                    const userId = decodedToken.userId;
                    const isadmin = decodedToken.isadmin;
                    if (post.userId !== userId && !isadmin) {
                        res.status(401).json({
                            message: 'Requête non autorisée!'
                        });
                    }
                    else {

                        if (req.file) {
                            const filename = post.imageUrl.split("/images/")[1];
                            fs.unlink(`images/${filename}`, (err) => {
                                if (err) console.log(err);
                            });
                        }

                        const postObject = req.file
                            ? {
                                ...JSON.parse(req.body.post),
                                imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                                    }`,
                            }
                            : { ...req.body };
                        Post.updateOne(
                            { _id: req.params.id },
                            { ...postObject, _id: req.params.id }
                        )
                            .then(() => res.status(200).json({ message: "Post modifié !" }))
                            .catch((error) => res.status(400).json({ error }));
                                 
                    }
                }
            })
                        .catch((error) => console.log(error));
};

//Like/dislike post
exports.likeOrDislike = (req, res) => {
    like = req.body.like;
    id_post = req.params.id;
    id_user = req.body.userId;
    switch (like) {
        case -1:
            
            //chercher le post
            Post.findOne({ _id: id_post }).then((post) => {
                
                // S'il dislike pas 
                // => j'elimine le dislike
                if (post.usersDisliked.includes(id_user)) {
                    Post.updateOne({ _id: id_post }, {
                        $pull: { usersDisliked: id_user }, $inc: { dislikes: -1 }
                    }).then(() =>
                        res.status(200).json({ message: "Neutre !" }))
                        .catch((error) => res.status(400).json({ message: error.message }));

                }
                else{
                    
            // traitement
            // mettre à jour le nombre de dislike du post +1
            // ajouter le user ID dans la liste des userDislike
            Post.updateOne({ _id: id_post }, {
                $push: { usersDisliked: id_user }, $inc: { dislikes: +1 }
            }).then(() =>
                res.status(200).json({ message: "Je n'aime pas!" }))
                .catch((error) => res.status(400).json({ message: error.message }));
                     }
                    })
                        .catch((error) => res.status(400).json({ message: error.message }));

            break;

        case 0:
            //chercher le post
            Post.findOne({ _id: id_post }).then((post) => {
                // verifier si l'utilisateur like 
                // => eliminer le like
                if (post.usersLiked.includes(id_user)) {
                    Post.updateOne({ _id: id_post }, {
                        $pull: { usersLiked: id_user }, $inc: { likes: -1 }
                    }).then(() =>
                        res.status(200).json({ message: "Neutre !" }))
                        .catch((error) => res.status(400).json({ message: error.message }));

                }
                // S'il dislike pas 
                // => j'elimine le dislike
                if (post.usersDisliked.includes(id_user)) {
                    Post.updateOne({ _id: id_post }, {
                        $pull: { usersDisliked: id_user }, $inc: { dislikes: -1 }
                    }).then(() =>
                        res.status(200).json({ message: "Neutre !" }))
                        .catch((error) => res.status(400).json({ message: error.message }));

                }
            })
                .catch((error) => res.status(400).json({ message: error.message }));

            break;

        case 1:
            
            //chercher le post
            Post.findOne({ _id: id_post }).then((post) => {
                // verifier si l'utilisateur like 
                // => eliminer le like
                if (post.usersLiked.includes(id_user)) {
                    Post.updateOne({ _id: id_post }, {
                        $pull: { usersLiked: id_user }, $inc: { likes: -1 }
                    }).then(() =>
                        res.status(200).json({ message: "Neutre !" }))
                        .catch((error) => res.status(400).json({ message: error.message }));

                }
                else {
            // traitement
            // mettre à jour le nombre de like du post +1
            // ajouter le user ID dans la liste des userlike
            Post.updateOne({ _id: id_post }, {
                $push: { usersLiked: id_user }, $inc: { likes: +1 }
            }).then(() =>
                res.status(200).json({ message: "J'aime !" }))
                .catch((error) => res.status(400).json({ message: error.message }));
                    }
            })
                .catch((error) => res.status(400).json({ message: error.message }));


            break;
    }

}


