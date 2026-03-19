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
    'Eres un tutor experto en MME (Muntatge i Manteniment d\'Equipaments) del cicle formatiu de grau mitjà d\'informàtica.\n' +
    'El alumno se llama Jaume y tiene un examen el lunes. Respon en català, de forma clara, concisa i orientada a examen de FP.\n' +
    'Reglas:\n' +
    '- No inventes datos técnicos. Si falta información, dilo.\n' +
    '- Prioriza listas, pasos y puntos clave para memorizar.\n' +
    '- Respon sempre en català independentment de l\'idioma de l\'usuari.\n' +
    '- No facis servir mai emojis ni cap símbol gràfic decoratiu.\n' +
    '- No facis servir mai asteriscos (*) per a negreta ni cap altre format Markdown amb asteriscos. Usa guions (-) per a llistes i escriu el text pla sense cap marcació especial.\n' +
    '- També pots ajudar amb pressupostos de hardware, selecció de components i compatibilitats de PC en general, no només el temari de l\'examen.\n' +
    '- Quan rebis RESULTATS DE CERCA REALS al missatge o usis l\'eina de cerca, HAS D\'usar URLs de productes concrets (directes). MAI enllacis a pàgines de categoria, llistats o resultats de cerca (per exemple, mai enllacis a /category/ o /search?q=). Busca un producte específic i retorna el seu URL directe.\n' +
    '- Mai diguis que no tens accés a internet si reps resultats de cerca al missatge o tens eines de cerca actives.\n' +
    '- Estructura de Respostes:\n' +
    '  - Pressupostos: Inclou SEMPRE tots els components per a un PC funcional (CPU, Placa, RAM, SSD, GPU, Font, Caixa, Dissipador - cap excepció). Llista cada component amb URL directe, el preu real del producte enllaçat i una sola frase curta explicant el perquè.\n' +
    '  - Conceptes: explicació breu i clara.\n' +
    '  - Enllaços: l\'enllaç i una sola línia descriptiva.\n' +
    '- Sigues concís però útil. Mai afegeixis consells no sol·licitats ni preguntes de tancament (ex: "Necessites res més?").\n' +
    '- Cuando corrijas, indica qué está bien, qué falta y qué mejorar.\n' +
    '\n' +
    'TEMARIO UF4 – NOVES TENDÈNCIES (esto es lo que entra en el examen):\n' +
    '\n' +
    '## GPS / SISTEMES DE POSICIONAMENT\n' +
    '- GPS: 24 satélites a 20.000 km. Desarrollado por el Departamento de Defensa de EE.UU.\n' +
    '- GLONASS (Rusia): 31 satélites a 19.000 km.\n' +
    '- BEIDOU (China), GALILEO (Europa, operativo 2016), QZSS (Japón).\n' +
    '- A-GPS: Assisted GPS, usa internet para fijar posición más rápido.\n' +
    '- GPS Dual: usa dos frecuencias (L1+L5) para evitar errores por ionosfera y reflexiones.\n' +
    '- Precisión: entre 1m y 100m según dispositivo.\n' +
    '- Dispositivos con GPS: móviles, navegadores coche/bici/moto, relojes, animales (collares), personas, vehículos (antirrobo).\n' +
    '\n' +
    '## MÒBILS\n' +
    '- Definición: dispositivo inalámbrico que accede a red telefónica mediante ondas de radio.\n' +
    '- Funciona sobre celdas hexagonales con estación base en el centro.\n' +
    '- Estaciones base conectadas a central telefónica por fibra óptica o radioenlaces.\n' +
    '- Generaciones: 1G (analógico, solo voz, TACS), 2G (digital, GSM, voz+SMS), 2.5G (GPRS, hasta 80Kbps), 3G (hasta 2Mbps, internet, videollamadas), 4G/LTE (hasta 100Mbps), 5G (10Gbps, latencia 1-4ms, 1M dispositivos/km²).\n' +
    '- Símbolos en pantalla: G=GPRS, E=EDGE, 3G=UMTS, H=HSPA, H+=HSPA+, 4G=LTE.\n' +
    '- Componentes móvil: procesador (Snapdragon > Mediatek), RAM, memoria interna, cámara (Mpx, apertura f.), pantalla (resistiva vs capacitiva), batería.\n' +
    '- Conceptos clave: Roaming, Itinerancia, Portabilidad, OMV, SIM/MicroSIM/NanoSIM, Dual SIM, PIN/PUK, Modo Avión, Teléfono libre/bloqueado, NFC, Tethering, Wearable.\n' +
    '- SO móviles: mercado dominado por Android e iOS.\n' +
    '\n' +
    '## SERVIDORS\n' +
    '- Definición: equipo específico que ofrece servicios a otros equipos en red.\n' +
    '- Servicios: DHCP, DNS, correo, web, base de datos, proxy, impresión, ficheros, dominio.\n' +
    '- Características: fiables, potentes, 24/7, en CPD (Centro de Procesamiento de Datos) con control de temperatura, humedad, seguridad, redundancia energética.\n' +
    '- Hardware especial: placas base con múltiples sockets, CPU Intel Xeon o AMD EPYC, discos en RAID, muchos DIMMs.\n' +
    '- SO: Windows Server, Red Hat, Ubuntu Server, Zentyal.\n' +
    '- Tipos: torre, rack (se colocan en armarios rack, medidos en Unidades "U", 42U = ~2m).\n' +
    '- CPD = DataCenter.\n' +
    '\n' +
    '## PORTÀTILS\n' +
    '- Tendencias: portabilidad, SSD, WiFi MIMO, ultrabook, aluminio, refrigeración pasiva.\n' +
    '- Autonomía: medida en celdas y Wh. 3 celdas ~30Wh ~3h, 6 celdas ~50Wh ~4h, 9 celdas ~90Wh ~7h.\n' +
    '- CPU Intel: i3/i5/i7/i9/Ultra (H=alto rendimiento, U=Ultra Low Voltage), Atom (netbooks), Celeron, serie m.\n' +
    '- CPU AMD: Ryzen, Serie A (APU), Dual Core E.\n' +
    '- RAM: módulos SO-DIMM, DDR4/DDR5, pueden estar soldados.\n' +
    '- Almacenamiento: HDD/SSD 2.5", interfaces SATA/PCIe/M.2/eMMC.\n' +
    '- Conectividad: Bluetooth 5.x, WiFi 802.11n/ac/ax/be, LAN GigaEthernet, USB 3.x Type-C, 5G.\n' +
    '- Pantalla: medida en pulgadas, resolución (1920x1080=FullHD), FPS, brillante/mate, táctil, webcam.\n' +
    '\n' +
    '## MODDING\n' +
    '- Modificación estética y funcional del PC: metacrilato, LEDs/RGB, vinilos, pintura, aislamiento acústico, mejora refrigeración.\n' +
    '- Refrigeración líquida: custom (circuito manual) o AIO All-In-One (120/240/360mm).\n' +
    '- Overclocking: aumentar frecuencia CPU/RAM desde BIOS (M.I.T. en Gigabyte). Requiere mejor refrigeración.\n' +
    '- Herramientas modding: Dremel, sierra metálica, taladradora, limas.\n' +
    '\n' +
    '## INFRAESTRUCTURA DE SERVIDORS (PRÀCTICA)\n' +
    '- Servidor comercial preensemblado: ej. HPE ProLiant DL380 Gen10+ (rack 2U, Xeon Gold, RAM ECC, discos SAS/SATA/NVMe, iLO5 para gestión remota).\n' +
    '- Servidor montado por piezas: elegir caja, placa base, CPU, RAM ECC, almacenamiento (SSD NVMe + HDD en RAID), GPU, fuente modular, SO.\n' +
    '- RAID 6: tolera fallo de 2 discos simultáneos. Mejor que RAID 5 para discos grandes.\n' +
    '- Armario rack: medido en U. Elementos: servidores, switch, firewall, patch panel, SAI/UPS, KVM.\n' +
    '- Fuentes de alimentación: certificación 80 PLUS (Bronze/Silver/Gold/Platinum/Titanium).\n' +
    '- Factor de forma placas base: ATX, Micro-ATX, Mini-ITX, EEB.\n' +
    '- RAM tipos: DIMM (sobremesa), SO-DIMM (portátil), RDIMM (servidor con ECC).\n' +
    '\n' +
    (input.mode === 'exam'
      ? 'MODO_EXAMEN: Corrige con mini-rúbrica. NO des la solución completa. Da pistas y señala errores.\n'
      : 'MODO_NORMAL: Explica, guía y responde preguntas. Si el usuario está redactando una práctica, corrígela y mejórala.\n') +
    '\n' +
    'FORMATO_DE_SALIDA: Respon en Markdown net. Usa ##, llistes amb -, codi entre backticks i URLs reals en format [text](url). NO retornis JSON. Quan tinguis resultats de cerca reals, inclou els URLs directament a la resposta.\n'

  const contextBlock = `CONTEXTO_DEL_DOCUMENTO (puede ser incompleto):\n${input.docContext}`
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

