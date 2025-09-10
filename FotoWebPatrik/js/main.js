document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const messageContainer = document.querySelector('.kontakt-formular'); // Kde se má zobrazit zpráva

    // Inicializace EmailJS se přesunula do HTML, takže ji zde neopakujeme

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Zabrání standardnímu odeslání formuláře (refresh stránky)

        // Získání hodnot z formuláře
        const formData = {
            from_name: this.name.value,     // 'name' je název inputu
            from_email: this.email.value,   // 'email' je název inputu
            subject: this.subject.value,    // 'subject' je název inputu
            message: this.message.value     // 'message' je název inputu
        };

        // Zobrazení zprávy o odesílání
        displayMessage('Odesílám zprávu...', 'info');

        // Odeslání dat přes EmailJS
        emailjs.send("service_1ur4m2z", "template_mians18", formData) // ZDE ZADEJTE SVÉ ID
            .then(function() {
                console.log('SUCCESS!');
                displayMessage('Vaše zpráva byla úspěšně odeslána! Děkujeme.', 'success');
                contactForm.reset(); // Vyprázdní formulář po úspěšném odeslání
            }, function(error) {
                console.log('FAILED...', error);
                displayMessage('Došlo k chybě při odesílání zprávy. Zkuste to prosím později.', 'error');
            });
    });

    // Funkce pro zobrazení zpráv uživateli
    function displayMessage(text, type) {
        let messageDiv = document.querySelector('#form-message'); // Zkusíme najít existující
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'form-message'; // Pro snadnější aktualizaci
            messageDiv.style.padding = '15px';
            messageDiv.style.borderRadius = '5px';
            messageDiv.style.marginTop = '20px';
            messageDiv.style.textAlign = 'center';
            messageDiv.style.fontWeight = 'bold';
            messageDiv.style.display = 'block'; // Zajistíme, že je viditelný
            
            const formTitle = messageContainer.querySelector('h3');
            if (formTitle) {
                formTitle.after(messageDiv);
            } else {
                messageContainer.prepend(messageDiv);
            }
        }

        messageDiv.textContent = text;
        if (type === 'success') {
            messageDiv.style.backgroundColor = '#d4edda';
            messageDiv.style.color = '#155724';
        } else if (type === 'error') {
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
        } else if (type === 'info') {
            messageDiv.style.backgroundColor = '#d1ecf1';
            messageDiv.style.color = '#0c5460';
        }
    }
});