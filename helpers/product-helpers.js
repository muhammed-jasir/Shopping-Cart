const db = require('../config/connection')
const collections = require("../config/collections");
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

module.exports = {
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            const defAdmin = {
                name: 'Shopping Cart',
                email: '$2b$10$xqMJOC2BXeNn.4htqqlgkOKmyzHgu4Dv9K1sin0cYSG7VzqR1tzoS',
                password: '$2b$10$5ys.vSbeXx.So.IpmWC/0.PEt3mzg1AUb6LmyfrEgNnMmJZooEi0O'
            };
            
            const adminDataExist = await db.get().collection(collections.ADMIN_COLLECTION).findOne({});

            if (adminDataExist) {
                if (adminData.name === adminDataExist.name) {
                    bcrypt.compare(adminData.email, adminDataExist.email).then((emailMatch) => {
                        if (emailMatch) {
                            bcrypt.compare(adminData.password, adminDataExist.password).then((passwordMatch) => {
                                if (passwordMatch) {
                                    resolve({ status: true, admin: adminDataExist });
                                } else {
                                    resolve({ status: false, message: "Invalid Password" });
                                }
                            });
                        } else {
                            resolve({ status: false, message: "Invalid Email" });
                        }
                    });
                } else {
                    resolve({ status: false, message: "Invalid Admin Name" });
                }
            } else {
                await db.get().collection(collections.ADMIN_COLLECTION).insertOne(defAdmin);
                resolve({ status: false, message: "Default admin created. Please log in again." });
            }
        });
    },

    addProduct: (product) => {
        console.log(product);
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).insertOne(product)
                .then((data) => {
                    resolve(data.insertedId);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    updateProductImage: (productId, imagePath) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                { _id: new ObjectId(productId) },
                { $set: { image: imagePath } }
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray();
                resolve(products);
            } catch (err) {
                reject(err);
            }
        });
    },

    deleteProduct: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({ _id: new ObjectId(productId) })
                .then((response) => {
                    resolve(response);
                });
        });
    },

    getProductDetails: (productId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id: new ObjectId(productId) })
                .then((product) => {
                    resolve(product);
                });
        });
    },

    updateProduct: (productId, product) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION)
                .updateOne({ _id: new ObjectId(productId) }, {
                    $set: {
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        category: product.category
                    }
                }).then((response) => {
                    resolve();
                });
        });
    }
};