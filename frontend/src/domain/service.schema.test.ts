import { createServiceSchema } from './service.schema';

// 'describe' agrupa las pruebas de una misma cosa
describe('Capa de Dominio: createServiceSchema', () => {

  // 'it' o 'test' es la prueba individual
  it('Debe aceptar un título y descripción válidos', () => {
    const datosValidos = {
      title: "Reparación de motor",
      description: "El cliente reporta un ruido extraño en el motor.",
    };

    // parse() revisa los datos. Si son válidos, pasa limpio. Si no, lanza un error.
    const resultado = createServiceSchema.parse(datosValidos);
    
    // expect() es nuestra afirmación. Afirmamos que el título es igual al que enviamos.
    expect(resultado.title).toBe("Reparación de motor");
  });

  it('Debe rechazar un título que solo tenga números (El error que descubriste)', () => {
    const datosInvalidos = {
      title: "1231234", // Solo números
      description: "El cliente reporta un ruido extraño en el motor.",
    };

    // safeParse() revisa los datos sin romper la aplicación, solo nos dice si fue exitoso o no
    const resultado = createServiceSchema.safeParse(datosInvalidos);

    // Afirmamos que el éxito debe ser FALSO
    expect(resultado.success).toBe(false);
    
    // Y verificamos que Zod haya arrojado un error (nuestro mensaje de regex)
    if (!resultado.success) {
      expect(resultado.error.issues[0].message).toBe("El título no puede ser solo números, debe contener letras");
    }
  });

});