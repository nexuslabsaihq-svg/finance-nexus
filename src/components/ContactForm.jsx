import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(false);

    try {
      await emailjs.sendForm(
        'service_w5s3fji',
        'template_i5kev56',
        form.current,
        'AaFeUTnro_51gzONX'
      );
      setSent(true);
    } catch (err) {
      console.error('Error enviando email:', err);
      setError(true);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#00d4aa'
      }}>
        <h3>✅ ¡Mensaje enviado!</h3>
        <p>Nos pondremos en contacto contigo pronto.</p>
      </div>
    );
  }

  return (
    <form ref={form} onSubmit={handleSubmit}>

      <div style={{ marginBottom: '16px' }}>
        <label>Nombre completo *</label>
        <input
          type="text"
          name="from_name"
          required
          placeholder="Tu nombre"
          style={{ width: '100%', padding: '12px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>Correo electrónico *</label>
        <input
          type="email"
          name="from_email"
          required
          placeholder="tucorreo@email.com"
          style={{ width: '100%', padding: '12px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>Teléfono / WhatsApp</label>
        <input
          type="tel"
          name="phone"
          placeholder="+56 9 XXXX XXXX"
          style={{ width: '100%', padding: '12px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>Nombre de tu empresa</label>
        <input
          type="text"
          name="company"
          placeholder="Nombre de tu negocio"
          style={{ width: '100%', padding: '12px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label>¿En qué podemos ayudarte? *</label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Cuéntanos qué necesitas..."
          style={{ width: '100%', padding: '12px' }}
        />
      </div>

      {error && (
        <p style={{ color: 'red' }}>
          ❌ Error al enviar. Intenta de nuevo.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: '#FF6B1A',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: sending ? 'not-allowed' : 'pointer'
        }}
      >
        {sending ? 'Enviando...' : 'Enviar mensaje'}
      </button>

    </form>
  );
};

export default ContactForm;