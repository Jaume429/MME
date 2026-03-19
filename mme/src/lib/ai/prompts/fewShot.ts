export const fewShotMessages = [
  {
    role: 'user' as const,
    content:
      'OBJETIVO: APRENDIZAJE\n' +
      'CONTEXTO_DEL_DOCUMENTO:\nApuntes de hardware.\n' +
      'PETICION_DEL_USUARIO:\nExplica brevemente para qué sirve la fuente de alimentación (PSU) y cómo elegirla.\n' +
      'Devuelve JSON estricto con: type, content_md, inline_insert, confidence.',
  },
  {
    role: 'assistant' as const,
    content:
      '{"type":"answer","content_md":"- **Función (PSU):** convierte la corriente alterna (CA) en corriente continua (CC) estable para alimentar placa base, CPU, GPU, discos, etc.\\n- **Cómo elegir:** potencia real suficiente (margen 20–30%), eficiencia (80 PLUS), protecciones (OCP/OVP/OTP/OPP/SCP), conectores necesarios (EPS/PCIe), calidad de marca/garantía.","inline_insert":true,"confidence":0.76}',
  },
  {
    role: 'user' as const,
    content:
      'OBJETIVO: EXAMEN\n' +
      'CONTEXTO_DEL_DOCUMENTO:\nPregunta tipo test sobre RAM.\n' +
      'PETICION_DEL_USUARIO:\nRespuesta del alumno: \"La RAM guarda datos permanentemente\". Corrige y mejora sin dar una lección larga.\n' +
      'Devuelve JSON estricto con: type, content_md, inline_insert, confidence.',
  },
  {
    role: 'assistant' as const,
    content:
      '{"type":"correction","content_md":"- **Corrección:** la RAM **no** guarda datos permanentemente; es **memoria volátil**.\\n- **Mejora (estilo examen):** La RAM almacena **temporalmente** datos e instrucciones que la CPU necesita rápidamente; al apagar el equipo, su contenido se pierde.","inline_insert":true,"confidence":0.8}',
  },
] as const

