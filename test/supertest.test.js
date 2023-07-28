const chai = require('chai')
const supertest = require('supertest')
const app = require ('../src/app')
const { cartId, productId } = require('../src/config/util.config')
const { testerEmail, testerPassword } = require('../src/config/admin.config')

const expect = chai.expect
const requester = supertest(app)
 
let cookies // Variable global para almacenar las cookies de sesión

describe('test de productos', () => {


  before(async function() {
    this.timeout(10000) //tiempo de espera para el hook before

    // Realiza la autenticación previa antes de todas las pruebas de productos
    try {
      const resLogin = await requester
        .post('/api/login')
        .send({ email: testerEmail, password: testerPassword })
      cookies = resLogin.headers['set-cookie']
    } catch (error) {
      console.error(error)
    }
  })

  it('El endpoint GET /api/dbProducts debe de mostrar todos los productos ', async () => {
    // Agrega las cookies de sesión a la solicitud de productos
    const getProducts = await requester
      .get('/api/dbProducts')
      .set('Cookie', cookies) // Agrega las cookies a la solicitud

    expect(getProducts.status).to.equal(200)
  });

  it('El endpoint POST /api/dbProducts agrega un nuevo producto a la base de datos', async () => {

    const randomProduct = {
      name: 'producto de prueba',
      description: 'descripcion del producto de prueba',
      price: 1124,
      stock: 100,
      category: 'dispositivos',
      code: '12ewh1-1232-d123df',
      status: true,
      img: 'https://imagenRandom.com',
      owner: 'administrador'
    }


    const addProduct = await requester
      .post('/api/dbProducts')
      .send(randomProduct)
      .set('Cookie', cookies)
    
    expect(addProduct.status).to.equal(200)
  })


  it('El endpoint PUT /api/dbProducts/:productId actualiza un producto en la base de datos', async () => {
    // Agrega un producto inicialmente a la base de datos para obtener su ID
    const randomProduct = {
      name: 'producto a actualizar',
      description: 'descripcion del producto a actualizar',
      price: 500,
      stock: 50,
      category: 'actualizables',
      code: 'abcd-1234',
      status: true,
      img: 'https://imagenRandom.com',
      owner: 'administrador'
    }

    const addProduct = await requester
      .post('/api/dbProducts')
      .send(randomProduct)
      .set('Cookie', cookies)

    const productId = addProduct.body.message._id


    // Datos actualizados del producto
    const updatedProductData = {
      name: 'producto actualizado',
      description: 'descripcion del producto actualizado',
      price: 1000,
      stock: 20,
      category: 'actualizables',
      code: 'abcd-1234',
      status: false,
      img: 'https://imagenActualizada.com/productoactualizado.jpeg',
      owner: 'administrador'
    }

    const updateProduct = await requester
      .put(`/api/dbProducts/${productId}`)
      .send(updatedProductData)
      .set('Cookie', cookies)

    expect(updateProduct.status).to.equal(200);
  });

  it('El endpoint DELETE /api/dbProducts/:productId elimina un producto de la base de datos', async () => {
    // Agrega un producto inicialmente a la base de datos para obtener su ID
    const randomProduct = {
      name: 'producto a eliminar',
      description: 'descripcion del producto a eliminar',
      price: 100,
      stock: 10,
      category: 'eliminables',
      code: 'abcd-5678',
      status: true,
      img: 'https://imagenRandom.com',
      owner: 'administrador'
    }

    const addProduct = await requester
      .post('/api/dbProducts')
      .send(randomProduct)
      .set('Cookie', cookies)

    const productId = addProduct.body.message._id;

    const deleteProduct = await requester
      .delete(`/api/dbProducts/${productId}`)
      .set('Cookie', cookies)

    expect(deleteProduct.status).to.equal(200);
  });

});

describe('test de carrito', () => {

  it('El endpoint GET /api/dbCarts/:cid  obtiene un carrito en especifico',async () => {

    const getCart = await requester
      .get(`/api/dbCarts/${cartId}`)
      .set('Cookie', cookies)

    expect(getCart.status).to.equal(200)
  })

  it('El endpoint POST /api/dbCarts/cartId/:productId agrega un producto en especifico a un carrito',async () => {

    const addProductInCart = await requester
      .post(`/api/dbCarts/${cartId}/${productId}`)
      .set('Cookie', cookies)

    expect(addProductInCart.status).to.equal(200)
  })

  it('El endpoint PUT /api/dbCarts/:cid/products/:pid actualiza solo la cantidad de unidades de un producto dentro del carrito', async () => {

    const newQuantity = {
      "quantity":5
    }

    const putQuantityInProduct = await requester
      .put(`/api/dbCarts/${cartId}/products/${productId}`)
      .send(newQuantity)
      .set('Cookie', cookies)

    expect(putQuantityInProduct.status).to.equal(200)
  })

  it('El endpoint PUT /api/dbCarts/:cid actualiza el arreglo de productos del carrito', async () => {

    const newProducts = {
      "productos": [
        {
          "product":"6450057caf3c3c8755334196",
          "quantity": 1
        },
        {
          "product":"64500ee7af3c3c8755334203",
          "quantity": 7
        },
        {
          "product":"64500ee7af3c3c8755334203",
          "quantity": 9
        },
        {
          "product":"64500e4baf3c3c87553341ff",
          "quantity": 2
        }
      ]
    }

    const putProductsInCart = await requester
      .put(`/api/dbCarts/${cartId}`)
      .send(newProducts)
      .set('Cookie', cookies)

    expect(putProductsInCart.status).to.equal(200)
  })



  it('El endpoin POST /api/dbCarts/:cid/products/:pid elimina del carrito el producto seleccionado', async  () => {
    const deleteProductoInCart = await requester
      .post(`/api/dbCarts/${cartId}/products/${productId}`)
      .set('Cookie', cookies)

    expect(deleteProductoInCart.status).to.equal(200)
  })

  it('El enpoint DELETE /api/dbCarts/:cid elimina todos los productos que exitan en el carrito', async () => {
    const deleteAllProducts = await requester
      .delete(`/api/dbCarts/${cartId}`)
      .set('Cookie', cookies)

    expect(deleteAllProducts.status).to.equal(200)
  })
})