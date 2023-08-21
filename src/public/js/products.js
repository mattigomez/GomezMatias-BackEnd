 // Añadir un evento de escucha para el envío del formulario
 const addToCartForms = document.querySelectorAll('.addToCartForm');
 addToCartForms.forEach(form => {
   form.addEventListener('submit', async event => {
     event.preventDefault();

     const formElement = event.target;
     const formData = new FormData(formElement);

     try {
       const response = await fetch(formElement.action, {
         method: 'POST',
         body: formData
       });

       if (response.ok) {
         console.log('Producto agregado al carrito con éxito.');
         location.reload(); // Recargar la página
       } else {
         console.error('Error al agregar el producto al carrito.');
       }
     } catch (error) {
       console.error('Error de red:', error);
     }
   });
 });