const Products = require("./models/Products.model");


class DbProductManager{
    constructor(){}

    async addProduct(product){
        return await Products.create(product)
    }

    async getProducts(limit, page, sort, query) {
        const internalLimit = limit || 10;
        const internalPage = page || 1;
        let products;
        if (sort) {
            const options = {
                page: internalPage,
                limit: internalLimit,
                sort: { price: sort },
            };
            products =  await Products.paginate(query? { category: query } : {}, options);
        } else {
            products =  await Products.paginate(query? { category: query } : {}, { limit: internalLimit, page: internalPage });
        }}

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