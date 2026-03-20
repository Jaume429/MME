import { fewShotMessages } from '@/lib/ai/prompts/fewShot'

export type TutorMode = 'normal' | 'exam'
export type TutorIntent = 'ask' | 'improve' | 'ghost'

export function buildTutorPrompt(input: {
  docContext: string
  selection?: string
  userText: string
  mode: TutorMode
  intent: TutorIntent
}) {
  const system =
    'Eres un tutor experto en MME (Muntatge i Manteniment d\'Equipaments) para Jaume. Respon en català (clara, concisa, orientada a examen FP).\n' +
    'Reglas:\n' +
    '- No inventes datos. Sin emojis ni asteriscos (usa guiones para listas, texto plano).\n' +
    '- Prioriza listas y puntos clave. Respon siempre en català.\n' +
    '- Ayuda con temario y presupuestos PC: incluye CPU, Placa, RAM, SSD, GPU, Fuente, Caja, Disipador.\n' +
    '- URLs: siempre directas a producto (evita categorías/búsqueda). No digas que no tienes internet si hay herramientas activas.\n' +
    '- Estructura: Presupuestos (componente + URL + precio + frase corta). Conceptos: breves. Enlaces: URL + línea descriptiva.\n' +
    '- Sin consejos no solicitados ni cierres ("¿Algo más?"). Al corregir: indica aciertos, faltas y mejoras.\n' +
    '\n' +
    'TEMARIO UF4 – NOVES TENDÈNCIES (Examen):\n' +
    '## GPS: 24 sat (20k km, EUA). GLONASS (31 sat, 19k km). BEIDOU, GALILEO (2016), QZSS. A-GPS (internet). Dual (L1+L5). Precisión 1-100m. Usos: móviles, coches, relojes, animales, antirrobo.\n' +
    '## MÒBILS: Red celdas hex. Estación base -> central (fibra/radio). 1G (voz), 2G (GSM/SMS), 2.5G (GPRS 80k), 3G (2M), 4G/LTE (100M), 5G (10G, 1-4ms, 1M disp/km²). Iconos: G (GPRS), E (EDGE), 3G (UMTS), H/H+ (HSPA), 4G (LTE). Snapdragon/Mediatek. Conceptos: Roaming, Portabilidad, OMV, SIM/micro/nano, NFC, Tethering, Wearable.\n' +
    '## SERVIDORS: Servició a red (DHCP, DNS, web, BD, proxy). CPD: control temp/hum, redundancia. HW: multi-socket, Xeon/EPYC, RAID, RAM ECC (RDIMM). Tipos: torre, rack (U, 42U~2m).\n' +
    '## PORTÀTILS: Ultrabook, ref. pasiva, aluminio. Batería: 3c~30Wh(3h), 6c~50Wh(4h), 9c~90Wh(7h). CPU: Intel (H, U, Atom, m), AMD (Ryzen, APU). RAM SO-DIMM (soldada?). M.2/SATA/eMMC. WiFi (n/ac/ax/be), BT 5.x.\n' +
    '## MODDING/OC: Estética/funcional. RL: Custom/AIO (120/240/360mm). OC: subir frecuencia CPU/RAM (M.I.T. BIOS). Herramientas: Dremel, sierra, limas.\n' +
    '## INFRAESTRUCTURA: HPE ProLiant (rack 2U, Xeon, iLO5). RAID 6 (falla 2 discos). Fuente 80 PLUS (Gold/Plat/etc). Formatos: ATX, mATX, ITX, EEB. RAM: DIMM (PC), SO-DIMM (Laptop), RDIMM (Server).\n' +
    '\n' +
    (input.mode === 'exam'
      ? 'MODO_EXAMEN: Corrige con mini-rúbrica. NO des la solución. Da pistas y señala errores.\n'
      : 'MODO_NORMAL: Guía y responde. Si hay práctica, corrígela/mejórala.\n') +
    '\n' +
    'FORMATO_DE_SALIDA: Respon en Markdown net. Usa ##, llistes amb -, codi entre backticks i URLs reals en format [text](url). NO retornis JSON. Quan tinguis resultats de cerca reals, inclou els URLs directament a la resposta.\n'

  const truncatedContext = input.docContext.slice(0, 500)
  const contextBlock = `CONTEXTO_DEL_DOCUMENTO (puede ser incompleto):\n${truncatedContext}`
  const selectionBlock = input.selection ? `\nTEXTO_SELECCIONADO:\n${input.selection}` : ''

  const objective = input.mode === 'exam' ? 'EXAMEN' : 'APRENDIZAJE'
  const intentLine =
    input.intent === 'ghost'
      ? 'INTENCION: AUTOCOMPLETE (máx 1 frase, sin explicación, termina la frase del usuario)'
      : input.intent === 'improve'
        ? 'INTENCION: MEJORAR/CORREGIR (mantén el contenido, mejora claridad y precisión)'
        : 'INTENCION: PREGUNTA/AYUDA'

  const user =
    `OBJETIVO: ${objective}\n` +
    `${intentLine}\n` +
    `${contextBlock}${selectionBlock}\n` +
    `\nPETICION_DEL_USUARIO:\n${input.userText}\n` +
    `\nRespon en Markdown net. Si tens eines de cerca actives, usa-les per obtenir URLs reals.`

  return {
    system,
    messages: [...fewShotMessages, { role: 'user' as const, content: user }],
  }
}

