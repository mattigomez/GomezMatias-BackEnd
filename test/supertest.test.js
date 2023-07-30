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
      
      console.log(tester_email)
      console.log(tester_password)
      console.log('Cookies:', cookies); // Agregar este mensaje para verificar las cookies


       // Agrega una verificación para asegurarte de que las cookies se hayan establecido correctamente
       if (!cookies) {
        throw new Error('Fallo la autenticación: las cookies no se establecieron correctamente.')
      }

    } catch (error) {
      console.error(error)
    }
  })

  it('El endpoint GET /api/dbProducts debe de mostrar todos los productos ', async () => {
    
    // Verifica si las cookies están definidas antes de hacer la solicitud
    if (!cookies) {
      throw new Error('Las cookies no están definidas. La autenticación puede haber fallado en la prueba "before".')
    }

    // Agrega las cookies de sesión a la solicitud de productos
    const getProducts = await requester
      .get('/api/dbProducts')
      .set('Cookie', cookies) // Agrega las cookies a la solicitud

    expect(getProducts.status).to.equal(200)
  });
})