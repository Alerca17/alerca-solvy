import { createServiceSchema } from './service.schema';

// 'describe' agrupa las pruebas de una misma cosa
describe('Capa de Dominio: createServiceSchema', () => {

  it('Debe aceptar un título y descripción válidos', () => {
    const datosValidos = {
      title: "Reparación de motor",
      description: "El cliente reporta un ruido extraño en el motor.",
    };

    const resultado = createServiceSchema.parse(datosValidos);
    
    expect(resultado.title).toBe("Reparación de motor");
  });

  it('Debe rechazar un título que solo tenga números (El error que descubriste)', () => {
    const datosInvalidos = {
      title: "1231234", 
      description: "El cliente reporta un ruido extraño en el motor.",
    };

    const resultado = createServiceSchema.safeParse(datosInvalidos);

    expect(resultado.success).toBe(false);
    
    if (!resultado.success) {
      expect(resultado.error.issues[0].message).toBe("El título no puede ser solo números, debe contener letras");
    }
  });

});