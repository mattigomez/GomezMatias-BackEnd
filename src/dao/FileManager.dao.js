const fs = require('fs')

class FileManager {
  products = []
  constructor() {}

  async loadItems() {
    if (fs.existsSync(process.cwd() + '/src/files/Products.json')) {
      const data = await fs.promises.readFile(
        process.cwd() + '/src/files/Products.json'
      )
      const newProduct = JSON.parse(data)
      console.log('desde la clase')
      return newProduct
    }
    return 'El archivo no existe'
  }

  async saveItems() {
    await fs.promises.writeFile()
  }
}

module.exports = FileManager
