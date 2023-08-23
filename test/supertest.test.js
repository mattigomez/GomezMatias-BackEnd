const chai = require('chai')
const supertest = require('supertest')
const app = require ('../src/app.js')
const { tester_email, tester_password } = require('../src/config/admin.config')


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
        .send({ email: tester_email, password: tester_password })
      cookies = resLogin.headers['set-cookie']

       // Agrega una verificación para asegurarte de que las cookies se hayan establecido correctamente
       if (!cookies) {
        throw new Error('Fallo la autenticación: las cookies no se establecieron correctamente.')
      }

    } catch (error) {
      console.error(error)
    }
  })

  it('El endpoint GET /api/dbProducts debe de mostrar todos los productos con o sin filtros', async () => {
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
    // Agrega un producto inicialmente a la base de datos para obtener su id
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