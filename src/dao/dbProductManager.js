const Products = require("./models/Products.model");


class DbProductManager{
    constructor(){}

    async addProduct(product){
        return await Products.create(product)
    }

    async getProducts(limit){
        const products = await Products.find()
        return limit ? products.slice(0,limit):products
    }

    async getProductById(id){
        return await Products.findById(id)
    }

    async deleteProduct(id) {
        await Products.deleteOne({ _id: id });
        return true;
    }

    async updateProduct(id, productInfo) {
        await Products.updateOne({ _id: id }, productInfo);
        return true;
    }

}

module.exports = DbProductManager