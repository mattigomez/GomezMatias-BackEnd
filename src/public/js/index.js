const socket = io();

const swal = async () => {
    const chatTextBox = document.getElementById('chatTextBox');
    
    try {
        const result = await Swal.fire({
            title: 'Identificate',
            input: 'email',
            inputLabel: 'Ingresa tu correo electrónico para chatear',
            inputPlaceholder: 'Ingresa tu correo electrónico',
            allowOutsideClick: false,
        });

        const user = result.value;

        socket.emit('newUser', user);

        socket.on('userConnected', user => {
            Swal.fire({
                text: `Se acaba de conectar ${user} al chat`,
                toast: true,
                position: 'top-right',
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
                icon: 'success',
            });
        });

        socket.on('messageLogs', data => {
            const chatMessages = document.getElementById('messages');
            let messages = '';
            data.forEach(element => {
                messages = messages + `${element.user}: ${element.message}<br>`;                
            });
            chatMessages.innerHTML = messages;
        });

        chatTextBox.addEventListener('keyup', e => {
            if (e.key === 'Enter') {
                if (chatTextBox.value.trim().length > 0) {
                    socket.emit('message', { user, message: chatTextBox.value });
                    chatTextBox.value = '';
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
}

swal();